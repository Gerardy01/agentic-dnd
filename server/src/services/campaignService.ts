import { Transaction } from 'sequelize';
import { Campaign, CampaignGameState } from '@/models';
import { DataNotFound } from '@/utils/exceptions';
import { CampaignModeEnum } from '@/utils/enums';
import { ICryptProvider } from '@/provider/cryptProvider';
import {
  CreateCampaignDTO,
  CreateCampaignGameStateDTO,
  CampaignDataReturn,
  CampaignGameStateDataReturn,
} from '@/interfaces/ICampaign';

export interface ICampaignService {
  create(data: CreateCampaignDTO, accountId: string, transaction?: Transaction): Promise<CampaignDataReturn>;
  createGameState(data: CreateCampaignGameStateDTO, transaction?: Transaction): Promise<CampaignGameStateDataReturn>;
  getById(campaignId: number, accountId: string): Promise<CampaignDataReturn>;
  getCampaigns(accountId: string): Promise<CampaignDataReturn[]>;
  generateProcessId(): string;
}

export class CampaignService implements ICampaignService {
  constructor(private cryptProvider: ICryptProvider) {}

  generateProcessId(): string {
    return this.cryptProvider.randomUUID();
  }

  async create(data: CreateCampaignDTO, accountId: string, transaction?: Transaction): Promise<CampaignDataReturn> {
    const campaign = await Campaign.create(
      {
        account_id: accountId,
        name: data.name,
        theme_prompt: data.themePrompt,
        language: data.language ?? 'en',
      },
      { transaction: transaction ?? undefined }
    );

    return {
      id: campaign.id,
      accountId: campaign.account_id,
      name: campaign.name,
      themePrompt: campaign.theme_prompt,
      language: campaign.language,
      createdAt: campaign.created_at,
    };
  }

  async createGameState(data: CreateCampaignGameStateDTO, transaction?: Transaction): Promise<CampaignGameStateDataReturn> {
    const gameState = await CampaignGameState.create(
      {
        campaign_id: data.campaignId,
        mode: data.mode ?? CampaignModeEnum.NARRATIVE,
        party_level: data.partyLevel ?? 1,
        short_rest_count: data.shortRestCount ?? 2,
        in_game_time: data.inGameTime ?? null,
        in_game_weather: data.inGameWeather ?? null,
        current_poi_id: data.currentPoiId ?? null,
        chapter_summary: data.chapterSummary ?? null,
        position: data.position ?? null,
      },
      { transaction: transaction ?? undefined }
    );

    return {
      id: gameState.id,
      campaignId: gameState.campaign_id,
      mode: gameState.mode,
      partyLevel: gameState.party_level,
      shortRestCount: gameState.short_rest_count,
      inGameTime: gameState.in_game_time,
      inGameWeather: gameState.in_game_weather,
      currentPoiId: gameState.current_poi_id,
      chapterSummary: gameState.chapter_summary,
      position: gameState.position,
      updatedAt: gameState.updated_at,
    };
  }

  async getById(campaignId: number, accountId: string): Promise<CampaignDataReturn> {
    const campaign = await Campaign.findOne({
      where: { id: campaignId, account_id: accountId },
    });

    if (!campaign) {
      throw new DataNotFound('Campaign not found');
    }

    return {
      id: campaign.id,
      accountId: campaign.account_id,
      name: campaign.name,
      themePrompt: campaign.theme_prompt,
      language: campaign.language,
      createdAt: campaign.created_at,
    };
  }

  async getCampaigns(accountId: string): Promise<CampaignDataReturn[]> {
    const campaigns = await Campaign.findAll({
      where: { account_id: accountId },
      order: [['created_at', 'DESC']],
    });

    return campaigns.map((campaign) => ({
      id: campaign.id,
      accountId: campaign.account_id,
      name: campaign.name,
      themePrompt: campaign.theme_prompt,
      language: campaign.language,
      createdAt: campaign.created_at,
    }));
  }
}


