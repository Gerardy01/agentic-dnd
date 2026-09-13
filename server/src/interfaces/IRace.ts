// ==========================================
// DTOs
// ==========================================

export interface CreateRaceDTO {
  name: string;
  description?: string | null;
  speed?: number;
  languages?: any[];
  traits?: any[];
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
  languages: any[];
  traits: any[];
  createdAt: Date;
};
