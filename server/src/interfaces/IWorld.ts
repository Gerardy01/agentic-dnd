// ==========================================
// DTOs
// ==========================================

export interface CreateWorldDTO {
  name: string;
  description?: string | null;
  currencyName?: string;
}

export interface CreateMapDTO {
  descriptiveOverview?: string | null;
}

export interface CreateAreaDTO {
  parentAreaId?: number | null;
  depth: number;
  path?: string | null;
  levelType: string;
  name: string;
  description?: string | null;
  descriptiveOverview?: string | null;
  descriptiveLocation?: string | null;
  factions?: any[];
}

export interface CreatePOIDTO {
  areaId: number;
  name: string;
  description?: string | null;
  descriptiveOverview?: string | null;
  descriptiveLocation?: string | null;
  map?: string | null;
}

// ==========================================
// AI Generation Input DTOs
// ==========================================

export interface GenerateWorldDTO {
  campaignName: string;
  themePrompt: string;
  language: string;
}

export interface GenerateMapDTO {
  themePrompt: string;
  language: string;
  world: {
    name: string;
    description: string | null;
    currencyName: string;
  };
}

// ==========================================
// AI Response Types (validated with Zod)
// ==========================================

export interface WorldAIResponse {
  name: string;
  description: string;
  currencyName: string;
}

export interface MapAIResponse {
  descriptiveOverview: string;
}

// ==========================================
// Return Types
// ==========================================

export type WorldDataReturn = {
  id: number;
  campaignId: number;
  name: string;
  description: string | null;
  currencyName: string;
  createdAt: Date;
};

export type MapDataReturn = {
  id: number;
  worldId: number;
  descriptiveOverview: string | null;
  createdAt: Date;
};

export type AreaDataReturn = {
  id: number;
  mapId: number;
  parentAreaId: number | null;
  depth: number;
  path: string | null;
  levelType: string;
  name: string;
  description: string | null;
  descriptiveOverview: string | null;
  descriptiveLocation: string | null;
  factions: any[];
  createdAt: Date;
};

export type POIDataReturn = {
  id: number;
  areaId: number;
  name: string;
  description: string | null;
  descriptiveOverview: string | null;
  descriptiveLocation: string | null;
  map: string | null;
  createdAt: Date;
};
