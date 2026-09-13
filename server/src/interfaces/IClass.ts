// ==========================================
// Sub-DTOs
// ==========================================

export interface CreateClassResourceDTO {
  name: string;
  description?: string | null;
  maxPerLevel: any;
  resourceRecovery?: any;
}

// ==========================================
// DTOs
// ==========================================

export interface CreateClassDTO {
  name: string;
  description?: string | null;
  hitDie: number;
  features?: any[];
  spellcastingProperties?: any;
  resources?: CreateClassResourceDTO[];
}

// ==========================================
// Return Types
// ==========================================

export type ClassResourceDataReturn = {
  id: number;
  classId: number;
  name: string;
  description: string | null;
  maxPerLevel: any;
  resourceRecovery: any;
  createdAt: Date;
};

export type ClassDataReturn = {
  id: number;
  campaignId: number;
  name: string;
  description: string | null;
  hitDie: number;
  features: any[];
  spellcastingProperties: any;
  resources: ClassResourceDataReturn[];
  createdAt: Date;
};
