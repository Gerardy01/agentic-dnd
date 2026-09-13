// ==========================================
// DTOs
// ==========================================

export interface CreateSpellDTO {
  name: string;
  description?: string | null;
  level: number;
  range?: string | null;
  school?: string | null;
  attackProperties?: any;
  spellSaveProperties?: any;
}

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
  school: string | null;
  attackProperties: any;
  spellSaveProperties: any;
  createdAt: Date;
};
