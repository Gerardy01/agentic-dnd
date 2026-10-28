import { SpellClassReturn, SpellWithClassesReturn } from '@/interfaces/ISpell';
import { ISpellService } from '@/services/spellService';
import { IClassService } from '@/services/classService';
import { ICampaignService } from '@/services/campaignService';

export interface ISpellOrchestration {
  getSpells(campaignId: number, accountId: string): Promise<SpellWithClassesReturn[]>;
}

export class SpellOrchestration implements ISpellOrchestration {
  constructor(
    private spellService: ISpellService,
    private classService: IClassService,
    private campaignService: ICampaignService
  ) {}

  async getSpells(campaignId: number, accountId: string): Promise<SpellWithClassesReturn[]> {
    await this.campaignService.getById(campaignId, accountId);

    const [spells, classes] = await Promise.all([
      this.spellService.getByCampaignId(campaignId),
      this.classService.getByCampaignId(campaignId),
    ]);
    const spellLinks = await this.classService.getSpellLinksByClassIds(classes.map((cls) => cls.id));

    const classNameById = new Map(classes.map((cls) => [cls.id, cls.name]));
    const classesBySpellId = new Map<number, SpellClassReturn[]>();
    for (const link of spellLinks) {
      const className = classNameById.get(link.classId);
      if (className === undefined) continue;

      const spellClasses = classesBySpellId.get(link.spellId) ?? [];
      spellClasses.push({ id: link.classId, name: className });
      classesBySpellId.set(link.spellId, spellClasses);
    }

    return spells.map((spell) => ({
      ...spell,
      classes: classesBySpellId.get(spell.id) ?? [],
    }));
  }
}
