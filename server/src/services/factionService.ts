import { z } from 'zod';
import { Transaction } from 'sequelize';
import { Faction } from '@/models';
import { IAIProvider } from '@/provider/aiProvider';
import { loadPrompt } from '@/utils/promptLoader';
import { LoggerService } from '@/services/loggerService';
import {
  CreateFactionDTO,
  GenerateFactionDTO,
  FactionListAIResponse,
  FactionDetailAIResponse,
  FactionDataReturn,
} from '@/interfaces/IFaction';

// ==========================================
// Zod schemas for AI response validation
// ==========================================

const FactionListAISchema = z.object({
  factions: z.array(
    z.object({
      name: z.string().min(1),
      description: z.string().min(1),
    })
  ).min(1),
});

const FactionDetailAISchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  reputation: z.string().default('neutral'),
  influence: z.number().min(0).max(100).default(50),
});

// ==========================================
// Interface
// ==========================================

export interface IFactionService {
  getFactionListPrompt(): string;
  getFactionDetailPrompt(): string;
  generateFactions(data: GenerateFactionDTO, campaignId: number, transaction?: Transaction): Promise<FactionDataReturn[]>;
  create(data: CreateFactionDTO, campaignId: number, transaction?: Transaction): Promise<FactionDataReturn>;
  createBulk(data: CreateFactionDTO[], campaignId: number, transaction?: Transaction): Promise<FactionDataReturn[]>;
}

// ==========================================
// Implementation
// ==========================================

export class FactionService implements IFactionService {
  private logger = new LoggerService('FactionService');

  constructor(private aiProvider: IAIProvider) { }

  // ------------------------------------------
  // Prompt methods (content to be filled later)
  // ------------------------------------------

  getFactionListPrompt(): string {
    return loadPrompt('GENERATE_FACTION_BRIEF.md');
  }

  getFactionDetailPrompt(): string {
    return loadPrompt('GENERATE_FACTION_DETAILED.md');
  }

  // ------------------------------------------
  // AI-powered generation methods
  // ------------------------------------------

  /**
   * Generates factions in two phases:
   * 1. Calls AI with world context + map overview to generate brief faction stubs (name + simple description).
   * 2. Loops through each stub, calling AI to generate full details (reputation, influence, detailed description).
   * 3. Persists each detailed faction to the DB.
   */
  async generateFactions(
    data: GenerateFactionDTO,
    campaignId: number,
    transaction?: Transaction
  ): Promise<FactionDataReturn[]> {
    const listSystemPrompt = this.getFactionListPrompt();

    const worldContext = JSON.stringify(
      {
        name: data.world.name,
        description: data.world.description,
        currencyName: data.world.currencyName,
      },
      null,
      2
    );

    const mapContext = JSON.stringify(
      {
        descriptiveOverview: data.map.descriptiveOverview,
      },
      null,
      2
    );

    const listUserMessage = [
      `Theme: ${data.themePrompt}`,
      `Campaign language: ${data.language}`,
      '',
      'World context:',
      worldContext,
      '',
      'Map context:',
      mapContext,
    ].join('\n');

    this.logger.info('Requesting brief faction list from AI...');
    const listRaw = await this.aiProvider.chatJSON<FactionListAIResponse>([
      { role: 'system', content: listSystemPrompt },
      { role: 'user', content: listUserMessage },
    ]);

    const listParsed = FactionListAISchema.parse(listRaw);
    this.logger.info(
      `Generated ${listParsed.factions.length} brief factions: ${listParsed.factions.map((f) => `"${f.name}"`).join(', ')}`
    );

    const results: FactionDataReturn[] = [];

    for (let i = 0; i < listParsed.factions.length; i++) {
      const stub = listParsed.factions[i];
      this.logger.info(`[${i + 1}/${listParsed.factions.length}] Generating detailed profile for "${stub.name}"...`);

      const detailSystemPrompt = this.getFactionDetailPrompt();

      const detailUserMessage = [
        `Theme: ${data.themePrompt}`,
        `Campaign language: ${data.language}`,
        '',
        'World context:',
        worldContext,
        '',
        'Map context:',
        mapContext,
        '',
        'Other Faction brief (for context only)',
        JSON.stringify(listParsed.factions.filter((item) => item.name !== stub.name), null, 2),
        '',
        'Target Faction brief (you MUST expand this one):',
        JSON.stringify({ name: stub.name, description: stub.description }, null, 2),
      ].join('\n');

      const detailRaw = await this.aiProvider.chatJSON<FactionDetailAIResponse>([
        { role: 'system', content: detailSystemPrompt },
        { role: 'user', content: detailUserMessage },
      ]);

      const detailParsed = FactionDetailAISchema.parse(detailRaw);

      const faction = await this.create(
        {
          name: detailParsed.name,
          description: detailParsed.description,
          reputation: detailParsed.reputation,
          influence: detailParsed.influence,
        },
        campaignId,
        transaction
      );

      this.logger.success(
        `[${i + 1}/${listParsed.factions.length}] Saved "${faction.name}" (Reputation: ${faction.reputation}, Influence: ${faction.influence})`
      );

      results.push(faction);
    }

    return results;
  }


  async create(data: CreateFactionDTO, campaignId: number, transaction?: Transaction): Promise<FactionDataReturn> {
    const faction = await Faction.create(
      {
        campaign_id: campaignId,
        name: data.name,
        description: data.description ?? null,
        reputation: data.reputation ?? 'neutral',
        influence: data.influence ?? 50,
      },
      { transaction: transaction ?? undefined }
    );

    return this.toReturn(faction);
  }

  async createBulk(data: CreateFactionDTO[], campaignId: number, transaction?: Transaction): Promise<FactionDataReturn[]> {
    const results: FactionDataReturn[] = [];

    for (const factionData of data) {
      const faction = await this.create(factionData, campaignId, transaction);
      results.push(faction);
    }

    return results;
  }

  private toReturn(faction: any): FactionDataReturn {
    return {
      id: faction.id,
      campaignId: faction.campaign_id,
      name: faction.name,
      description: faction.description,
      reputation: faction.reputation,
      influence: faction.influence,
      createdAt: faction.createdAt,
    };
  }
}
