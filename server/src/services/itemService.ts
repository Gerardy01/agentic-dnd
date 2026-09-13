import { Transaction } from 'sequelize';
import { Item } from '@/models';
import { CreateItemDTO, ItemDataReturn } from '@/interfaces/IItem';

export interface IItemService {
  getCreatePrompt(): string;
  create(data: CreateItemDTO, campaignId: number, transaction?: Transaction): Promise<ItemDataReturn>;
  createBulk(data: CreateItemDTO[], campaignId: number, transaction?: Transaction): Promise<ItemDataReturn[]>;
}

export class ItemService implements IItemService {
  constructor() {}

  getCreatePrompt(): string {
    // TODO: return the AI prompt for generating starting items
    return '';
  }

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
    const results: ItemDataReturn[] = [];

    for (const itemData of data) {
      const item = await this.create(itemData, campaignId, transaction);
      results.push(item);
    }

    return results;
  }

  private toReturn(item: any): ItemDataReturn {
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
      createdAt: item.createdAt,
    };
  }
}
