import { Transaction } from 'sequelize';
import { Class, ClassResource, ClassSpell } from '@/models';
import {
  CreateClassDTO,
  ClassDataReturn,
  ClassResourceDataReturn,
} from '@/interfaces/IClass';

export interface IClassService {
  getCreatePrompt(): string;
  create(data: CreateClassDTO, campaignId: number, transaction?: Transaction): Promise<ClassDataReturn>;
  createBulk(data: CreateClassDTO[], campaignId: number, transaction?: Transaction): Promise<ClassDataReturn[]>;
  linkSpellToClass(classId: number, spellId: number, transaction?: Transaction): Promise<void>;
}

export class ClassService implements IClassService {
  constructor() {}

  getCreatePrompt(): string {
    // TODO: return the AI prompt for generating classes with progression
    return '';
  }

  async create(data: CreateClassDTO, campaignId: number, transaction?: Transaction): Promise<ClassDataReturn> {
    const cls = await Class.create(
      {
        campaign_id: campaignId,
        name: data.name,
        description: data.description ?? null,
        hit_die: data.hitDie,
        features: data.features ?? [],
        spellcasting_properties: data.spellcastingProperties ?? null,
      },
      { transaction: transaction ?? undefined }
    );

    // Create associated class resources if provided
    const resources: ClassResourceDataReturn[] = [];
    if (data.resources && data.resources.length > 0) {
      for (const resourceData of data.resources) {
        const resource = await ClassResource.create(
          {
            class_id: cls.id,
            name: resourceData.name,
            description: resourceData.description ?? null,
            max_per_level: resourceData.maxPerLevel,
            resource_recovery: resourceData.resourceRecovery ?? null,
          },
          { transaction: transaction ?? undefined }
        );

        resources.push({
          id: resource.id,
          classId: resource.class_id,
          name: resource.name,
          description: resource.description,
          maxPerLevel: resource.max_per_level,
          resourceRecovery: resource.resource_recovery,
          createdAt: resource.created_at,
        });
      }
    }

    return {
      id: cls.id,
      campaignId: cls.campaign_id,
      name: cls.name,
      description: cls.description,
      hitDie: cls.hit_die,
      features: cls.features,
      spellcastingProperties: cls.spellcasting_properties,
      resources,
      createdAt: cls.created_at,
    };
  }

  async createBulk(data: CreateClassDTO[], campaignId: number, transaction?: Transaction): Promise<ClassDataReturn[]> {
    const results: ClassDataReturn[] = [];

    for (const classData of data) {
      const cls = await this.create(classData, campaignId, transaction);
      results.push(cls);
    }

    return results;
  }

  async linkSpellToClass(classId: number, spellId: number, transaction?: Transaction): Promise<void> {
    await ClassSpell.create(
      {
        class_id: classId,
        spell_id: spellId,
      },
      { transaction: transaction ?? undefined }
    );
  }
}
