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

export type Campaign = {
  id: number;
  accountId: string;
  name: string;
  themePrompt: string | null;
  language: string;
  createdAt: string;
  status?: string;
};
