import { z } from 'zod';
import { Transaction } from 'sequelize';
import { Spell } from '@/models';
import { IAIProvider } from '@/provider/aiProvider';
import { loadPrompt } from '@/utils/promptLoader';
import { LoggerService } from '@/services/loggerService';
import { GenerationProgressCallback } from '@/interfaces/IProgress';
import {
  CreateSpellDTO,
  CreateSpellRecord,
  GenerateSpellsDTO,
  GeneratedSpellDraft,
  GeneratedSpellReturn,
  SpellcasterClassContext,
  SpellDataReturn,
} from '@/interfaces/ISpell';

// ==========================================
// Zod schemas for AI response validation
// ==========================================

const SPELL_SCHOOLS = [
  'abjuration',
  'conjuration',
  'divination',
  'enchantment',
  'evocation',
  'illusion',
  'necromancy',
  'transmutation',
] as const;

const SAVING_THROW_STATS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

const MAX_SPELL_LEVEL = 9;
const MAX_BRIEF_SPELLS = 60;

const toLowerCaseTrimmed = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

const SpellSchoolAISchema = z.preprocess(toLowerCaseTrimmed, z.enum(SPELL_SCHOOLS));

const SpellStubAISchema = z.object({
  name: z.string().min(1).max(100),
  level: z.number().int().min(0).max(MAX_SPELL_LEVEL),
  school: SpellSchoolAISchema,
  briefDescription: z.string().min(1).max(300),
  classIds: z.array(z.number().int()).min(1),
});

const SpellBriefListAISchema = z.object({
  spells: z.array(SpellStubAISchema).min(1).max(MAX_BRIEF_SPELLS),
});

const SpellAttackPropertiesAISchema = z.object({
  requiresRangedAttackRoll: z.boolean(),
  damages: z.array(z.string().min(1)),
});

const SpellSavePropertiesAISchema = z.object({
  savingThrowStat: z.preprocess(toLowerCaseTrimmed, z.enum(SAVING_THROW_STATS)),
  onSuccessDamagePercentage: z.number().min(0).max(100),
  onFailDamagePercentage: z.number().min(0).max(100),
});

const SpellDetailAISchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  level: z.number().int().min(0).max(MAX_SPELL_LEVEL),
  range: z.string().min(1).max(50),
  school: SpellSchoolAISchema,
  attackProperties: SpellAttackPropertiesAISchema.nullable().optional().default(null),
  spellSaveProperties: SpellSavePropertiesAISchema.nullable().optional().default(null),
});

type SpellStubAI = z.infer<typeof SpellStubAISchema>;

// ==========================================
// Interface
// ==========================================

export interface ISpellService {
  getLanguageInstruction(): string;
  getSpellBriefPrompt(): string;
  getSpellDetailPrompt(): string;
  generateSpells(data: GenerateSpellsDTO, campaignId: number, onProgress?: GenerationProgressCallback, transaction?: Transaction): Promise<GeneratedSpellReturn[]>;
  create(data: CreateSpellDTO, campaignId: number, transaction?: Transaction): Promise<SpellDataReturn>;
  createBulk(data: CreateSpellDTO[], campaignId: number, transaction?: Transaction): Promise<SpellDataReturn[]>;
  getByCampaignId(campaignId: number): Promise<SpellDataReturn[]>;
}

// ==========================================
// Implementation
// ==========================================

export class SpellService implements ISpellService {
  private logger = new LoggerService('SpellService');

  constructor(private aiProvider: IAIProvider) {}

  // ------------------------------------------
  // Prompt methods
  // ------------------------------------------

  getLanguageInstruction(): string {
    return loadPrompt('SHARED_LANGUAGE_INSTRUCTION.md');
  }

  getSpellBriefPrompt(): string {
    return loadPrompt('GENERATE_SPELL_BRIEF.md');
  }

  getSpellDetailPrompt(): string {
    return loadPrompt('GENERATE_SPELL_DETAILED.md');
  }

