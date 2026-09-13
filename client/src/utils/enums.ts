export const SidebarMenuEnum = {
  DASHBOARD: 'dashboard',
  CAMPAIGNS: 'campaigns',
  WORKSHOP: 'workshop',
  SETTINGS: 'settings',
} as const;

export type SidebarMenuType = (typeof SidebarMenuEnum)[keyof typeof SidebarMenuEnum];

export const CampaignLanguageEnum = {
  EN: 'en',
  ID: 'id',
  JP: 'jp',
  KOR: 'kor',
  CHN: 'chn',
} as const;

export type CampaignLanguageType = (typeof CampaignLanguageEnum)[keyof typeof CampaignLanguageEnum];

