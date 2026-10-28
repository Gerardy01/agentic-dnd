export const SidebarMenuEnum = {
  DASHBOARD: 'dashboard',
  CAMPAIGNS: 'campaigns',
  WORKSHOP: 'workshop',
  SETTINGS: 'settings',
} as const;

export type SidebarMenuType = (typeof SidebarMenuEnum)[keyof typeof SidebarMenuEnum];

export const CampaignTabEnum = {
  OVERVIEW: 'overview',
  MAP: 'map',
  FACTIONS: 'factions',
  CLASSES: 'classes',
  RACES: 'races',
  NPCS: 'npcs',
  ITEMS: 'items',
  SPELLS: 'spells',
} as const;

export type CampaignTabType = (typeof CampaignTabEnum)[keyof typeof CampaignTabEnum];

export const CampaignLanguageEnum = {
  EN: 'en',
  ID: 'id',
  JP: 'jp',
  KOR: 'kor',
  CHN: 'chn',
} as const;

export type CampaignLanguageType = (typeof CampaignLanguageEnum)[keyof typeof CampaignLanguageEnum];

