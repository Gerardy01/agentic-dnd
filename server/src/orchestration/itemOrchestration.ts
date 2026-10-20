import { ItemDataReturn } from '@/interfaces/IItem';
import { IItemService } from '@/services/itemService';
import { ICampaignService } from '@/services/campaignService';

export interface IItemOrchestration {
  getItems(campaignId: number, accountId: string): Promise<ItemDataReturn[]>;
}

export class ItemOrchestration implements IItemOrchestration {
  constructor(
    private itemService: IItemService,
    private campaignService: ICampaignService
  ) {}

  async getItems(campaignId: number, accountId: string): Promise<ItemDataReturn[]> {
    await this.campaignService.getById(campaignId, accountId);
    return this.itemService.getByCampaignId(campaignId);
  }
}
