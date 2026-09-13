// ==========================================
// DTOs
// ==========================================

export interface CreateFactionDTO {
  name: string;
  description?: string | null;
  reputation?: string;
  influence?: number;
}

export interface GenerateFactionDTO {
  themePrompt: string;
  language: string;
  world: {
    name: string;
    description: string | null;
    currencyName: string;
  };
  map: {
    descriptiveOverview: string | null;
  };
}

// ==========================================
// AI Response Types
// ==========================================

export interface FactionStubAIResponse {
  name: string;
  description: string;
}

export interface FactionListAIResponse {
  factions: FactionStubAIResponse[];
}

export interface FactionDetailAIResponse {
  name: string;
  description: string;
  reputation?: string;
  influence?: number;
}

// ==========================================
// Return Types
// ==========================================

export type FactionDataReturn = {
  id: number;
  campaignId: number;
  name: string;
  description: string | null;
  reputation: string;
  influence: number;
  createdAt: Date;
};

