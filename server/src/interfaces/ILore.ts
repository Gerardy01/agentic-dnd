// ==========================================
// DTOs
// ==========================================

export interface CreateLoreDTO {
  sourceId: number;
  sourceType: string;
  title: string;
  content?: string | null;
}

// ==========================================
// Return Types
// ==========================================

export type LoreDataReturn = {
  id: number;
  campaignId: number;
  sourceId: number;
  sourceType: string;
  title: string;
  content: string | null;
  createdAt: Date;
};
