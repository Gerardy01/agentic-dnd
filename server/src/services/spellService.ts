import { Transaction } from 'sequelize';
import { Spell } from '@/models';
import { CreateSpellDTO, SpellDataReturn } from '@/interfaces/ISpell';

export interface ISpellService {
  getCreatePrompt(): string;
  create(data: CreateSpellDTO, campaignId: number, transaction?: Transaction): Promise<SpellDataReturn>;
  createBulk(data: CreateSpellDTO[], campaignId: number, transaction?: Transaction): Promise<SpellDataReturn[]>;
}

export class SpellService implements ISpellService {
  constructor() {}

  getCreatePrompt(): string {
    // TODO: return the AI prompt for generating spells scoped per class
    return '';
  }

  /**
   * Creates a single spell. Designed to be versatile — used both during campaign
   * generation and as an in-game AI tool call (create_spell).
   */
  async create(data: CreateSpellDTO, campaignId: number, transaction?: Transaction): Promise<SpellDataReturn> {
    const spell = await Spell.create(
      {
        campaign_id: campaignId,
        name: data.name,
        description: data.description ?? null,
        level: data.level,
        range: data.range ?? null,
        school: data.school ?? null,
        attack_properties: data.attackProperties ?? null,
        spell_save_properties: data.spellSaveProperties ?? null,
      },
      { transaction: transaction ?? undefined }
    );

    return this.toReturn(spell);
  }

  async createBulk(data: CreateSpellDTO[], campaignId: number, transaction?: Transaction): Promise<SpellDataReturn[]> {
    const results: SpellDataReturn[] = [];

    for (const spellData of data) {
      const spell = await this.create(spellData, campaignId, transaction);
      results.push(spell);
    }

    return results;
  }

  private toReturn(spell: any): SpellDataReturn {
    return {
      id: spell.id,
      campaignId: spell.campaign_id,
      name: spell.name,
      description: spell.description,
      level: spell.level,
      range: spell.range,
      school: spell.school,
      attackProperties: spell.attack_properties,
      spellSaveProperties: spell.spell_save_properties,
      createdAt: spell.createdAt,
    };
  }
}
