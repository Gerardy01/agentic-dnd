// ==========================================
// Sub-Interfaces & Supporting Types
// ==========================================

export type SpellcastingAbilityType = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
export type SpellcastingType = 'full' | 'half' | 'third' | 'pact_magic';

export interface LevelValueProgression {
  level: number;
  value: number;
}

/**
 * Spellcasting properties for a "prepared" caster:
 * - The player prepares spells from a full list each day.
 * - maxSpellKnown is null because prepared casters don't have a fixed "known" count.
 * - preparedLevelBonus (0 | 50 | 100) adds a % of spellcasting modifier to prepared count.
 */
export interface PreparedSpellcastingProperties {
  spellcastingAbility: SpellcastingAbilityType;
  preparationType: 'prepared';
  spellcastingType: SpellcastingType;
  maxCantripKnown: LevelValueProgression[];
  maxSpellKnown: null;
  preparedLevelBonus: 0 | 50 | 100;
}

/**
 * Spellcasting properties for a "known" or "pact_magic" caster:
 * - The player permanently learns a fixed number of spells.
 * - preparedLevelBonus is null (not applicable).
 */
export interface KnownSpellcastingProperties {
  spellcastingAbility: SpellcastingAbilityType;
  preparationType: 'known' | 'pact_magic';
  spellcastingType: SpellcastingType;
  maxCantripKnown: LevelValueProgression[];
  maxSpellKnown: LevelValueProgression[];
  preparedLevelBonus: null;
}

export type SpellcastingProperties = PreparedSpellcastingProperties | KnownSpellcastingProperties;

export interface ClassFeature {
  name: string;
  description: string;
  level: number;
  type: 'passive' | 'active';
}

export interface ResourceRecoveryDetail {
  value: number;
  type: 'percentage' | 'flat';
}

export interface ResourceRecovery {
  short: ResourceRecoveryDetail;
  long: ResourceRecoveryDetail;
}

export interface ResourceMaxPerLevel {
  level: number;
  value: number;
}

// ==========================================
// Sub-DTOs
// ==========================================

export interface CreateClassResourceDTO {
  name: string;
  description?: string | null;
  maxPerLevel: ResourceMaxPerLevel[];
  resourceRecovery?: ResourceRecovery | null;
}

export type CreateClassResourceRecord = {
  class_id: number;
  name: string;
  description: string | null;
  max_per_level: ResourceMaxPerLevel[];
  resource_recovery: ResourceRecovery | null;
};


// ==========================================
// DTOs
// ==========================================

export interface CreateClassDTO {
  name: string;
  description?: string | null;
  hitDie: number;
  features?: ClassFeature[];
  spellcastingProperties?: SpellcastingProperties | null;
  resources?: CreateClassResourceDTO[];
}

export interface GenerateClassesDTO {
  themePrompt: string;
  language: string;
  world: {
    name: string;
    description: string | null;
    currencyName: string;
  };
}

// ==========================================
// Return Types
// ==========================================

export type ClassResourceDataReturn = {
  id: number;
  classId: number;
  name: string;
  description: string | null;
  maxPerLevel: ResourceMaxPerLevel[];
  resourceRecovery: ResourceRecovery | null;
  createdAt: Date;
};

export type ClassDataReturn = {
  id: number;
  campaignId: number;
  name: string;
  description: string | null;
  hitDie: number;
  features: ClassFeature[];
  spellcastingProperties: SpellcastingProperties | null;
  resources: ClassResourceDataReturn[];
  createdAt: Date;
};

// ==========================================
// AI Response Types
// ==========================================

export type ClassStubAIResponse = {
  name: string;
  description: string;
};

export type ClassBriefListAIResponse = {
  classes: ClassStubAIResponse[];
};

export type ClassDetailAIResponse = {
  name: string;
  description: string;
  hitDie: number;
  spellcastingProperties: SpellcastingProperties | null;
};

export type ClassFeaturesAIResponse = {
  features: ClassFeature[];
};

export type ClassResourcesAIResponse = {
  resources: CreateClassResourceDTO[];
};
