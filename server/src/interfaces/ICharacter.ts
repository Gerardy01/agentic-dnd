// ==========================================
// Sub-types
// ==========================================

export interface CharacterSkill {
  name: string;
  proficient: boolean;
}

export interface SpellSlot {
  level: number;
  available: number;
  used: number;
}