  // ------------------------------------------
  // AI-powered generation methods
  // ------------------------------------------

  /**
   * Generates spells for the spellcasting classes in three phases:
   * 1. One brief call receives every spellcasting class and returns a de-duplicated roster of spell stubs,
   *    each tagged with the ids of ALL classes that can learn it (a spell can belong to several classes).
   * 2. Loops through each stub, calling AI to generate full details (description, range, attack/save properties).
   * 3. Persists all spells in bulk.
   *
   * Returns each saved spell with the class ids it belongs to, so the caller can create the class_spells records.
   */
  async generateSpells(
    data: GenerateSpellsDTO,
    campaignId: number,
    onProgress?: GenerationProgressCallback,
    transaction?: Transaction
  ): Promise<GeneratedSpellReturn[]> {
    const drafts = await this.generateSpellDrafts(data, onProgress);
    if (drafts.length === 0) return [];

    const spells = await this.createBulk(
      drafts.map((draft) => draft.spell),
      campaignId,
      transaction
    );
    this.logger.success(`Successfully saved ${spells.length} spells in bulk`);

    // createBulk preserves input order, so spells[index] belongs to drafts[index]
    return spells.map((spell, index) => ({ spell, classIds: drafts[index].classIds }));
  }

  private async generateSpellDrafts(
    data: GenerateSpellsDTO,
    onProgress?: GenerationProgressCallback
  ): Promise<GeneratedSpellDraft[]> {
    if (data.classes.length === 0) {
      return [];
    }

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
      '',
      'Spellcasting classes (each spell MUST reference these by `id` in `classIds`):',
      JSON.stringify(data.classes, null, 2),
    ].join('\n');

    onProgress?.({ message: 'Drafting the spell roster...', current: 0, total: 1 });
    this.logger.info(`Requesting brief spell roster for ${data.classes.length} spellcasting class(es) from AI...`);
    const briefRaw = await this.aiProvider.chatJSON([
      { role: 'system', content: this.getSpellBriefPrompt() },
      { role: 'user', content: briefUserMessage },
    ]);

    const briefParsed = SpellBriefListAISchema.parse(briefRaw);
    const stubs = this.mergeStubsByName(briefParsed.spells, data.classes);

    if (stubs.length === 0) {
      throw new Error('AI returned no spells that could be assigned to a known spellcasting class');
    }

    this.logger.info(
      `Generated ${stubs.length} brief spells: ${stubs.map((stub) => `"${stub.name}"`).join(', ')}`
    );

    // Detail pass: expand each stub into a fully detailed spell
    const classesById = new Map(data.classes.map((cls) => [cls.id, cls]));
    const detailSystemPrompt = this.getSpellDetailPrompt();
    const drafts: GeneratedSpellDraft[] = [];

    for (let index = 0; index < stubs.length; index++) {
      const stub = stubs[index];
      onProgress?.({
        message: `Detailing spell ${index + 1}/${stubs.length}: "${stub.name}"`,
        current: index,
        total: stubs.length,
      });
      this.logger.info(`[${index + 1}/${stubs.length}] Generating details for spell "${stub.name}"...`);

      const owningClasses = stub.classIds
        .map((classId) => classesById.get(classId))
        .filter((cls): cls is SpellcasterClassContext => cls !== undefined);

      const otherSpellsBrief = JSON.stringify(
        stubs
          .filter((other) => other.name !== stub.name)
          .map((other) => ({ name: other.name, level: other.level, school: other.school })),
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
        'Classes that learn this spell:',
        JSON.stringify(owningClasses, null, 2),
        '',
        'Other spells brief (for context and variety):',
        otherSpellsBrief,
        '',
        'Target spell brief (you MUST expand this one):',
        JSON.stringify(
          {
            name: stub.name,
            level: stub.level,
            school: stub.school,
            briefDescription: stub.briefDescription,
          },
          null,
          2
        ),
      ].join('\n');

      const detailRaw = await this.aiProvider.chatJSON([
        { role: 'system', content: detailSystemPrompt },
        { role: 'user', content: detailUserMessage },
      ]);

      const detailParsed = SpellDetailAISchema.parse(detailRaw);

      drafts.push({
        spell: {
          name: detailParsed.name || stub.name,
          description: detailParsed.description,
          // The brief decides the level, so the class assignment stays consistent with what each class can cast
          level: stub.level,
          range: detailParsed.range,
          school: detailParsed.school,
          attackProperties: detailParsed.attackProperties,
          spellSaveProperties: detailParsed.spellSaveProperties,
        },
        classIds: stub.classIds,
      });
    }

