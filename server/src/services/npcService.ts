import { z } from 'zod';
import { Transaction } from 'sequelize';
import { NPC, NPCCombatProfile } from '@/models';
import { IAIProvider } from '@/provider/aiProvider';
import { loadPrompt } from '@/utils/promptLoader';
import { LoggerService } from '@/services/loggerService';
import {
  CreateNpcDTO,
  GenerateNpcsDTO,
  GeneratedNpcWithPoiReturn,
  NpcPosition,
  NpcDataReturn,
  NpcBriefListAIResponse,
  NpcDetailAIResponse,
  CreateNpcCombatProfileDTO,
  NpcCombatProfileAIResponse,
  NpcCombatProfileDataReturn,
} from '@/interfaces/INpc';

// ==========================================
// Zod schemas for AI response validation
// ==========================================

const NpcPositionAISchema = z.object({
  x: z.number().int(),
  y: z.number().int(),
});

const NpcBriefItemAISchema = z.object({
  name: z.string().min(1).max(100),
  raceId: z.number().int(),
  poiId: z.number().int(),
  alignment: z.string().min(1).max(50),
  personality: z.string().min(1).max(300),
  position: NpcPositionAISchema.default({ x: 0, y: 0 }),
  isCombatNpc: z.boolean().default(false),
});

const NpcBriefListAISchema = z.object({
  npcs: z.array(NpcBriefItemAISchema).min(1),
});

const NpcDetailAISchema = z.object({
  name: z.string().min(1).max(100),
  alignment: z.string().min(1).max(50),
  appearance: z.string().min(1).max(1500),
  personality: z.string().min(1).max(1500),
  backstory: z.string().min(1).max(1500),
  mannerism: z.string().min(1).max(1000),
});

const NpcStatAISchema = z.object({
  str: z.number().int(),
  dex: z.number().int(),
  con: z.number().int(),
  int: z.number().int(),
  wis: z.number().int(),
  cha: z.number().int(),
});

const NpcActionAISchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

const NpcCombatProfileAISchema = z.object({
  ac: z.number().int(),
  maxHp: z.number().int(),
  hp: z.number().int(),
  stat: NpcStatAISchema,
  speed: z.number().int(),
  actions: z.array(NpcActionAISchema),
  crEquivalent: z.number().nullable(),
});

// ==========================================
// Helper to format POI ASCII maps for prompt context
// ==========================================

type FormattedPoiContext = {
  id: number;
  name: string;
  description: string | null;
  asciiMap: unknown;
};

function formatPoisForContext(pois: GenerateNpcsDTO['pois']): FormattedPoiContext[] {
  return pois.map((poi) => {
    let asciiMap: unknown = poi.map ?? null;
    if (poi.map) {
      try {
        const parsed = JSON.parse(poi.map);
        if (Array.isArray(parsed.map)) {
          const gridWithCoordinates = parsed.map.map((row: string | string[], rowIndex: number) => {
            const rowStr = Array.isArray(row) ? row.join('') : row;
            return `y=${rowIndex.toString().padStart(2, ' ')}: ${rowStr}`;
          });
          asciiMap = {
            grid: gridWithCoordinates,
            legend: parsed.legend,
          };
        }
      } catch {
        asciiMap = poi.map;
      }
    }

    return {
      id: poi.id,
      name: poi.name,
      description: poi.description,
      asciiMap,
    };
  });
}

// ==========================================
// Interface
// ==========================================

export interface INpcService {
  getNpcBriefPrompt(): string;
  getNpcDetailPrompt(): string;
  getNpcCombatProfilePrompt(): string;
  generateNpcs(
    data: GenerateNpcsDTO,
    campaignId: number,
    transaction?: Transaction
  ): Promise<GeneratedNpcWithPoiReturn[]>;
  create(data: CreateNpcDTO, campaignId: number, transaction?: Transaction): Promise<NpcDataReturn>;
  createBulk(data: CreateNpcDTO[], campaignId: number, transaction?: Transaction): Promise<NpcDataReturn[]>;
  createCombatProfile(
    data: CreateNpcCombatProfileDTO,
    transaction?: Transaction
  ): Promise<NpcCombatProfileDataReturn>;
  createCombatProfileBulk(
    data: CreateNpcCombatProfileDTO[],
    transaction?: Transaction
  ): Promise<NpcCombatProfileDataReturn[]>;
}

