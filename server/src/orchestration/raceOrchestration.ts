import { RaceDataReturn } from '@/interfaces/IRace';
import { IRaceService } from '@/services/raceService';
import { ICampaignService } from '@/services/campaignService';

export interface IRaceOrchestration {
  getRaces(campaignId: number, accountId: string): Promise<RaceDataReturn[]>;
}

export class RaceOrchestration implements IRaceOrchestration {
  constructor(
    private raceService: IRaceService,
    private campaignService: ICampaignService
  ) {}

  async getRaces(campaignId: number, accountId: string): Promise<RaceDataReturn[]> {
    await this.campaignService.getById(campaignId, accountId);
    return this.raceService.getByCampaignId(campaignId);
  }
}
