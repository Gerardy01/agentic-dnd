import { z } from 'zod';
import { Transaction } from 'sequelize';
import { Class, ClassResource, ClassSpell } from '@/models';
import { IAIProvider } from '@/provider/aiProvider';
import { loadPrompt } from '@/utils/promptLoader';
import { LoggerService } from '@/services/loggerService';
import { GenerationProgressCallback } from '@/interfaces/IProgress';
import { SpellcasterClassContext } from '@/interfaces/ISpell';
import {
  CreateClassDTO,
  GenerateClassesDTO,
  ClassDataReturn,
  ClassResourceDataReturn,
  ClassBriefListAIResponse,
  ClassDetailAIResponse,
  ClassFeaturesAIResponse,
  ClassResourcesAIResponse,
  ResourceMaxPerLevel,
  ResourceRecovery,
  CreateClassResourceRecord,
  ClassSpellLinkDTO,
  CreateClassSpellRecord,
} from '@/interfaces/IClass';

// ==========================================
// Zod schemas for AI response validation
// ==========================================

const ClassStubAISchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
});

const ClassBriefListAISchema = z.object({
  classes: z.array(ClassStubAISchema).min(1),
});

const LevelValueProgressionSchema = z.object({
  level: z.number().int().min(1).max(20),
  value: z.number().int().min(0),
});

const PreparedSpellcastingSchema = z.object({
  spellcastingAbility: z.enum(['str', 'dex', 'con', 'int', 'wis', 'cha']),
  preparationType: z.literal('prepared'),
  spellcastingType: z.enum(['full', 'half', 'third', 'pact_magic']),
  maxCantripKnown: z.array(LevelValueProgressionSchema),
  maxSpellKnown: z.null(),
  preparedLevelBonus: z.union([z.literal(0), z.literal(50), z.literal(100)]),
});

const KnownSpellcastingSchema = z.object({
  spellcastingAbility: z.enum(['str', 'dex', 'con', 'int', 'wis', 'cha']),
  preparationType: z.enum(['known', 'pact_magic']),
  spellcastingType: z.enum(['full', 'half', 'third', 'pact_magic']),
  maxCantripKnown: z.array(LevelValueProgressionSchema),
  maxSpellKnown: z.array(LevelValueProgressionSchema),
  preparedLevelBonus: z.null(),
});

const SpellcastingPropertiesAISchema = z.discriminatedUnion('preparationType', [
  PreparedSpellcastingSchema,
  KnownSpellcastingSchema.extend({ preparationType: z.literal('known') }),
  KnownSpellcastingSchema.extend({ preparationType: z.literal('pact_magic') }),
]);

const ClassDetailAISchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1500),
  hitDie: z.number().int().positive(),
  spellcastingProperties: SpellcastingPropertiesAISchema.nullable().default(null),
});

const ClassFeatureItemAISchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1250),
  level: z.number().int().min(1).max(20),
  type: z.enum(['passive', 'active']),
});

const ClassFeaturesAISchema = z.object({
  features: z.array(ClassFeatureItemAISchema).default([]),
});

const ResourceRecoveryDetailAISchema = z.object({
  value: z.number().min(0),
  type: z.enum(['percentage', 'flat']),
});

const ResourceRecoveryAISchema = z.object({
  short: ResourceRecoveryDetailAISchema,
  long: ResourceRecoveryDetailAISchema,
});

const ResourceMaxPerLevelAISchema = z.object({
  level: z.number().int().min(1).max(20),
  value: z.number().int().min(0),
});

const ClassResourceItemAISchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500).nullable().optional(),
  maxPerLevel: z.array(ResourceMaxPerLevelAISchema).default([]),
  resourceRecovery: ResourceRecoveryAISchema.nullable().optional(),
});

const ClassResourcesAISchema = z.object({
  resources: z.array(ClassResourceItemAISchema).default([]),
});

// Each class needs 3 sequential prompts: core detail, features, resources
const CLASS_PROMPTS_PER_CLASS = 3;

// ==========================================
// Interface
// ==========================================

