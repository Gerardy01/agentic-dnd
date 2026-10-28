export interface CreateCampaignDTO {
  name: string;
  themePrompt: string;
  language?: string;
}

export interface ContinueCampaignDTO {
  successParameter: CampaignSuccessParameter;
}

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
  createdAt: string;
  successParameter?: CampaignSuccessParameter;
};

export type CampaignListReturn = {
  id: number;
  accountId: string;
  name: string;
  themePrompt: string | null;
  language: string;
  worldDescription: string | null;
  createdAt: string;
  successParameter?: CampaignSuccessParameter;
};

export type Campaign = {
  id: number;
  accountId: string;
  name: string;
  themePrompt: string | null;
  language: string;
  createdAt: string;
  status?: string;
};

export type InitiateCampaignReturn = {
  processId: string;
};

export interface CampaignSSESubProgress {
  message: string;
  current: number;
  total: number;
}

export interface CampaignSSEStepEvent {
  type: 'step';
  step: string;
  message: string;
  current: number;
  total: number;
  /** What the running step is doing right now (e.g. which class of the roster is being generated) */
  sub?: CampaignSSESubProgress;
}

export interface CampaignSSECompleteEvent {
  type: 'complete';
  message: string;
  data: CampaignDataReturn;
}

export interface CampaignSSEErrorEvent {
  type: 'error';
  message: string;
}

export type CampaignSSEEvent =
  | CampaignSSEStepEvent
  | CampaignSSECompleteEvent
  | CampaignSSEErrorEvent;

