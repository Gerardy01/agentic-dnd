import { Transaction } from 'sequelize';
import { Lore } from '@/models';
import { CreateLoreDTO, LoreDataReturn } from '@/interfaces/ILore';

export interface ILoreService {
  getCreatePrompt(): string;
  create(data: CreateLoreDTO, campaignId: number, transaction?: Transaction): Promise<LoreDataReturn>;
  createBulk(data: CreateLoreDTO[], campaignId: number, transaction?: Transaction): Promise<LoreDataReturn[]>;
}

export class LoreService implements ILoreService {
  constructor() {}

  getCreatePrompt(): string {
    // TODO: return the AI prompt for generating lore entries
    return '';
  }

  async create(data: CreateLoreDTO, campaignId: number, transaction?: Transaction): Promise<LoreDataReturn> {
    const lore = await Lore.create(
      {
        campaign_id: campaignId,
        source_id: data.sourceId,
        source_type: data.sourceType,
        title: data.title,
        content: data.content ?? null,
      },
      { transaction: transaction ?? undefined }
    );

    return this.toReturn(lore);
  }

  async createBulk(data: CreateLoreDTO[], campaignId: number, transaction?: Transaction): Promise<LoreDataReturn[]> {
    const results: LoreDataReturn[] = [];

    for (const loreData of data) {
      const lore = await this.create(loreData, campaignId, transaction);
      results.push(lore);
    }

    return results;
  }

  private toReturn(lore: any): LoreDataReturn {
    return {
      id: lore.id,
      campaignId: lore.campaign_id,
      sourceId: lore.source_id,
      sourceType: lore.source_type,
      title: lore.title,
      content: lore.content,
      createdAt: lore.createdAt,
    };
  }
}