export interface IClassService {
  getLanguageInstruction(): string;
  getClassBriefPrompt(): string;
  getClassDetailPrompt(): string;
  getClassFeaturesPrompt(): string;
  getClassResourcesPrompt(): string;
  generateClasses(data: GenerateClassesDTO, campaignId: number, onProgress?: GenerationProgressCallback, transaction?: Transaction): Promise<ClassDataReturn[]>;
  create(data: CreateClassDTO, campaignId: number, transaction?: Transaction): Promise<ClassDataReturn>;
  createBulk(data: CreateClassDTO[], campaignId: number, transaction?: Transaction): Promise<ClassDataReturn[]>;
  createResourcesBulk(data: CreateClassDTO[], createdClasses: ClassDataReturn[], transaction?: Transaction): Promise<void>;
  linkSpellToClass(classId: number, spellId: number, transaction?: Transaction): Promise<void>;
  linkSpellsToClasses(links: ClassSpellLinkDTO[], transaction?: Transaction): Promise<void>;
  getSpellLinksByClassIds(classIds: number[]): Promise<ClassSpellLinkDTO[]>;
  getByCampaignId(campaignId: number): Promise<ClassDataReturn[]>;
  countByCampaignId(campaignId: number): Promise<number>;
  getSpellcasterClasses(classes: ClassDataReturn[]): SpellcasterClassContext[];
}

// ==========================================
// Implementation
// ==========================================

export class ClassService implements IClassService {
  private logger = new LoggerService('ClassService');

  constructor(private aiProvider: IAIProvider) { }

  // ------------------------------------------
  // Prompt methods
  // ------------------------------------------

  getLanguageInstruction(): string {
    return loadPrompt('SHARED_LANGUAGE_INSTRUCTION.md');
  }

  getClassBriefPrompt(): string {
    return loadPrompt('GENERATE_CLASS_BRIEF.md');
  }

  getClassDetailPrompt(): string {
    return loadPrompt('GENERATE_CLASS_DETAILED.md');
  }

  getClassFeaturesPrompt(): string {
    return loadPrompt('GENERATE_CLASS_FEATURES.md');
  }

  getClassResourcesPrompt(): string {
    return loadPrompt('GENERATE_CLASS_RESOURCES.md');
  }

  // ------------------------------------------
  // AI-powered generation methods
  // ------------------------------------------

