import { ClassDataReturn, SpellcastingAbilityType, SpellcastingProperties } from '@/interfaces/IClass';

// ==========================================
// Sub-types
// ==========================================

export type SpellSchool =
  | 'abjuration'
  | 'conjuration'
  | 'divination'
  | 'enchantment'
  | 'evocation'
  | 'illusion'
  | 'necromancy'
  | 'transmutation';

export type SavingThrowStat = SpellcastingAbilityType;

export interface SpellAttackProperties {
  requiresRangedAttackRoll: boolean;
  /** Damage strings such as "1d6 slashing" or "1d8 piercing" */
  damages: string[];
}

export interface SpellSaveProperties {
  savingThrowStat: SavingThrowStat;
  onSuccessDamagePercentage: number;
  onFailDamagePercentage: number;
}

// ==========================================
// DTOs
// ==========================================

export interface CreateSpellDTO {
  name: string;
  description?: string | null;
  /** 0 = cantrip */
  level: number;
  range?: string | null;
  school?: SpellSchool | null;
  attackProperties?: SpellAttackProperties | null;
  spellSaveProperties?: SpellSaveProperties | null;
}

export interface SpellcasterClassContext {
  id: number;
  name: string;
  description: string | null;
  spellcastingProperties: SpellcastingProperties;
}

export interface GenerateSpellsDTO {
  themePrompt: string;
  language: string;
  world: {
    name: string;
    description: string | null;
    currencyName: string;
  };
  /** Only classes that can cast spells (spellcastingProperties is not null) */
  classes: SpellcasterClassContext[];
}

/**
 * A generated spell that has not been persisted yet, together with the classes it belongs to.
 * A single spell can belong to several classes (e.g. a spell shared by wizard and sorcerer).
 */
export type GeneratedSpellDraft = {
  spell: CreateSpellDTO;
  classIds: number[];
};

/**
 * A persisted generated spell and the ids of the classes it must be linked to (class_spells).
 */
export type GeneratedSpellReturn = {
  spell: SpellDataReturn;
  classIds: number[];
};

// ==========================================
// Record Types (snake_case, used by persistence)
// ==========================================

export type CreateSpellRecord = {
  campaign_id: number;
  name: string;
  description: string | null;
  level: number;
  range: string | null;
  school: SpellSchool | null;
  attack_properties: SpellAttackProperties | null;
  spell_save_properties: SpellSaveProperties | null;
};

// ==========================================
// Return Types
// ==========================================

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
  createdAt: Date;
};

export type ClassWithSpellsReturn = ClassDataReturn & {
  spells: SpellDataReturn[];
};
