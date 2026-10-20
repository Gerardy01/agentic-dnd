// ==========================================
// Sub-types
// ==========================================

export type ItemType = 'gear' | 'weapon' | 'armor';

export type ItemRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'very_rare'
  | 'legendary'
  | 'artifact';

export type ItemEquipSlot =
  | 'armor'
  | 'hand'
  | 'head'
  | 'neck'
  | 'back'
  | 'legs'
  | 'belt'
  | 'ring'
  | 'feet'
  | 'gloves'
  | 'ammunition'
  | 'left_hand'
  | 'right_hand'
  | 'two_handed';

export interface WeaponProperties {
  damage: string;
  properties: string[];
}

export interface ArmorProperties {
  strRequirements: number;
  ac: number;
  stealthDisadvantage: boolean;
}

export interface StatBonus {
  modifier: string;
  value: number;
}

// ==========================================
// DTOs
// ==========================================

export interface CreateItemDTO {
  name: string;
  slug: string;
  description?: string | null;
  appearance?: string | null;
  type: ItemType | string;
  category?: string | null;
  rarity?: ItemRarity | string | null;
  equipSlot?: ItemEquipSlot | string | null;
  cost?: number;
  weight?: number;
  weaponProperties?: WeaponProperties | null;
  armorProperties?: ArmorProperties | null;
  flatBonus?: StatBonus[] | null;
  overrideBonus?: StatBonus[] | null;
}

export interface GenerateItemsDTO {
  themePrompt: string;
  language: string;
  world: {
    name: string;
    description: string | null;
    currencyName: string;
  };
}

// ==========================================
// AI Response Types
// ==========================================

export interface ItemBriefStubAIResponse {
  name: string;
  type: ItemType | string;
  category: string;
  rarity: ItemRarity | string;
  briefDescription: string;
}

export interface ItemBriefListAIResponse {
  items: ItemBriefStubAIResponse[];
}

export interface ItemDetailAIResponse {
  name: string;
  description: string;
  appearance: string;
  type: ItemType | string;
  category: string;
  rarity: ItemRarity | string;
  equipSlot: ItemEquipSlot | string | null;
  cost: number;
  weight: number;
  weaponProperties: WeaponProperties | null;
  armorProperties: ArmorProperties | null;
  flatBonus: StatBonus[] | null;
  overrideBonus: StatBonus[] | null;
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
  weaponProperties: WeaponProperties | null;
  armorProperties: ArmorProperties | null;
  flatBonus: StatBonus[] | null;
  overrideBonus: StatBonus[] | null;
  createdAt: Date;
};
