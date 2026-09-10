export const SidebarMenuEnum = {
  DASHBOARD: 'dashboard',
  CAMPAIGNS: 'campaigns',
  WORKSHOP: 'workshop',
  SETTINGS: 'settings',
} as const;

export type SidebarMenuType = (typeof SidebarMenuEnum)[keyof typeof SidebarMenuEnum];
