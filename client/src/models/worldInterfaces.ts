export interface AreaFactionItem {
  id: number;
  name: string;
  description?: string | null;
  reputation?: string;
  influence?: number;
}

export type POIDataReturn = {
  id: number;
  areaId: number;
  name: string;
  description: string | null;
  descriptiveOverview: string | null;
  descriptiveLocation: string | null;
  map: string | null;
  createdAt: string;
};

export type LoreDataReturn = {
  id: number;
  campaignId: number;
  sourceId: number;
  sourceType: string;
  title: string;
  content: string | null;
  createdAt: string;
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
  createdAt: string;
};

export type AreaWithDetailsReturn = AreaDataReturn & {
  pois: POIDataReturn[];
  lore: LoreDataReturn | null;
};
