// ==========================================
// DTOs
// ==========================================

export interface CreateItemDTO {
  name: string;
  slug: string;
  description?: string | null;
  appearance?: string | null;
  type: string;
  category?: string | null;
  rarity?: string | null;
  equipSlot?: string | null;
  cost?: number;
  weight?: number;
  weaponProperties?: any;
  armorProperties?: any;
  flatBonus?: any;
  overrideBonus?: any;
}

// ==========================================
// Return Types
// ==========================================

export type ItemDataReturn = {
  id: number;
  campaignId: number;
  name: string;
  slug: string;
  description: string | null;
  appearance: string | null;
  type: string;
  category: string | null;
  rarity: string | null;
  equipSlot: string | null;
  cost: number;
  weight: number;
  weaponProperties: any;
  armorProperties: any;
  flatBonus: any;
  overrideBonus: any;
  createdAt: Date;
};
