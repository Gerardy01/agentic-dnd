// ==========================================
// DTOs
// ==========================================

export interface CreateQuestDTO {
  name: string;
  description?: string | null;
  gmInstruction?: string | null;
  questGiver?: number | null;
  questLocation?: number | null;
  questDifficulty?: string | null;
  questTag?: string | null;
  questPrerequisites?: any;
  status?: string;
}

// ==========================================
// Return Types
// ==========================================

export type QuestDataReturn = {
  id: number;
  campaignId: number;
  name: string;
  description: string | null;
  gmInstruction: string | null;
  questGiver: number | null;
  questLocation: number | null;
  questDifficulty: string | null;
  questTag: string | null;
  questPrerequisites: any;
  status: string;
  createdAt: Date;
};
