export type SpellcastingAbilityType = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
export type SpellcastingType = 'full' | 'half' | 'third' | 'pact_magic';

export interface LevelValueProgression {
  level: number;
  value: number;
}

export interface PreparedSpellcastingProperties {
  spellcastingAbility: SpellcastingAbilityType;
  preparationType: 'prepared';
  spellcastingType: SpellcastingType;
  maxCantripKnown: LevelValueProgression[];
  maxSpellKnown: null;
  preparedLevelBonus: 0 | 50 | 100;
}

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

export type ClassResourceDataReturn = {
  id: number;
  classId: number;
  name: string;
  description: string | null;
  maxPerLevel: ResourceMaxPerLevel[];
  resourceRecovery: ResourceRecovery | null;
  createdAt: string;
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
  createdAt: string;
};
