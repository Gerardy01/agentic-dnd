import { Transaction } from 'sequelize';
import { Race } from '@/models';
import { CreateRaceDTO, RaceDataReturn } from '@/interfaces/IRace';

export interface IRaceService {
  getCreatePrompt(): string;
  create(data: CreateRaceDTO, campaignId: number, transaction?: Transaction): Promise<RaceDataReturn>;
  createBulk(data: CreateRaceDTO[], campaignId: number, transaction?: Transaction): Promise<RaceDataReturn[]>;
}

export class RaceService implements IRaceService {
  constructor() {}

  getCreatePrompt(): string {
    // TODO: return the AI prompt for generating races with traits
    return '';
  }

  async create(data: CreateRaceDTO, campaignId: number, transaction?: Transaction): Promise<RaceDataReturn> {
    const race = await Race.create(
      {
        campaign_id: campaignId,
        name: data.name,
        description: data.description ?? null,
        speed: data.speed ?? 30,
        languages: data.languages ?? [],
        traits: data.traits ?? [],
      },
      { transaction: transaction ?? undefined }
    );

    return this.toReturn(race);
  }

  async createBulk(data: CreateRaceDTO[], campaignId: number, transaction?: Transaction): Promise<RaceDataReturn[]> {
    const results: RaceDataReturn[] = [];

    for (const raceData of data) {
      const race = await this.create(raceData, campaignId, transaction);
      results.push(race);
    }

    return results;
  }

  private toReturn(race: any): RaceDataReturn {
    return {
      id: race.id,
      campaignId: race.campaign_id,
      name: race.name,
      description: race.description,
      speed: race.speed,
      languages: race.languages,
      traits: race.traits,
      createdAt: race.createdAt,
    };
  }
}
