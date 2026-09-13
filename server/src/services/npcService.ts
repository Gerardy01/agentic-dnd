import { Transaction } from 'sequelize';
import { NPC } from '@/models';
import { CreateNpcDTO, NpcDataReturn } from '@/interfaces/INpc';

export interface INpcService {
  getCreatePrompt(): string;
  create(data: CreateNpcDTO, campaignId: number, transaction?: Transaction): Promise<NpcDataReturn>;
  createBulk(data: CreateNpcDTO[], campaignId: number, transaction?: Transaction): Promise<NpcDataReturn[]>;
}

export class NpcService implements INpcService {
  constructor() {}

  getCreatePrompt(): string {
    // TODO: return the AI prompt for generating starting NPCs
    return '';
  }

  async create(data: CreateNpcDTO, campaignId: number, transaction?: Transaction): Promise<NpcDataReturn> {
    const npc = await NPC.create(
      {
        campaign_id: campaignId,
        name: data.name,
        alignment: data.alignment ?? null,
        appearance: data.appearance ?? null,
        personality: data.personality ?? null,
        backstory: data.backstory ?? null,
        mannerism: data.mannerism ?? null,
        memory: [],
        npc_relationship: [],
        player_relationship: [],
        is_companion: false,
      },
      { transaction: transaction ?? undefined }
    );

    return this.toReturn(npc);
  }

  async createBulk(data: CreateNpcDTO[], campaignId: number, transaction?: Transaction): Promise<NpcDataReturn[]> {
    const results: NpcDataReturn[] = [];

    for (const npcData of data) {
      const npc = await this.create(npcData, campaignId, transaction);
      results.push(npc);
    }

    return results;
  }

  private toReturn(npc: any): NpcDataReturn {
    return {
      id: npc.id,
      campaignId: npc.campaign_id,
      name: npc.name,
      alignment: npc.alignment,
      appearance: npc.appearance,
      personality: npc.personality,
      backstory: npc.backstory,
      mannerism: npc.mannerism,
      memory: npc.memory,
      npcRelationship: npc.npc_relationship,
      playerRelationship: npc.player_relationship,
      isCompanion: npc.is_companion,
      createdAt: npc.createdAt,
    };
  }
}
