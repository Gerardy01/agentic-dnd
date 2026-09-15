import { FactionDataReturn } from '@/interfaces/IFaction';
import { IFactionService } from '@/services/factionService';
import { ICampaignService } from '@/services/campaignService';

export interface IFactionOrchestration {
  getFactions(campaignId: number, accountId: string): Promise<FactionDataReturn[]>;
}

export class FactionOrchestration implements IFactionOrchestration {
  constructor(
    private factionService: IFactionService,
    private campaignService: ICampaignService
  ) {}

  async getFactions(campaignId: number, accountId: string): Promise<FactionDataReturn[]> {
    // Validate campaign exists and belongs to the authenticated user
    await this.campaignService.getById(campaignId, accountId);
    return this.factionService.getByCampaignId(campaignId);
  }
}