// ==========================================
// Implementation
// ==========================================

export class NpcService implements INpcService {
  private logger = new LoggerService('NpcService');

  constructor(private aiProvider: IAIProvider) {}

  // ------------------------------------------
  // Prompt methods
  // ------------------------------------------

  getNpcBriefPrompt(): string {
    return loadPrompt('GENERATE_NPC_BRIEF.md');
  }

  getNpcDetailPrompt(): string {
    return loadPrompt('GENERATE_NPC_DETAILED.md');
  }

  getNpcCombatProfilePrompt(): string {
    return loadPrompt('GENERATE_NPC_COMBAT_PROFILE.md');
  }

  // ------------------------------------------
  // AI-powered generation methods
  // ------------------------------------------

  async generateNpcs(
    data: GenerateNpcsDTO,
    campaignId: number,
    transaction?: Transaction
  ): Promise<GeneratedNpcWithPoiReturn[]> {
    const briefSystemPrompt = this.getNpcBriefPrompt();

    const worldContext = JSON.stringify(
      {
        name: data.world.name,
        description: data.world.description,
        currencyName: data.world.currencyName,
      },
      null,
      2
    );

    const formattedPois = formatPoisForContext(data.pois);

    const briefUserMessage = [
      `Theme: ${data.themePrompt}`,
      `Campaign language: ${data.language}`,
      '',
      'World context:',
      worldContext,
      '',
      'Available Races:',
      JSON.stringify(data.races, null, 2),
      '',
      'Available Points of Interest (POIs) with ASCII Maps:',
      JSON.stringify(formattedPois, null, 2),
    ].join('\n');

    this.logger.info('Requesting brief NPC roster from AI...');
    const briefRaw = await this.aiProvider.chatJSON<NpcBriefListAIResponse>([
      { role: 'system', content: briefSystemPrompt },
      { role: 'user', content: briefUserMessage },
    ]);

    const briefParsed = NpcBriefListAISchema.parse(briefRaw);
    this.logger.info(
      `Generated ${briefParsed.npcs.length} brief NPCs: ${briefParsed.npcs.map((n) => `"${n.name}"`).join(', ')}`
    );

    const validRaceIds = new Set(data.races.map((r) => r.id));
    const fallbackRaceId = data.races[0]?.id ?? null;
    const validPoiIds = new Set(data.pois.map((p) => p.id));
    const fallbackPoiId = data.pois[0]?.id ?? 1;

    const npcsToCreate: { dto: CreateNpcDTO; poiId: number; position: NpcPosition }[] = [];
    const combatProfilesToCreate: { dto: NpcCombatProfileAIResponse; index: number }[] = [];

    for (let i = 0; i < briefParsed.npcs.length; i++) {
      const stub = briefParsed.npcs[i];
      const resolvedRaceId = validRaceIds.has(stub.raceId) ? stub.raceId : fallbackRaceId;
      const resolvedPoiId = validPoiIds.has(stub.poiId) ? stub.poiId : fallbackPoiId;

      this.logger.info(`[${i + 1}/${briefParsed.npcs.length}] Generating details for NPC "${stub.name}"...`);

      const selectedRace = data.races.find((r) => r.id === resolvedRaceId);
      const selectedPoi = formattedPois.find((p) => p.id === resolvedPoiId);
      const otherNpcsBrief = JSON.stringify(
        briefParsed.npcs.filter((n) => n.name !== stub.name),
        null,
        2
      );

      const detailSystemPrompt = this.getNpcDetailPrompt();
      const detailUserMessage = [
        `Theme: ${data.themePrompt}`,
        `Campaign language: ${data.language}`,
        '',
        'World context:',
        worldContext,
        '',
        'Selected Race:',
        JSON.stringify(selectedRace ?? { id: resolvedRaceId }, null, 2),
        '',
        'Selected Location (POI):',
        JSON.stringify(selectedPoi ?? { id: resolvedPoiId }, null, 2),
        '',
        'Other NPCs brief (for context and variety):',
        otherNpcsBrief,
        '',
        'Target NPC brief (you MUST expand this one):',
        JSON.stringify(
          {
            name: stub.name,
            alignment: stub.alignment,
            personality: stub.personality,
            raceId: resolvedRaceId,
            poiId: resolvedPoiId,
            position: stub.position,
          },
          null,
          2
        ),
      ].join('\n');

      const detailRaw = await this.aiProvider.chatJSON<NpcDetailAIResponse>([
        { role: 'system', content: detailSystemPrompt },
        { role: 'user', content: detailUserMessage },
      ]);

      const detailParsed = NpcDetailAISchema.parse(detailRaw);

      npcsToCreate.push({
        dto: {
          name: detailParsed.name || stub.name,
          raceId: resolvedRaceId,
          alignment: detailParsed.alignment || stub.alignment,
          appearance: detailParsed.appearance,
          personality: detailParsed.personality || stub.personality,
          backstory: detailParsed.backstory,
          mannerism: detailParsed.mannerism,
          memory: [],
          npcRelationship: [],
          playerRelationship: [],
          isCompanion: false,
        },
        poiId: resolvedPoiId,
        position: stub.position,
      });

      if (stub.isCombatNpc) {
        this.logger.info(`Generating combat profile for NPC "${stub.name}"...`);
        const combatSystemPrompt = this.getNpcCombatProfilePrompt();
        const combatUserMessage = [
          `Theme: ${data.themePrompt}`,
          `Campaign language: ${data.language}`,
          '',
          'NPC Detail:',
          JSON.stringify(detailParsed, null, 2),
        ].join('\n');

        const combatRaw = await this.aiProvider.chatJSON<NpcCombatProfileAIResponse>([
          { role: 'system', content: combatSystemPrompt },
          { role: 'user', content: combatUserMessage },
        ]);

        const combatParsed = NpcCombatProfileAISchema.parse(combatRaw);
        combatProfilesToCreate.push({
          dto: combatParsed,
          index: i,
        });
      }
    }

    const createdNpcs = await this.createBulk(
      npcsToCreate.map((item) => item.dto),
      campaignId,
      transaction
    );

    if (combatProfilesToCreate.length > 0) {
      this.logger.info(`Bulk creating ${combatProfilesToCreate.length} NPC combat profiles...`);
      const combatProfilesDto: CreateNpcCombatProfileDTO[] = combatProfilesToCreate.map((profile) => ({
        npcId: createdNpcs[profile.index].id,
        ac: profile.dto.ac,
        maxHp: profile.dto.maxHp,
        hp: profile.dto.hp,
        stat: profile.dto.stat,
        speed: profile.dto.speed,
        actions: profile.dto.actions,
        crEquivalent: profile.dto.crEquivalent,
      }));

      await this.createCombatProfileBulk(combatProfilesDto, transaction);
      this.logger.success(`Successfully saved ${combatProfilesDto.length} NPC combat profiles in bulk`);
    }

    const results: GeneratedNpcWithPoiReturn[] = createdNpcs.map((npc, idx) => ({
      npc,
      poiId: npcsToCreate[idx].poiId,
      position: npcsToCreate[idx].position,
    }));

    this.logger.success(`Successfully saved ${results.length} NPCs in bulk`);
    return results;
  }

