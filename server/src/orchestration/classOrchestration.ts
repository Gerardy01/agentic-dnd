import { ClassWithSpellsReturn, SpellDataReturn } from '@/interfaces/ISpell';
import { IClassService } from '@/services/classService';
import { ISpellService } from '@/services/spellService';
import { ICampaignService } from '@/services/campaignService';

export interface IClassOrchestration {
  getClasses(campaignId: number, accountId: string): Promise<ClassWithSpellsReturn[]>;
}

export class ClassOrchestration implements IClassOrchestration {
  constructor(
    private classService: IClassService,
    private spellService: ISpellService,
    private campaignService: ICampaignService
  ) {}

  /**
   * Always 3 queries regardless of the class count: classes, class_spells links, then the linked spells.
   */
  async getClasses(campaignId: number, accountId: string): Promise<ClassWithSpellsReturn[]> {
    // Validate campaign exists and belongs to the authenticated user
    await this.campaignService.getById(campaignId, accountId);

    const classes = await this.classService.getByCampaignId(campaignId);
    const spellLinks = await this.classService.getSpellLinksByClassIds(classes.map((cls) => cls.id));
    const spells = await this.spellService.getByIds([...new Set(spellLinks.map((link) => link.spellId))]);

    const classIdsBySpellId = new Map<number, number[]>();
    for (const link of spellLinks) {
      const classIds = classIdsBySpellId.get(link.spellId) ?? [];
      classIds.push(link.classId);
      classIdsBySpellId.set(link.spellId, classIds);
    }

    // Spells arrive already sorted, so iterating them keeps each class's list sorted
    const spellsByClassId = new Map<number, SpellDataReturn[]>();
    for (const spell of spells) {
      for (const classId of classIdsBySpellId.get(spell.id) ?? []) {
        const classSpells = spellsByClassId.get(classId) ?? [];
        classSpells.push(spell);
        spellsByClassId.set(classId, classSpells);
      }
    }

    return classes.map((cls) => ({
      ...cls,
      spells: spellsByClassId.get(cls.id) ?? [],
    }));
  }
}
