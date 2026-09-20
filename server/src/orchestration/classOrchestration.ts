import { ClassDataReturn } from '@/interfaces/IClass';
import { IClassService } from '@/services/classService';
import { ICampaignService } from '@/services/campaignService';

export interface IClassOrchestration {
  getClasses(campaignId: number, accountId: string): Promise<ClassDataReturn[]>;
}

export class ClassOrchestration implements IClassOrchestration {
  constructor(
    private classService: IClassService,
    private campaignService: ICampaignService
  ) {}

  async getClasses(campaignId: number, accountId: string): Promise<ClassDataReturn[]> {
    // Validate campaign exists and belongs to the authenticated user
    await this.campaignService.getById(campaignId, accountId);
    return this.classService.getByCampaignId(campaignId);
  }
}
