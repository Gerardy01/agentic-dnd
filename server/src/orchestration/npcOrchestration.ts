import { NpcWithDetailsReturn } from '@/interfaces/INpc';
import { INpcService } from '@/services/npcService';
import { ICampaignService } from '@/services/campaignService';

export interface INpcOrchestration {
  getNpcs(campaignId: number, accountId: string): Promise<NpcWithDetailsReturn[]>;
}

export class NpcOrchestration implements INpcOrchestration {
  constructor(
    private npcService: INpcService,
    private campaignService: ICampaignService
  ) {}

  async getNpcs(campaignId: number, accountId: string): Promise<NpcWithDetailsReturn[]> {
    await this.campaignService.getById(campaignId, accountId);
    return this.npcService.getByCampaignId(campaignId);
  }
}
