// ==========================================
// Sub-Interfaces & Supporting Types
// ==========================================

export interface RaceTrait {
  name: string;
  description: string;
  type: 'passive' | 'active';
}

// ==========================================
// DTOs
// ==========================================

export interface CreateRaceDTO {
  name: string;
  description?: string | null;
  speed?: number;
  languages?: string[];
  traits?: RaceTrait[];
}

export interface GenerateRacesDTO {
  themePrompt: string;
  language: string;
  world: {
    name: string;
    description: string | null;
    currencyName: string;
  };
}

// ==========================================
// Return Types
// ==========================================

export type RaceDataReturn = {
  id: number;
  campaignId: number;
  name: string;
  description: string | null;
  speed: number;
  languages: string[];
  traits: RaceTrait[];
  createdAt: Date;
};

// ==========================================
// AI Response Types
// ==========================================

export type RaceStubAIResponse = {
  name: string;
  description: string;
};

export type RaceBriefListAIResponse = {
  races: RaceStubAIResponse[];
};

export type RaceDetailAIResponse = {
  name: string;
  description: string;
  speed: number;
  languages: string[];
  traits: RaceTrait[];
};