    return drafts;
  }

  /**
   * AI may repeat a spell once per class instead of listing every class on a single entry,
   * and may reference class ids that do not exist. Merge repeated names (union of class ids)
   * and drop unknown ids; stubs left without any valid class are discarded.
   */
  private mergeStubsByName(stubs: SpellStubAI[], classes: SpellcasterClassContext[]): SpellStubAI[] {
    const validClassIds = new Set(classes.map((cls) => cls.id));
    const stubsByName = new Map<string, SpellStubAI>();

    for (const stub of stubs) {
      const knownClassIds = stub.classIds.filter((classId) => validClassIds.has(classId));
      if (knownClassIds.length === 0) {
        this.logger.warn(`Discarding spell "${stub.name}": it references no known spellcasting class`);
        continue;
      }

      const key = stub.name.trim().toLowerCase();
      const existing = stubsByName.get(key);
      if (!existing) {
        stubsByName.set(key, { ...stub, classIds: [...new Set(knownClassIds)] });
        continue;
      }

      existing.classIds = [...new Set([...existing.classIds, ...knownClassIds])];
    }

    return [...stubsByName.values()];
  }

  // ------------------------------------------
  // Direct DB persistence methods
  // ------------------------------------------

  /**
   * Creates a single spell. Designed to be versatile — used both during campaign
   * generation and as an in-game AI tool call (create_spell).
   */
  async create(data: CreateSpellDTO, campaignId: number, transaction?: Transaction): Promise<SpellDataReturn> {
    const spell = await Spell.create(this.toRecord(data, campaignId), { transaction: transaction ?? undefined });

    return this.toReturn(spell);
  }

  async createBulk(data: CreateSpellDTO[], campaignId: number, transaction?: Transaction): Promise<SpellDataReturn[]> {
    if (data.length === 0) return [];

    const spells = await Spell.bulkCreate(
      data.map((spellData) => this.toRecord(spellData, campaignId)),
      { transaction: transaction ?? undefined, returning: true }
    );

    return spells.map((spell) => this.toReturn(spell));
  }

  async getByCampaignId(campaignId: number): Promise<SpellDataReturn[]> {
    const spells = await Spell.findAll({
      where: { campaign_id: campaignId },
      order: [['created_at', 'ASC']],
    });

    return spells.map((spell) => this.toReturn(spell));
  }

  private toRecord(data: CreateSpellDTO, campaignId: number): CreateSpellRecord {
    return {
      campaign_id: campaignId,
      name: data.name,
      description: data.description ?? null,
      level: data.level,
      range: data.range ?? null,
      school: data.school ?? null,
      attack_properties: data.attackProperties ?? null,
      spell_save_properties: data.spellSaveProperties ?? null,
    };
  }

  private toReturn(spell: Spell): SpellDataReturn {
    return {
      id: spell.id,
      campaignId: spell.campaign_id,
      name: spell.name,
      description: spell.description,
      level: spell.level,
      range: spell.range,
      school: spell.school,
      attackProperties: spell.attack_properties,
      spellSaveProperties: spell.spell_save_properties,
      createdAt: spell.created_at,
    };
  }
}
