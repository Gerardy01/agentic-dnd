import { z } from 'zod';
import { Transaction } from 'sequelize';
import { World, Map, Area, POI } from '@/models';
import { IAIProvider } from '@/provider/aiProvider';
import { loadPrompt } from '@/utils/promptLoader';
import { LoggerService } from '@/services/loggerService';
import {
  CreateWorldDTO,
  CreateMapDTO,
  CreateAreaDTO,
  CreatePOIDTO,
  GenerateWorldDTO,
  GenerateMapDTO,
  WorldAIResponse,
  MapAIResponse,
  WorldDataReturn,
  MapDataReturn,
  AreaDataReturn,
  POIDataReturn,
} from '@/interfaces/IWorld';

// ==========================================
// Zod schemas for AI response validation
// ==========================================

const WorldAISchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  currencyName: z.string().min(1),
});

const MapAISchema = z.object({
  descriptiveOverview: z.string().min(1),
});

// ==========================================
// Interface
// ==========================================

export interface IWorldService {
  getCreateWorldPrompt(): string;
  getCreateMapPrompt(): string;
  generateWorld(data: GenerateWorldDTO, campaignId: number, transaction?: Transaction): Promise<WorldDataReturn>;
  generateMap(data: GenerateMapDTO, worldId: number, transaction?: Transaction): Promise<MapDataReturn>;
  createWorld(data: CreateWorldDTO, campaignId: number, transaction?: Transaction): Promise<WorldDataReturn>;
  createMap(data: CreateMapDTO, worldId: number, transaction?: Transaction): Promise<MapDataReturn>;
  createArea(data: CreateAreaDTO, mapId: number, transaction?: Transaction): Promise<AreaDataReturn>;
  createAreaBulk(data: CreateAreaDTO[], mapId: number, transaction?: Transaction): Promise<AreaDataReturn[]>;
  createPOI(data: CreatePOIDTO, transaction?: Transaction): Promise<POIDataReturn>;
  createPOIBulk(data: CreatePOIDTO[], transaction?: Transaction): Promise<POIDataReturn[]>;
}

// ==========================================
// Implementation
// ==========================================

export class WorldService implements IWorldService {
  private logger = new LoggerService('WorldService');

  constructor(private aiProvider: IAIProvider) { }

  // ------------------------------------------
  // Prompt methods
  // ------------------------------------------

  getCreateWorldPrompt(): string {
    return loadPrompt('GENERATE_WORLD.md');
  }

  getCreateMapPrompt(): string {
    return loadPrompt('GENERATE_MAP.md');
  }

  // ------------------------------------------
  // AI-powered generation methods
  // ------------------------------------------

  /**
   * Calls AI to generate world data from the campaign name + user theme prompt,
   * validates the response with Zod, then persists it to the DB.
   */
  async generateWorld(data: GenerateWorldDTO, campaignId: number, transaction?: Transaction): Promise<WorldDataReturn> {
    const systemPrompt = this.getCreateWorldPrompt();

    const userMessage = [
      `Theme: ${data.themePrompt}`,
      `Campaign name: ${data.campaignName}`,
      `Campaign language: ${data.language}`,
    ].join('\n');

    this.logger.info('Requesting world generation from AI...');
    const aiRaw = await this.aiProvider.chatJSON<WorldAIResponse>([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ]);

    const parsed = WorldAISchema.parse(aiRaw);
    this.logger.success(`World generated: "${parsed.name}" (Currency: ${parsed.currencyName})`);

    return this.createWorld(
      {
        name: parsed.name,
        description: parsed.description,
        currencyName: parsed.currencyName,
      },
      campaignId,
      transaction
    );
  }

  /**
   * Calls AI to generate map data using the user theme prompt + world context (JSON),
   * validates the response with Zod, then persists it to the DB.
   */
  async generateMap(data: GenerateMapDTO, worldId: number, transaction?: Transaction): Promise<MapDataReturn> {
    const systemPrompt = this.getCreateMapPrompt();

    const worldContext = JSON.stringify({
      name: data.world.name,
      description: data.world.description,
      currencyName: data.world.currencyName,
    }, null, 2);

    const userMessage = [
      `Theme: ${data.themePrompt}`,
      `Campaign language: ${data.language}`,
      '',
      'World context:',
      worldContext,
    ].join('\n');

    this.logger.info('Requesting map overview from AI...');
    const aiRaw = await this.aiProvider.chatJSON<MapAIResponse>([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ]);

    const parsed = MapAISchema.parse(aiRaw);
    this.logger.success(`Map overview generated (${parsed.descriptiveOverview.length} chars)`);

    return this.createMap(
      { descriptiveOverview: parsed.descriptiveOverview },
      worldId,
      transaction
    );
  }