  // ------------------------------------------
  // Direct DB persistence methods
  // ------------------------------------------

  async create(data: CreateNpcDTO, campaignId: number, transaction?: Transaction): Promise<NpcDataReturn> {
    const npc = await NPC.create(
      {
        campaign_id: campaignId,
        race_id: data.raceId ?? null,
        name: data.name,
        alignment: data.alignment ?? null,
        appearance: data.appearance ?? null,
        personality: data.personality ?? null,
        backstory: data.backstory ?? null,
        mannerism: data.mannerism ?? null,
        memory: data.memory ?? [],
        npc_relationship: data.npcRelationship ?? [],
        player_relationship: data.playerRelationship ?? [],
        is_companion: data.isCompanion ?? false,
      },
      { transaction: transaction ?? undefined }
    );

    return this.toReturn(npc);
  }

  async createBulk(data: CreateNpcDTO[], campaignId: number, transaction?: Transaction): Promise<NpcDataReturn[]> {
    if (data.length === 0) return [];

    const npcs = await NPC.bulkCreate(
      data.map((d) => ({
        campaign_id: campaignId,
        race_id: d.raceId ?? null,
        name: d.name,
        alignment: d.alignment ?? null,
        appearance: d.appearance ?? null,
        personality: d.personality ?? null,
        backstory: d.backstory ?? null,
        mannerism: d.mannerism ?? null,
        memory: d.memory ?? [],
        npc_relationship: d.npcRelationship ?? [],
        player_relationship: d.playerRelationship ?? [],
        is_companion: d.isCompanion ?? false,
      })),
      { transaction: transaction ?? undefined, returning: true }
    );

    return npcs.map((n) => this.toReturn(n));
  }