  /**
   * Generates classes in a multi-step pipeline:
   * 1. Brief pass — AI returns 6-12 class stubs based on theme prompt and world context.
   * 2. Detail loop — for each class stub:
   *    a. 1st prompt: generates detail (name, description max 1500, hitDie, spellcastingProperties or null).
   *    b. 2nd prompt: generates class features up to level 20 using generated class data.
   *    c. 3rd prompt: generates class resources using generated class data with features.
   *    d. Persists class and its resources to the DB within the transaction.
   */
  async generateClasses(
    data: GenerateClassesDTO,
    campaignId: number,
    onProgress?: GenerationProgressCallback,
    transaction?: Transaction
  ): Promise<ClassDataReturn[]> {
    const briefSystemPrompt = this.getClassBriefPrompt();

    const worldContext = JSON.stringify(
      {
        name: data.world.name,
        description: data.world.description,
        currencyName: data.world.currencyName,
      },
      null,
      2
    );

    const briefUserMessage = [
      this.getLanguageInstruction(),
      '',
      `Theme: ${data.themePrompt}`,
      `Campaign language: ${data.language}`,
      '',
      'World context:',
      worldContext,
    ].join('\n');

    onProgress?.({ message: 'Drafting the class roster...', current: 0, total: 1 });
    this.logger.info('Requesting brief class list from AI...');
    const briefRaw = await this.aiProvider.chatJSON<ClassBriefListAIResponse>([
      { role: 'system', content: briefSystemPrompt },
      { role: 'user', content: briefUserMessage },
    ]);

    const briefParsed = ClassBriefListAISchema.parse(briefRaw);
    this.logger.info(
      `Generated ${briefParsed.classes.length} brief classes: ${briefParsed.classes.map((c) => `"${c.name}"`).join(', ')}`
    );

    const classesToCreate: CreateClassDTO[] = [];
    const totalClassProgressSteps = briefParsed.classes.length * CLASS_PROMPTS_PER_CLASS;

    for (let i = 0; i < briefParsed.classes.length; i++) {
      const stub = briefParsed.classes[i];
      const classProgressLabel = `class ${i + 1}/${briefParsed.classes.length} "${stub.name}"`;
      onProgress?.({
        message: `Forging ${classProgressLabel}: core profile`,
        current: i * CLASS_PROMPTS_PER_CLASS,
        total: totalClassProgressSteps,
      });
      this.logger.info(`[${i + 1}/${briefParsed.classes.length}] Generating class "${stub.name}"...`);

      // 1. Class Detail Prompt (name, description, hitDie, spellcastingProperties)
      const detailSystemPrompt = this.getClassDetailPrompt();
      const otherClassesBrief = JSON.stringify(
        briefParsed.classes.filter((c) => c.name !== stub.name),
        null,
        2
      );

      const detailUserMessage = [
        this.getLanguageInstruction(),
        '',
        `Theme: ${data.themePrompt}`,
        `Campaign language: ${data.language}`,
        '',
        'World context:',
        worldContext,
        '',
        'Other classes brief (for context and variety):',
        otherClassesBrief,
        '',
        'Target class brief (you MUST expand this one):',
        JSON.stringify({ name: stub.name, description: stub.description }, null, 2),
      ].join('\n');

      const detailRaw = await this.aiProvider.chatJSON<ClassDetailAIResponse>([
        { role: 'system', content: detailSystemPrompt },
        { role: 'user', content: detailUserMessage },
      ]);

      const detailParsed = ClassDetailAISchema.parse(detailRaw);

      // 2. Class Features Prompt (features up to level 20)
      onProgress?.({
        message: `Forging ${classProgressLabel}: level 1-20 features`,
        current: i * CLASS_PROMPTS_PER_CLASS + 1,
        total: totalClassProgressSteps,
      });
      this.logger.info(`[${i + 1}/${briefParsed.classes.length}] Generating features for "${detailParsed.name}"...`);
      const featuresSystemPrompt = this.getClassFeaturesPrompt();
      const classDataContext = JSON.stringify(
        {
          name: detailParsed.name,
          description: detailParsed.description,
          hitDie: detailParsed.hitDie,
          spellcastingProperties: detailParsed.spellcastingProperties,
        },
        null,
        2
      );

      const featuresUserMessage = [
        this.getLanguageInstruction(),
        '',
        `Campaign language: ${data.language}`,
        '',
        'Target class data:',
        classDataContext,
      ].join('\n');

      const featuresRaw = await this.aiProvider.chatJSON<ClassFeaturesAIResponse>([
        { role: 'system', content: featuresSystemPrompt },
        { role: 'user', content: featuresUserMessage },
      ]);

      const featuresParsed = ClassFeaturesAISchema.parse(featuresRaw);

      // 3. Class Resources Prompt (custom resources with progression & recovery)
      onProgress?.({
        message: `Forging ${classProgressLabel}: class resources`,
        current: i * CLASS_PROMPTS_PER_CLASS + 2,
        total: totalClassProgressSteps,
      });
      this.logger.info(`[${i + 1}/${briefParsed.classes.length}] Generating resources for "${detailParsed.name}"...`);
      const resourcesSystemPrompt = this.getClassResourcesPrompt();
      const classWithFeaturesContext = JSON.stringify(
        {
          name: detailParsed.name,
          description: detailParsed.description,
          hitDie: detailParsed.hitDie,
          spellcastingProperties: detailParsed.spellcastingProperties,
          features: featuresParsed.features,
        },
        null,
        2
      );

      const resourcesUserMessage = [
        this.getLanguageInstruction(),
        '',
        `Campaign language: ${data.language}`,
        '',
        'Target class data (with features):',
        classWithFeaturesContext,
      ].join('\n');

      const resourcesRaw = await this.aiProvider.chatJSON<ClassResourcesAIResponse>([
        { role: 'system', content: resourcesSystemPrompt },
        { role: 'user', content: resourcesUserMessage },
      ]);

      const resourcesParsed = ClassResourcesAISchema.parse(resourcesRaw);

      classesToCreate.push({
        name: detailParsed.name,
        description: detailParsed.description,
        hitDie: detailParsed.hitDie,
        features: featuresParsed.features,
        spellcastingProperties: detailParsed.spellcastingProperties,
        resources: resourcesParsed.resources.map((r) => ({
          name: r.name,
          description: r.description ?? null,
          maxPerLevel: r.maxPerLevel,
          resourceRecovery: r.resourceRecovery ?? null,
        })),
      });
    }

    const createdClasses = await this.createBulk(classesToCreate, campaignId, transaction);
    this.logger.success(`Successfully saved ${createdClasses.length} classes in bulk`);

    await this.createResourcesBulk(classesToCreate, createdClasses, transaction);
    this.logger.success(`Successfully saved resources for classes in bulk`);

    // Fetch full structures to return
    const classIds = createdClasses.map(c => c.id);
    const fullClasses = await Class.findAll({
      where: { id: classIds },
      include: [{ model: ClassResource, as: 'resources' }],
      transaction: transaction ?? undefined,
      order: [['created_at', 'ASC']],
    });

    return fullClasses.map(c => this.toReturn(c));
  }