  // ------------------------------------------
  // Direct DB persistence methods
  // ------------------------------------------

  async createWorld(data: CreateWorldDTO, campaignId: number, transaction?: Transaction): Promise<WorldDataReturn> {
    const world = await World.create(
      {
        campaign_id: campaignId,
        name: data.name,
        description: data.description ?? null,
        currency_name: data.currencyName ?? 'Gold',
      },
      { transaction: transaction ?? undefined }
    );

    return {
      id: world.id,
      campaignId: world.campaign_id,
      name: world.name,
      description: world.description,
      currencyName: world.currency_name,
      createdAt: world.created_at,
    };
  }

  async createMap(data: CreateMapDTO, worldId: number, transaction?: Transaction): Promise<MapDataReturn> {
    const map = await Map.create(
      {
        world_id: worldId,
        descriptive_overview: data.descriptiveOverview ?? null,
      },
      { transaction: transaction ?? undefined }
    );

    return {
      id: map.id,
      worldId: map.world_id,
      descriptiveOverview: map.descriptive_overview,
      createdAt: map.created_at,
    };
  }

  async createArea(data: CreateAreaDTO, mapId: number, transaction?: Transaction): Promise<AreaDataReturn> {
    const area = await Area.create(
      {
        map_id: mapId,
        parent_area_id: data.parentAreaId ?? null,
        depth: data.depth,
        path: data.path ?? null,
        level_type: data.levelType,
        name: data.name,
        description: data.description ?? null,
        descriptive_overview: data.descriptiveOverview ?? null,
        descriptive_location: data.descriptiveLocation ?? null,
        factions: data.factions ?? [],
      },
      { transaction: transaction ?? undefined }
    );

    return this.areaToReturn(area);
  }

  async createAreaBulk(data: CreateAreaDTO[], mapId: number, transaction?: Transaction): Promise<AreaDataReturn[]> {
    const results: AreaDataReturn[] = [];

    for (const areaData of data) {
      const area = await this.createArea(areaData, mapId, transaction);
      results.push(area);
    }

    return results;
  }

  async createPOI(data: CreatePOIDTO, transaction?: Transaction): Promise<POIDataReturn> {
    const poi = await POI.create(
      {
        area_id: data.areaId,
        name: data.name,
        description: data.description ?? null,
        descriptive_overview: data.descriptiveOverview ?? null,
        descriptive_location: data.descriptiveLocation ?? null,
        map: data.map ?? null,
      },
      { transaction: transaction ?? undefined }
    );

    return this.poiToReturn(poi);
  }

  async createPOIBulk(data: CreatePOIDTO[], transaction?: Transaction): Promise<POIDataReturn[]> {
    const results: POIDataReturn[] = [];

    for (const poiData of data) {
      const poi = await this.createPOI(poiData, transaction);
      results.push(poi);
    }

    return results;
  }

  // ------------------------------------------
  // Private helpers
  // ------------------------------------------

  private areaToReturn(area: any): AreaDataReturn {
    return {
      id: area.id,
      mapId: area.map_id,
      parentAreaId: area.parent_area_id,
      depth: area.depth,
      path: area.path,
      levelType: area.level_type,
      name: area.name,
      description: area.description,
      descriptiveOverview: area.descriptive_overview,
      descriptiveLocation: area.descriptive_location,
      factions: area.factions,
      createdAt: area.createdAt,
    };
  }

  private poiToReturn(poi: any): POIDataReturn {
    return {
      id: poi.id,
      areaId: poi.area_id,
      name: poi.name,
      description: poi.description,
      descriptiveOverview: poi.descriptive_overview,
      descriptiveLocation: poi.descriptive_location,
      map: poi.map,
      createdAt: poi.createdAt,
    };
  }
}
