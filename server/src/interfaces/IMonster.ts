// ==========================================
// Sub-types
// ==========================================

export interface MonsterSpeed {
  walk: number;
  climb: number;
  swim: number;
  burrow: number;
  fly: number;
}

export interface MonsterSenses {
  blindsight: number;
  darkvision: number;
  tremorsense: number;
  truesight: number;
}

export interface MonsterAdditionalProperties {
  immunities: string[];
  resistances: string[];
  vulnerabilities: string[];
  conditionImmunities: string[];
}