  async createCombatProfile(
    data: CreateNpcCombatProfileDTO,
    transaction?: Transaction
  ): Promise<NpcCombatProfileDataReturn> {
    const profile = await NPCCombatProfile.create(
      {
        npc_id: data.npcId,
        ac: data.ac,
        max_hp: data.maxHp,
        hp: data.hp,
        stat: data.stat,
        speed: data.speed,
        actions: data.actions,
        cr_equivalent: data.crEquivalent,
      },
      { transaction: transaction ?? undefined }
    );

    return this.toCombatProfileReturn(profile);
  }

  async createCombatProfileBulk(
    data: CreateNpcCombatProfileDTO[],
    transaction?: Transaction
  ): Promise<NpcCombatProfileDataReturn[]> {
    if (data.length === 0) return [];

    const profiles = await NPCCombatProfile.bulkCreate(
      data.map((d) => ({
        npc_id: d.npcId,
        ac: d.ac,
        max_hp: d.maxHp,
        hp: d.hp,
        stat: d.stat,
        speed: d.speed,
        actions: d.actions,
        cr_equivalent: d.crEquivalent,
      })),
      { transaction: transaction ?? undefined, returning: true }
    );

    return profiles.map((p) => this.toCombatProfileReturn(p));
  }

  private toReturn(npc: NPC): NpcDataReturn {
    return {
      id: npc.id,
      campaignId: npc.campaign_id,
      raceId: npc.race_id,
      name: npc.name,
      alignment: npc.alignment,
      appearance: npc.appearance,
      personality: npc.personality,
      backstory: npc.backstory,
      mannerism: npc.mannerism,
      memory: npc.memory ?? [],
      npcRelationship: npc.npc_relationship ?? [],
      playerRelationship: npc.player_relationship ?? [],
      isCompanion: npc.is_companion,
      createdAt: npc.created_at,
    };
  }

  private toCombatProfileReturn(profile: NPCCombatProfile): NpcCombatProfileDataReturn {
    return {
      id: profile.id,
      npcId: profile.npc_id,
      ac: profile.ac,
      maxHp: profile.max_hp,
      hp: profile.hp,
      stat: profile.stat,
      speed: profile.speed,
      actions: profile.actions,
      crEquivalent: profile.cr_equivalent !== null ? Number(profile.cr_equivalent) : null,
      createdAt: profile.created_at,
    };
  }
}