  // ------------------------------------------
  // Direct DB persistence methods
  // ------------------------------------------

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
    if (data.length === 0) return [];

    const createdClasses = await Class.bulkCreate(
      data.map(d => ({
        campaign_id: campaignId,
        name: d.name,
        description: d.description ?? null,
        hit_die: d.hitDie,
        features: d.features ?? [],
        spellcasting_properties: d.spellcastingProperties ?? null,
      })),
      { transaction: transaction ?? undefined, returning: true }
    );

    return createdClasses.map(c => this.toReturn(c));
  }

  async createResourcesBulk(data: CreateClassDTO[], createdClasses: ClassDataReturn[], transaction?: Transaction): Promise<void> {
    const allResourcesToCreate: CreateClassResourceRecord[] = [];

    // Map resources to their newly generated class IDs
    data.forEach((classData, index) => {
      const cls = createdClasses[index];
      if (!classData.resources || classData.resources.length <= 0) return;
      for (const resourceData of classData.resources) {
        allResourcesToCreate.push({
          class_id: cls.id,
          name: resourceData.name,
          description: resourceData.description ?? null,
          max_per_level: resourceData.maxPerLevel,
          resource_recovery: resourceData.resourceRecovery ?? null,
        });
      }
    });

    if (allResourcesToCreate.length > 0) {
      await ClassResource.bulkCreate(allResourcesToCreate, { transaction: transaction ?? undefined });
    }
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

  async linkSpellsToClasses(links: ClassSpellLinkDTO[], transaction?: Transaction): Promise<void> {
    if (links.length === 0) return;

    const records: CreateClassSpellRecord[] = links.map((link) => ({
      class_id: link.classId,
      spell_id: link.spellId,
    }));

    await ClassSpell.bulkCreate(records, { transaction: transaction ?? undefined, ignoreDuplicates: true });
  }

  async getSpellLinksByClassIds(classIds: number[]): Promise<ClassSpellLinkDTO[]> {
    if (classIds.length === 0) return [];

    const classSpells = await ClassSpell.findAll({ where: { class_id: classIds } });

    return classSpells.map((classSpell) => ({
      classId: classSpell.class_id,
      spellId: classSpell.spell_id,
    }));
  }

  async countByCampaignId(campaignId: number): Promise<number> {
    return Class.count({ where: { campaign_id: campaignId } });
  }

  async getByCampaignId(campaignId: number): Promise<ClassDataReturn[]> {
    const classes = await Class.findAll({
      where: { campaign_id: campaignId },
      include: [
        {
          model: ClassResource,
          as: 'resources',
        },
      ],
      order: [['created_at', 'ASC']],
    });

    return classes.map((cls) => this.toReturn(cls));
  }

  /**
   * Only classes with spellcasting properties can learn spells.
   */
  getSpellcasterClasses(classes: ClassDataReturn[]): SpellcasterClassContext[] {
    return classes.flatMap((cls) =>
      cls.spellcastingProperties
        ? [
            {
              id: cls.id,
              name: cls.name,
              description: cls.description,
              spellcastingProperties: cls.spellcastingProperties,
            },
          ]
        : []
    );
  }

  private toReturn(cls: Class): ClassDataReturn {
    const plain = cls.get({ plain: true }) as {
      id: number;
      campaign_id: number;
      name: string;
      description: string | null;
      hit_die: number;
      features: ClassDataReturn['features'];
      spellcasting_properties: ClassDataReturn['spellcastingProperties'];
      resources?: Array<{
        id: number;
        class_id: number;
        name: string;
        description: string | null;
        max_per_level: ResourceMaxPerLevel[];
        resource_recovery: ResourceRecovery | null;
        created_at: Date;
      }>;
      created_at: Date;
    };

    const resources: ClassResourceDataReturn[] = (plain.resources || []).map((r) => ({
      id: r.id,
      classId: r.class_id,
      name: r.name,
      description: r.description,
      maxPerLevel: r.max_per_level,
      resourceRecovery: r.resource_recovery,
      createdAt: r.created_at,
    }));

    return {
      id: plain.id,
      campaignId: plain.campaign_id,
      name: plain.name,
      description: plain.description,
      hitDie: plain.hit_die,
      features: plain.features || [],
      spellcastingProperties: plain.spellcasting_properties ?? null,
      resources,
      createdAt: plain.created_at,
    };
  }
}
