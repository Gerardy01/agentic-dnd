import { z } from 'zod';
import { Transaction } from 'sequelize';
import { Item } from '@/models';
import { IAIProvider } from '@/provider/aiProvider';
import { loadPrompt } from '@/utils/promptLoader';
import { LoggerService } from '@/services/loggerService';
import {
  CreateItemDTO,
  GenerateItemsDTO,
  ItemBriefListAIResponse,
  ItemDetailAIResponse,
  ItemDataReturn,
} from '@/interfaces/IItem';

// ==========================================
// Zod schemas for AI response validation
// ==========================================

const ItemBriefItemAISchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['gear', 'weapon', 'armor']),
  category: z.string().min(1).max(50),
  rarity: z.enum(['common', 'uncommon', 'rare', 'very_rare', 'legendary', 'artifact']),
  briefDescription: z.string().min(1).max(1000),
});

const ItemBriefListAISchema = z.object({
  items: z.array(ItemBriefItemAISchema).min(1),
});

const StatBonusSchema = z.object({
  modifier: z.string().min(1),
  value: z.number(),
});

const ItemDetailAISchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(2500),
  appearance: z.string().min(1).max(2500),
  type: z.enum(['gear', 'weapon', 'armor']),
  category: z.string().min(1).max(50),
  rarity: z.enum(['common', 'uncommon', 'rare', 'very_rare', 'legendary', 'artifact']),
  equipSlot: z.string().nullable(),
  cost: z.number().min(0),
  weight: z.number().min(0),
  weaponProperties: z.object({
    damage: z.string().min(1),
    properties: z.array(z.string()),
  }).nullable().optional().default(null),
  armorProperties: z.object({
    strRequirements: z.number().int().min(0),
    ac: z.number().int().min(0),
    stealthDisadvantage: z.boolean(),
  }).nullable().optional().default(null),
  flatBonus: z.array(StatBonusSchema).nullable().optional().default(null),
  overrideBonus: z.array(StatBonusSchema).nullable().optional().default(null),
});

// ==========================================
// Helper: generate a URL-safe slug from item name
// ==========================================

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ==========================================
// Interface
// ==========================================

export interface IItemService {
  getLanguageInstruction(): string;
  getItemBriefPrompt(): string;
  getItemDetailPrompt(): string;
  generateItems(
    data: GenerateItemsDTO,
    campaignId: number,
    transaction?: Transaction
  ): Promise<ItemDataReturn[]>;
  create(data: CreateItemDTO, campaignId: number, transaction?: Transaction): Promise<ItemDataReturn>;
  createBulk(data: CreateItemDTO[], campaignId: number, transaction?: Transaction): Promise<ItemDataReturn[]>;
  getByCampaignId(campaignId: number): Promise<ItemDataReturn[]>;
}

// ==========================================
// Implementation
// ==========================================

export class ItemService implements IItemService {
  private logger = new LoggerService('ItemService');

  constructor(private aiProvider: IAIProvider) {}

  // ------------------------------------------
  // Prompt methods
  // ------------------------------------------

  getLanguageInstruction(): string {
    return loadPrompt('SHARED_LANGUAGE_INSTRUCTION.md');
  }

  getItemBriefPrompt(): string {
    return loadPrompt('GENERATE_ITEM_BRIEF.md');
  }

  getItemDetailPrompt(): string {
    return loadPrompt('GENERATE_ITEM_DETAILED.md');
  }

  // ------------------------------------------
  // AI-powered generation methods
  // ------------------------------------------

