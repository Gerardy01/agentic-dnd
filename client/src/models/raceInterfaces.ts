export interface RaceTrait {
  name: string;
  description: string;
  type: 'passive' | 'active';
}

export type RaceDataReturn = {
  id: number;
  campaignId: number;
  name: string;
  description: string | null;
  speed: number;
  languages: string[];
  traits: RaceTrait[];
  createdAt: string;
};
