// ==========================================
// Sub-types
// ==========================================

export interface NpcRelationshipItem {
  npcId: number;
  relationshipLevel: string;
}

export interface PlayerRelationshipItem {
  characterId: number;
  relationshipLevel: string;
  firstMetChapterId?: number | null;
  tags: string[];
}

// ==========================================
// DTOs
// ==========================================

export interface CreateNpcDTO {
  name: string;
  raceId?: number | null;
  alignment?: string | null;
  appearance?: string | null;
  personality?: string | null;
  backstory?: string | null;
  mannerism?: string | null;
  memory?: string[];
  npcRelationship?: NpcRelationshipItem[];
  playerRelationship?: PlayerRelationshipItem[];
  isCompanion?: boolean;
}

export interface NpcPosition {
  x: number;
  y: number;
}

export interface NpcStat {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface NpcAction {
  name: string;
  description: string;
}

export interface CreateNpcCombatProfileDTO {
  npcId: number;
  ac: number;
  maxHp: number;
  hp: number;
  stat: NpcStat;
  speed: number;
  actions: NpcAction[];
  crEquivalent: number | null;
}

export interface GenerateNpcsDTO {
  themePrompt: string;
  language: string;
  world: {
    name: string;
    description: string | null;
    currencyName: string;
  };
  races: {
    id: number;
    name: string;
    description: string | null;
  }[];
  pois: {
    id: number;
    name: string;
    description: string | null;
    map?: string | null;
  }[];
}

// ==========================================
// Return Types
// ==========================================

export type NpcDataReturn = {
  id: number;
  campaignId: number;
  raceId: number | null;
  name: string;
  alignment: string | null;
  appearance: string | null;
  personality: string | null;
  backstory: string | null;
  mannerism: string | null;
  memory: string[];
  npcRelationship: NpcRelationshipItem[];
  playerRelationship: PlayerRelationshipItem[];
  isCompanion: boolean;
  createdAt: Date;
};

export interface GeneratedNpcWithPoiReturn {
  npc: NpcDataReturn;
  poiId: number;
  position: NpcPosition;
}

export type NpcCombatProfileDataReturn = {
  id: number;
  npcId: number;
  ac: number;
  maxHp: number;
  hp: number;
  stat: NpcStat;
  speed: number;
  actions: NpcAction[];
  crEquivalent: number | null;
  createdAt: Date;
};

// ==========================================
// AI Response Shapes
// ==========================================

export interface NpcBriefAIResponse {
  name: string;
  raceId: number;
  poiId: number;
  alignment: string;
  personality: string;
  position: NpcPosition;
  isCombatNpc: boolean;
}

export interface NpcBriefListAIResponse {
  npcs: NpcBriefAIResponse[];
}

export interface NpcDetailAIResponse {
  name: string;
  alignment: string;
  appearance: string;
  personality: string;
  backstory: string;
  mannerism: string;
}

export interface NpcCombatProfileAIResponse {
  ac: number;
  maxHp: number;
  hp: number;
  stat: NpcStat;
  speed: number;
  actions: NpcAction[];
  crEquivalent: number | null;
}
