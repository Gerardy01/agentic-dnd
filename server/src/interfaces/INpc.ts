// ==========================================
// DTOs
// ==========================================

export interface CreateNpcDTO {
  name: string;
  alignment?: string | null;
  appearance?: string | null;
  personality?: string | null;
  backstory?: string | null;
  mannerism?: string | null;
}

// ==========================================
// Return Types
// ==========================================

export type NpcDataReturn = {
  id: number;
  campaignId: number;
  name: string;
  alignment: string | null;
  appearance: string | null;
  personality: string | null;
  backstory: string | null;
  mannerism: string | null;
  memory: any[];
  npcRelationship: any[];
  playerRelationship: any[];
  isCompanion: boolean;
  createdAt: Date;
};