  /**
   * Generates items in two phases:
   * 1. Calls AI with world context to generate brief item stubs (name, type, category, rarity).
   * 2. Loops through each stub, calling AI to generate full details (description, appearance, properties, bonuses).
   * 3. Persists all detailed items to the DB in bulk.
   */
  async generateItems(
    data: GenerateItemsDTO,
    campaignId: number,
    transaction?: Transaction
  ): Promise<ItemDataReturn[]> {
    const briefSystemPrompt = this.getItemBriefPrompt();

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

    this.logger.info('Requesting brief item roster from AI...');
    const briefRaw = await this.aiProvider.chatJSON<ItemBriefListAIResponse>([
      { role: 'system', content: briefSystemPrompt },
      { role: 'user', content: briefUserMessage },
    ]);

    const briefParsed = ItemBriefListAISchema.parse(briefRaw);
    this.logger.info(
      `Generated ${briefParsed.items.length} brief items: ${briefParsed.items.map((i) => `"${i.name}"`).join(', ')}`
    );

    // Detail pass: expand each stub into a fully detailed item
    const itemsToCreate: CreateItemDTO[] = [];

    for (let i = 0; i < briefParsed.items.length; i++) {
      const stub = briefParsed.items[i];
      this.logger.info(`[${i + 1}/${briefParsed.items.length}] Generating details for item "${stub.name}"...`);

      const detailSystemPrompt = this.getItemDetailPrompt();
      const otherItemsBrief = JSON.stringify(
        briefParsed.items.filter((item) => item.name !== stub.name),
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
        'Other items brief (for context and variety):',
        otherItemsBrief,
        '',
        'Target item brief (you MUST expand this one):',
        JSON.stringify(stub, null, 2),
      ].join('\n');

      const detailRaw = await this.aiProvider.chatJSON<ItemDetailAIResponse>([
        { role: 'system', content: detailSystemPrompt },
        { role: 'user', content: detailUserMessage },
      ]);

      const detailParsed = ItemDetailAISchema.parse(detailRaw);

      // Enforce equip_slot rules based on type
      let resolvedEquipSlot = detailParsed.equipSlot;
      if (detailParsed.type === 'weapon') {
        resolvedEquipSlot = 'hand';
      } else if (detailParsed.type === 'armor') {
        resolvedEquipSlot = 'armor';
      }

      itemsToCreate.push({
        name: detailParsed.name || stub.name,
        slug: slugify(detailParsed.name || stub.name),
        description: detailParsed.description,
        appearance: detailParsed.appearance,
        type: detailParsed.type,
        category: detailParsed.category,
        rarity: detailParsed.rarity,
        equipSlot: resolvedEquipSlot,
        cost: detailParsed.cost,
        weight: detailParsed.weight,
        weaponProperties: detailParsed.type === 'weapon' ? detailParsed.weaponProperties : null,
        armorProperties: detailParsed.type === 'armor' ? detailParsed.armorProperties : null,
        flatBonus: detailParsed.flatBonus,
        overrideBonus: detailParsed.overrideBonus,
      });
    }

    const results = await this.createBulk(itemsToCreate, campaignId, transaction);
    this.logger.success(`Successfully saved ${results.length} items in bulk`);

    return results;
  }

  // ------------------------------------------
  // Direct DB persistence methods
  // ------------------------------------------

  async create(data: CreateItemDTO, campaignId: number, transaction?: Transaction): Promise<ItemDataReturn> {
    const item = await Item.create(
      {
        campaign_id: campaignId,
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        appearance: data.appearance ?? null,
        type: data.type,
        category: data.category ?? null,
        rarity: data.rarity ?? null,
        equip_slot: data.equipSlot ?? null,
        cost: data.cost ?? 0,
        weight: data.weight ?? 0,
        weapon_properties: data.weaponProperties ?? null,
        armor_properties: data.armorProperties ?? null,
        flat_bonus: data.flatBonus ?? null,
        override_bonus: data.overrideBonus ?? null,
      },
      { transaction: transaction ?? undefined }
    );

    return this.toReturn(item);
  }

  async createBulk(data: CreateItemDTO[], campaignId: number, transaction?: Transaction): Promise<ItemDataReturn[]> {
    if (data.length === 0) return [];

    const items = await Item.bulkCreate(
      data.map((d) => ({
        campaign_id: campaignId,
        name: d.name,
        slug: d.slug,
        description: d.description ?? null,
        appearance: d.appearance ?? null,
        type: d.type,
        category: d.category ?? null,
        rarity: d.rarity ?? null,
        equip_slot: d.equipSlot ?? null,
        cost: d.cost ?? 0,
        weight: d.weight ?? 0,
        weapon_properties: d.weaponProperties ?? null,
        armor_properties: d.armorProperties ?? null,
        flat_bonus: d.flatBonus ?? null,
        override_bonus: d.overrideBonus ?? null,
      })),
      { transaction: transaction ?? undefined, returning: true }
    );

    return items.map((item) => this.toReturn(item));
  }

  async getByCampaignId(campaignId: number): Promise<ItemDataReturn[]> {
    const items = await Item.findAll({
      where: { campaign_id: campaignId },
      order: [['created_at', 'ASC']],
    });

    return items.map((item) => this.toReturn(item));
  }

  private toReturn(item: Item): ItemDataReturn {
    return {
      id: item.id,
      campaignId: item.campaign_id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      appearance: item.appearance,
      type: item.type,
      category: item.category,
      rarity: item.rarity,
      equipSlot: item.equip_slot,
      cost: Number(item.cost),
      weight: Number(item.weight),
      weaponProperties: item.weapon_properties,
      armorProperties: item.armor_properties,
      flatBonus: item.flat_bonus,
      overrideBonus: item.override_bonus,
      createdAt: item.created_at,
    };
  }
}
