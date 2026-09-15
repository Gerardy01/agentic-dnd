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

export interface AreaFactionItem {
  id: number;
  name: string;
  description?: string | null;
  reputation?: string;
  influence?: number;
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
  factions?: AreaFactionItem[];
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

export interface GenerateAreasDTO {
  themePrompt: string;
  language: string;
  world: {
    name: string;
    description: string | null;
    currencyName: string;
  };
  map: {
    descriptiveOverview: string | null;
  };
  factions: Array<{
    id: number;
    name: string;
    description: string | null;
    reputation: string;
    influence: number;
  }>;
}

export interface GenerateSubAreasDTO {
  themePrompt: string;
  language: string;
  world: {
    name: string;
    description: string | null;
    currencyName: string;
  };
  map: {
    descriptiveOverview: string | null;
  };
  fullAreaTreeContext: string;
}

export interface GeneratePOIsDTO {
  themePrompt: string;
  language: string;
  world: {
    name: string;
    description: string | null;
    currencyName: string;
  };
  map: {
    descriptiveOverview: string | null;
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

// Recursive stub tree for the Area Brief pass
export interface AreaStubAIResponse {
  levelType: string;
  name: string;
  description: string;
  children?: AreaStubAIResponse[];
}

export interface AreaBriefListAIResponse {
  areas: AreaStubAIResponse[];
}

// Full expanded area from the Area Detail pass
export interface AreaDetailAIResponse {
  name: string;
  description: string;
  descriptiveOverview: string;
  descriptiveLocation: string;
  factionNames: string[];
  lore: { title: string; content: string } | null;
}

// Sub-area brief: AI returns 0–2 children for a given leaf area
export interface SubAreaChildAIResponse {
  levelType: string;
  name: string;
  description: string;
}

export interface SubAreaBriefAIResponse {
  children: SubAreaChildAIResponse[];
}

// POI brief stub
export interface POIStubAIResponse {
  name: string;
  type: string;
  description: string;
}

export interface POIBriefListAIResponse {
  pois: POIStubAIResponse[];
}

// Full expanded POI from the POI Detail pass
export interface POIDetailAIResponse {
  name: string;
  description: string;
  descriptiveOverview: string;
  descriptiveLocation: string;
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
  factions: AreaFactionItem[];
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

export type LoreDataReturn = {
  id: number;
  campaignId: number;
  sourceId: number;
  sourceType: string;
  title: string;
  content: string | null;
  createdAt: Date;
};

export type AreaWithDetailsReturn = AreaDataReturn & {
  pois: POIDataReturn[];
  lore: LoreDataReturn | null;
};

export type AreaWithPOIReturn = AreaWithDetailsReturn;

