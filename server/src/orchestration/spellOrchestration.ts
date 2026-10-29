import { SpellDataReturn } from '@/interfaces/ISpell';
import { ISpellService } from '@/services/spellService';
import { ICampaignService } from '@/services/campaignService';

export interface ISpellOrchestration {
  getSpells(campaignId: number, accountId: string): Promise<SpellDataReturn[]>;
}

export class SpellOrchestration implements ISpellOrchestration {
  constructor(
    private spellService: ISpellService,
    private campaignService: ICampaignService
  ) {}

  async getSpells(campaignId: number, accountId: string): Promise<SpellDataReturn[]> {
    await this.campaignService.getById(campaignId, accountId);
    return this.spellService.getByCampaignId(campaignId);
  }
}
