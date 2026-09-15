import { AreaWithDetailsReturn } from '@/interfaces/IWorld';
import { IWorldService } from '@/services/worldService';
import { ICampaignService } from '@/services/campaignService';

export interface IWorldOrchestration {
  getAreas(campaignId: number, accountId: string): Promise<AreaWithDetailsReturn[]>;
}

export class WorldOrchestration implements IWorldOrchestration {
  constructor(
    private worldService: IWorldService,
    private campaignService: ICampaignService
  ) {}

  async getAreas(campaignId: number, accountId: string): Promise<AreaWithDetailsReturn[]> {
    // Validate campaign exists and belongs to the authenticated user
    await this.campaignService.getById(campaignId, accountId);
    return this.worldService.getAreasByCampaignId(campaignId);
  }
}
