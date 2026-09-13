import { Transaction } from 'sequelize';
import { Quest } from '@/models';
import { CreateQuestDTO, QuestDataReturn } from '@/interfaces/IQuest';

export interface IQuestService {
  getCreatePrompt(): string;
  create(data: CreateQuestDTO, campaignId: number, transaction?: Transaction): Promise<QuestDataReturn>;
  createBulk(data: CreateQuestDTO[], campaignId: number, transaction?: Transaction): Promise<QuestDataReturn[]>;
}

export class QuestService implements IQuestService {
  constructor() {}

  getCreatePrompt(): string {
    // TODO: return the AI prompt for generating quests (used during chapter creation)
    return '';
  }

  /**
   * Creates a single quest. Designed to be versatile — used both during chapter
   * creation and as an in-game AI tool call (create_quest).
   */
  async create(data: CreateQuestDTO, campaignId: number, transaction?: Transaction): Promise<QuestDataReturn> {
    const quest = await Quest.create(
      {
        campaign_id: campaignId,
        name: data.name,
        description: data.description ?? null,
        gm_instruction: data.gmInstruction ?? null,
        quest_giver: data.questGiver ?? null,
        quest_location: data.questLocation ?? null,
        quest_difficulty: data.questDifficulty ?? null,
        quest_tag: data.questTag ?? null,
        quest_prerequisites: data.questPrerequisites ?? null,
        status: data.status ?? 'open',
      },
      { transaction: transaction ?? undefined }
    );

    return this.toReturn(quest);
  }

  async createBulk(data: CreateQuestDTO[], campaignId: number, transaction?: Transaction): Promise<QuestDataReturn[]> {
    const results: QuestDataReturn[] = [];

    for (const questData of data) {
      const q = await this.create(questData, campaignId, transaction);
      results.push(q);
    }

    return results;
  }

  private toReturn(quest: any): QuestDataReturn {
    return {
      id: quest.id,
      campaignId: quest.campaign_id,
      name: quest.name,
      description: quest.description,
      gmInstruction: quest.gm_instruction,
      questGiver: quest.quest_giver,
      questLocation: quest.quest_location,
      questDifficulty: quest.quest_difficulty,
      questTag: quest.quest_tag,
      questPrerequisites: quest.quest_prerequisites,
      status: quest.status,
      createdAt: quest.createdAt,
    };
  }
}
