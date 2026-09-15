export interface CreateCampaignDTO {
  name: string;
  themePrompt: string;
  language?: string;
}

export type CampaignDataReturn = {
  id: number;
  accountId: string;
  name: string;
  themePrompt: string | null;
  language: string;
  createdAt: string;
};

export type CampaignListReturn = {
  id: number;
  accountId: string;
  name: string;
  themePrompt: string | null;
  language: string;
  worldDescription: string | null;
  createdAt: string;
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

export interface CampaignSSEStepEvent {
  type: 'step';
  step: string;
  message: string;
  current: number;
  total: number;
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

