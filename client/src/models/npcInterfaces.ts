export interface NpcStat {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface NpcAction {
  name: string;
  description: string;
}

export interface NpcCombatProfileDataReturn {
  id: number;
  npcId: number;
  ac: number;
  maxHp: number;
  hp: number;
  stat: NpcStat;
  speed: number;
  actions: NpcAction[];
  crEquivalent: number | null;
  createdAt: string;
}

export type NpcDataReturn = {
  id: number;
  campaignId: number;
  raceId: number | null;
  name: string;
  alignment: string | null;
  appearance: string | null;
  personality: string | null;
  backstory: string | null;
  mannerism: string | null;
  memory: string[];
  isCompanion: boolean;
  createdAt: string;
};

export type NpcWithDetailsReturn = NpcDataReturn & {
  race?: { id: number; name: string } | null;
  combatProfile?: NpcCombatProfileDataReturn | null;
  location?: {
    poiId: number;
    poiName: string;
    position: string | null;
  } | null;
};
