import { CampaignModeEnum } from '@/utils/enums';

// ==========================================
// Types
// ==========================================

export type GameStatePositionItem = {
  object: 'player' | 'companion' | string;
  object_id: string | number;
  position: {
    x: number;
    y: number;
  };
};

// ==========================================
// DTOs
// ==========================================

export interface CreateCampaignDTO {
  name: string;
  themePrompt: string;
  language: string;
}

export interface CreateCampaignGameStateDTO {
  campaignId: number;
  mode?: CampaignModeEnum | string;
  partyLevel?: number;
  shortRestCount?: number;
  inGameTime?: string | null;
  inGameWeather?: string | null;
  currentPoiId?: number | null;
  chapterSummary?: string | null;
  position?: GameStatePositionItem[] | null;
}

export interface ContinueCampaignDTO {
  successParameter: CampaignSuccessParameter;
}

// ==========================================
// Return Types
// ==========================================

export type CampaignSuccessParameter = {
  world: boolean;
  factions: boolean;
  areas: boolean;
  pois: boolean;
  classes: boolean;
  races: boolean;
  npcs: boolean;
  items: boolean;
  spells: boolean;
};

export type CampaignDataReturn = {
  id: number;
  accountId: string;
  name: string;
  themePrompt: string | null;
  language: string;
  createdAt: Date;
  successParameter?: CampaignSuccessParameter;
};

export type CampaignGameStateDataReturn = {
  id: number;
  campaignId: number;
  mode: string;
  partyLevel: number;
  shortRestCount: number;
  inGameTime: string | null;
  inGameWeather: string | null;
  currentPoiId: number | null;
  chapterSummary: string | null;
  position: GameStatePositionItem[] | null;
  updatedAt: Date;
};

export type CampaignListReturn = {
  id: number;
  accountId: string;
  name: string;
  themePrompt: string | null;
  language: string;
  worldDescription: string | null;
  createdAt: Date;
  successParameter?: CampaignSuccessParameter;
};

