export type SpellSchool =
  | 'abjuration'
  | 'conjuration'
  | 'divination'
  | 'enchantment'
  | 'evocation'
  | 'illusion'
  | 'necromancy'
  | 'transmutation';

export type SavingThrowStat = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface SpellAttackProperties {
  requiresRangedAttackRoll: boolean;
  damages: string[];
}

export interface SpellSaveProperties {
  savingThrowStat: SavingThrowStat;
  onSuccessDamagePercentage: number;
  onFailDamagePercentage: number;
}

export type SpellDataReturn = {
  id: number;
  campaignId: number;
  name: string;
  description: string | null;
  level: number;
  range: string | null;
  school: SpellSchool | null;
  attackProperties: SpellAttackProperties | null;
  spellSaveProperties: SpellSaveProperties | null;
  createdAt: string;
};
