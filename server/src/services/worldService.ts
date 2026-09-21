import { z } from 'zod';
import { Transaction, Op } from 'sequelize';
import { World, Map, Area, POI, Lore, POINPC } from '@/models';
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
  GenerateAreasDTO,
  GenerateSubAreasDTO,
  GeneratePOIsDTO,
  WorldAIResponse,
  MapAIResponse,
  AreaStubAIResponse,
  AreaBriefListAIResponse,
  AreaDetailAIResponse,
  SubAreaBriefAIResponse,
  POIStubAIResponse,
  POIBriefListAIResponse,
  POIDetailAIResponse,
  WorldDataReturn,
  MapDataReturn,
  AreaDataReturn,
  POIDataReturn,
  LoreDataReturn,
  AreaWithDetailsReturn,
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

// Recursive Zod schema for the area brief tree
const AreaBriefSchema: z.ZodType<AreaStubAIResponse> = z.lazy(() =>
  z.object({
    levelType: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    children: z.array(AreaBriefSchema).optional(),
  })
);

const AreaBriefListSchema = z.object({
  areas: z.array(AreaBriefSchema).min(1),
});

const AreaLoreSchema = z.object({
  title: z.string().min(1).max(150),
  content: z.string().min(1).max(2000),
});

const AreaDetailSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  descriptiveOverview: z.string().default(''),
  descriptiveLocation: z.string().default(''),
  factionNames: z.array(z.string()).default([]),
  lore: AreaLoreSchema.nullable().default(null),
});

// Sub-area brief
const SubAreaChildSchema = z.object({
  levelType: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
});

const SubAreaBriefSchema = z.object({
  children: z.array(SubAreaChildSchema).default([]),
});

// POI brief list
const POIStubSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  description: z.string().min(1),
});

const POIBriefListSchema = z.object({
  pois: z.array(POIStubSchema).min(1),
});

// POI lore (same structure as area lore)
const POILoreSchema = z.object({
  title: z.string().min(1).max(150),
  content: z.string().min(1).max(2000),
});

// POI detail
const POIDetailSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  descriptiveOverview: z.string().default(''),
  descriptiveLocation: z.string().default(''),
  lore: POILoreSchema.nullable().default(null),
});

// POI ASCII map (JSON-structured output from the AI)
// Rows may come back as plain strings ("##..##") or as string arrays (["#","#",...]).
// Both are accepted and normalised to string[][] after parsing.
const POIAsciiLegendEntrySchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(1),
});

const POIAsciiSchema = z.object({
  // Each row is either a plain string or an array of strings
  map: z.array(z.union([z.string(), z.array(z.string())])),
  legend: z.array(POIAsciiLegendEntrySchema).min(1),
});

type POIAsciiAIResponse = z.infer<typeof POIAsciiSchema>;

// Context type for area DFS expansion
type AreaExpansionContext = {
  data: GenerateAreasDTO;
  campaignId: number;
  mapId: number;
  transaction: Transaction | undefined;
  detailSystemPrompt: string;
  worldContext: string;
  mapContext: string;
  factionsContext: string;
  fullBriefTreeContext: string;
  totalNodes: number;
  nodeIndex: number;
  savedAreas: AreaDataReturn[];
};

// Context type for POI expansion loop
type POIExpansionContext = {
  data: GeneratePOIsDTO;
  campaignId: number;
  transaction: Transaction | undefined;
  detailSystemPrompt: string;
  asciiSystemPrompt: string;
  worldContext: string;
  mapContext: string;
  totalPOIs: number;
  poiIndex: number;
  savedPOIs: POIDataReturn[];
  poisToCreate: (CreatePOIDTO & { lore?: { title: string; content: string } | null })[];
};

// ==========================================
// Interface
// ==========================================

export interface IWorldService {
  getCreateWorldPrompt(): string;
  getCreateMapPrompt(): string;
  getAreaBriefPrompt(): string;
  getAreaDetailPrompt(): string;
  getSubAreaBriefPrompt(): string;
  getPOIBriefPrompt(): string;
  getPOIDetailPrompt(): string;
  getPOIAsciiPrompt(): string;
  generateWorld(data: GenerateWorldDTO, campaignId: number, transaction?: Transaction): Promise<WorldDataReturn>;
  generateMap(data: GenerateMapDTO, worldId: number, transaction?: Transaction): Promise<MapDataReturn>;
  generateAreas(data: GenerateAreasDTO, campaignId: number, mapId: number, transaction?: Transaction): Promise<AreaDataReturn[]>;
  generateSubAreas(data: GenerateSubAreasDTO, campaignId: number, mapId: number, leafAreas: AreaDataReturn[], transaction?: Transaction): Promise<AreaDataReturn[]>;
  generatePOIs(data: GeneratePOIsDTO, campaignId: number, leafAreas: AreaDataReturn[], transaction?: Transaction): Promise<POIDataReturn[]>;
  createWorld(data: CreateWorldDTO, campaignId: number, transaction?: Transaction): Promise<WorldDataReturn>;
  createMap(data: CreateMapDTO, worldId: number, transaction?: Transaction): Promise<MapDataReturn>;
  createArea(data: CreateAreaDTO, mapId: number, transaction?: Transaction): Promise<AreaDataReturn>;
  createAreaBulk(data: CreateAreaDTO[], mapId: number, transaction?: Transaction): Promise<AreaDataReturn[]>;
  createPOI(data: CreatePOIDTO, transaction?: Transaction): Promise<POIDataReturn>;
  createPOIBulk(data: CreatePOIDTO[], transaction?: Transaction): Promise<POIDataReturn[]>;
  getWorldsByCampaignIds(campaignIds: number[]): Promise<WorldDataReturn[]>;
  getAreasByCampaignId(campaignId: number): Promise<AreaWithDetailsReturn[]>;
  linkNpcToPOI(npcId: number, poiId: number, position?: string | null, transaction?: Transaction): Promise<void>;
  linkNpcsToPOIs(links: { npcId: number; poiId: number; position?: string | null }[], transaction?: Transaction): Promise<void>;
}

// ==========================================
// Implementation
// ==========================================

export class WorldService implements IWorldService {
  private logger = new LoggerService('WorldService');

  constructor(
    private aiProvider: IAIProvider,
  ) { }

  // ------------------------------------------
  // Prompt methods
  // ------------------------------------------

  getCreateWorldPrompt(): string {
    return loadPrompt('GENERATE_WORLD.md');
  }

  getCreateMapPrompt(): string {
    return loadPrompt('GENERATE_MAP.md');
  }

  getAreaBriefPrompt(): string {
    return loadPrompt('GENERATE_AREA_BRIEF.md');
  }

  getAreaDetailPrompt(): string {
    return loadPrompt('GENERATE_AREA_DETAILED.md');
  }

  getSubAreaBriefPrompt(): string {
    return loadPrompt('GENERATE_SUBAREA_BRIEF.md');
  }

  getPOIBriefPrompt(): string {
    return loadPrompt('GENERATE_POI_BRIEF.md');
  }

  getPOIDetailPrompt(): string {
    return loadPrompt('GENERATE_POI_DETAILED.md');
  }

  getPOIAsciiPrompt(): string {
    return loadPrompt('GENERATE_POI_ASCII.md');
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

  /**
   * Generates areas in two phases:
   * 1. Brief pass — one AI call returns a nested area tree (arbitrary depth, decided by AI).
   * 2. Detail loop — DFS traversal via `_expandAreaNode`; parents saved before children
   *    so real DB IDs exist for parentAreaId references.
   *    Faction names returned by the AI are resolved to {id, name} objects from the provided list.
   *    If the AI returns a lore entry for an area, it is persisted via loreService inline.
   */
  async generateAreas(data: GenerateAreasDTO, campaignId: number, mapId: number, transaction?: Transaction): Promise<AreaDataReturn[]> {
    // ---- Phase 1: Brief pass ----
    const worldContext = JSON.stringify({
      name: data.world.name,
      description: data.world.description,
      currencyName: data.world.currencyName,
    }, null, 2);

    const mapContext = JSON.stringify({
      descriptiveOverview: data.map.descriptiveOverview,
    }, null, 2);

    const factionsContext = JSON.stringify(
      data.factions.map(f => ({ name: f.name, description: f.description, reputation: f.reputation, influence: f.influence })),
      null,
      2
    );

    const briefUserMessage = [
      `Theme: ${data.themePrompt}`,
      `Campaign language: ${data.language}`,
      '',
      'World context:',
      worldContext,
      '',
      'Map context:',
      mapContext,
      '',
      'Factions context:',
      factionsContext,
    ].join('\n');

    this.logger.info('Requesting area brief tree from AI...');
    const briefRaw = await this.aiProvider.chatJSON<AreaBriefListAIResponse>([
      { role: 'system', content: this.getAreaBriefPrompt() },
      { role: 'user', content: briefUserMessage },
    ]);

    const briefParsed = AreaBriefListSchema.parse(briefRaw);

    const totalNodes = this._countAreaNodes(briefParsed.areas);
    this.logger.info(`Area brief tree generated: ${briefParsed.areas.length} top-level areas, ${totalNodes} total nodes`);

    // ---- Phase 2: Detail loop (DFS via private method) ----
    const ctx: AreaExpansionContext = {
      data,
      campaignId,
      mapId,
      transaction,
      detailSystemPrompt: this.getAreaDetailPrompt(),
      worldContext,
      mapContext,
      factionsContext,
      fullBriefTreeContext: JSON.stringify(briefParsed.areas, null, 2),
      totalNodes,
      nodeIndex: 0,
      savedAreas: [],
    };

    for (const rootNode of briefParsed.areas) {
      await this._expandAreaNode(rootNode, 0, null, null, ctx);
    }

    return ctx.savedAreas;
  }

  /**
   * For each existing leaf area, asks AI whether it needs 0–2 sub-areas (settlement-level).
   * - Leaf areas are those with no children in the saved areas list.
   * - If AI returns children → saves them and adds them to the result as the new leaf set.
   * - If AI returns empty → the original leaf area stays in the result as-is.
   * Returns the final flat list of leaf areas that will host POIs.
   */
  async generateSubAreas(
    data: GenerateSubAreasDTO,
    campaignId: number,
    mapId: number,
    leafAreas: AreaDataReturn[],
    transaction?: Transaction
  ): Promise<AreaDataReturn[]> {
    const systemPrompt = this.getSubAreaBriefPrompt();

    const worldContext = JSON.stringify({
      name: data.world.name,
      description: data.world.description,
      currencyName: data.world.currencyName,
    }, null, 2);

    const mapContext = JSON.stringify({
      descriptiveOverview: data.map.descriptiveOverview,
    }, null, 2);

    const finalLeafAreas: AreaDataReturn[] = [];

    for (let i = 0; i < leafAreas.length; i++) {
      const leaf = leafAreas[i];
      this.logger.info(`[${i + 1}/${leafAreas.length}] Checking sub-areas for "${leaf.name}" (${leaf.levelType})...`);

      const parentAreaContext = JSON.stringify({
        id: leaf.id,
        levelType: leaf.levelType,
        name: leaf.name,
        description: leaf.description,
        descriptiveOverview: leaf.descriptiveOverview,
        descriptiveLocation: leaf.descriptiveLocation,
      }, null, 2);

      const userMessage = [
        `Theme: ${data.themePrompt}`,
        `Campaign language: ${data.language}`,
        '',
        'World context:',
        worldContext,
        '',
        'Map context:',
        mapContext,
        '',
        'Full area tree (for geographic context):',
        data.fullAreaTreeContext,
        '',
        'Target parent leaf area (decide if this needs sub-areas):',
        parentAreaContext,
      ].join('\n');

      const raw = await this.aiProvider.chatJSON<SubAreaBriefAIResponse>([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ]);

      const parsed = SubAreaBriefSchema.parse(raw);

      if (parsed.children.length === 0) {
        this.logger.info(`[${i + 1}/${leafAreas.length}] No sub-areas needed for "${leaf.name}" — keeping as leaf`);
        finalLeafAreas.push(leaf);
      } else {
        this.logger.info(`[${i + 1}/${leafAreas.length}] Generating ${parsed.children.length} sub-area(s) under "${leaf.name}"`);
        for (const child of parsed.children) {
          const childPath = leaf.path ? `${leaf.path}/${child.name}` : child.name;
          const saved = await this.createArea(
            {
              parentAreaId: leaf.id,
              depth: leaf.depth + 1,
              path: childPath,
              levelType: child.levelType,
              name: child.name,
              description: child.description,
              factions: leaf.factions,
            },
            mapId,
            transaction
          );
          this.logger.success(`[${i + 1}/${leafAreas.length}] Saved sub-area "${saved.name}" (ID: ${saved.id})`);
          finalLeafAreas.push(saved);
        }
      }
    }

    this.logger.success(`Sub-area pass complete — ${finalLeafAreas.length} final leaf areas for POI generation`);
    return finalLeafAreas;
  }

  /**
   * Generates POIs for each leaf area in three sub-phases:
   * 1. Brief call — gets 3–5 POI stubs for the area.
   * 2. Detail loop — expands each stub into a full POI profile.
   * 3. ASCII call — generates an ASCII map for each detailed POI via chat() (raw text).
   * Persists each POI after both detail and ASCII are ready.
   */
  async generatePOIs(
    data: GeneratePOIsDTO,
    campaignId: number,
    leafAreas: AreaDataReturn[],
    transaction?: Transaction
  ): Promise<POIDataReturn[]> {
    const worldContext = JSON.stringify({
      name: data.world.name,
      description: data.world.description,
      currencyName: data.world.currencyName,
    }, null, 2);

    const mapContext = JSON.stringify({
      descriptiveOverview: data.map.descriptiveOverview,
    }, null, 2);

    const ctx: POIExpansionContext = {
      data,
      campaignId,
      transaction,
      detailSystemPrompt: this.getPOIDetailPrompt(),
      asciiSystemPrompt: this.getPOIAsciiPrompt(),
      worldContext,
      mapContext,
      totalPOIs: 0,
      poiIndex: 0,
      savedPOIs: [],
      poisToCreate: [],
    };

    for (let i = 0; i < leafAreas.length; i++) {
      const area = leafAreas[i];
      await this._expandPOIsForArea(area, i, leafAreas.length, ctx);
    }

    // -- Bulk insert POIs --
    if (ctx.poisToCreate.length > 0) {
      const savedPOIs = await this.createPOIBulk(ctx.poisToCreate, transaction);
      ctx.savedPOIs = savedPOIs;

      // -- Bulk insert Lore for those POIs --
      const loresToCreate = [];
      for (let i = 0; i < savedPOIs.length; i++) {
        const lore = ctx.poisToCreate[i].lore;
        if (!lore) continue;

        loresToCreate.push({
          campaign_id: ctx.campaignId,
          source_id: savedPOIs[i].id,
          source_type: 'poi',
          title: lore.title,
          content: lore.content,
        });
      }

      if (loresToCreate.length > 0) {
        await Lore.bulkCreate(loresToCreate, { transaction: transaction ?? undefined });
        this.logger.success(`Saved ${loresToCreate.length} lore entries for POIs in bulk`);
      }
    }

    this.logger.success(`POI generation complete — ${ctx.savedPOIs.length} POIs created across ${leafAreas.length} areas`);
    return ctx.savedPOIs;
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
    if (data.length === 0) return [];

    const pois = await POI.bulkCreate(
      data.map(d => ({
        area_id: d.areaId,
        name: d.name,
        description: d.description ?? null,
        descriptive_overview: d.descriptiveOverview ?? null,
        descriptive_location: d.descriptiveLocation ?? null,
        map: d.map ?? null,
      })),
      { transaction: transaction ?? undefined, returning: true }
    );

    return pois.map(p => this.poiToReturn(p));
  }

  // ------------------------------------------
  // Private helpers
  // ------------------------------------------

  /** Recursively counts all nodes in an area stub tree. */
  private _countAreaNodes(nodes: AreaStubAIResponse[]): number {
    return nodes.reduce((sum, n) => sum + 1 + this._countAreaNodes(n.children ?? []), 0);
  }

  /**
   * DFS area expansion — called once per node.
   * Saves the parent area first (depth-first), then recurses into children
   * so real DB IDs are available for parentAreaId references.
   */
  private async _expandAreaNode(
    node: AreaStubAIResponse,
    depth: number,
    parentAreaId: number | null,
    parentPath: string | null,
    ctx: AreaExpansionContext
  ): Promise<void> {
    ctx.nodeIndex++;
    this.logger.info(`[${ctx.nodeIndex}/${ctx.totalNodes}] Expanding area "${node.name}" (depth ${depth})...`);

    const targetBriefContext = JSON.stringify({
      levelType: node.levelType,
      name: node.name,
      description: node.description,
      hasChildren: (node.children?.length ?? 0) > 0,
    }, null, 2);

    const detailUserMessage = [
      `Theme: ${ctx.data.themePrompt}`,
      `Campaign language: ${ctx.data.language}`,
      '',
      'World context:',
      ctx.worldContext,
      '',
      'Map context:',
      ctx.mapContext,
      '',
      'Factions context:',
      ctx.factionsContext,
      '',
      'Full area brief tree (for geographic context):',
      ctx.fullBriefTreeContext,
      '',
      'Target area brief (expand THIS one):',
      targetBriefContext,
    ].join('\n');

    const detailRaw = await this.aiProvider.chatJSON<AreaDetailAIResponse>([
      { role: 'system', content: ctx.detailSystemPrompt },
      { role: 'user', content: detailUserMessage },
    ]);

    const detail = AreaDetailSchema.parse(detailRaw);

    // Resolve factionNames → [{id, name}] using the provided factions list (real DB IDs)
    const resolvedFactions = detail.factionNames
      .map(fName => ctx.data.factions.find(f => f.name === fName))
      .filter((f): f is NonNullable<typeof f> => f !== undefined)
      .map(f => ({ id: f.id, name: f.name }));

    const nodePath = parentPath ? `${parentPath}/${node.name}` : node.name;

    const saved = await this.createArea(
      {
        parentAreaId,
        depth,
        path: nodePath,
        levelType: node.levelType,
        name: detail.name,
        description: detail.description,
        descriptiveOverview: detail.descriptiveOverview,
        descriptiveLocation: detail.descriptiveLocation,
        factions: resolvedFactions,
      },
      ctx.mapId,
      ctx.transaction
    );

    this.logger.success(`[${ctx.nodeIndex}/${ctx.totalNodes}] Saved area "${saved.name}" (ID: ${saved.id}, depth: ${depth})`);
    ctx.savedAreas.push(saved);

    // Persist lore if the AI decided this area warrants one
    if (detail.lore) {
      await this._saveAreaLore(saved.id, detail.lore, ctx);
    }

    for (const child of node.children ?? []) {
      await this._expandAreaNode(child, depth + 1, saved.id, nodePath, ctx);
    }
  }

  /**
   * Persists a single lore entry for the given area.
   * Extracted from `_expandAreaNode` to keep the DFS loop focused.
   */
  private async _saveAreaLore(
    areaId: number,
    lore: { title: string; content: string },
    ctx: AreaExpansionContext
  ): Promise<void> {
    await Lore.create(
      {
        campaign_id: ctx.campaignId,
        source_id: areaId,
        source_type: 'area',
        title: lore.title,
        content: lore.content,
      },
      { transaction: ctx.transaction ?? undefined }
    );
    this.logger.success(`[${ctx.nodeIndex}/${ctx.totalNodes}] Saved lore "${lore.title}" for area ID ${areaId}`);
  }

  /**
   * Runs the full brief → detail → ASCII pipeline for all POIs in a single area.
   * Called once per leaf area from generatePOIs.
   */
  private async _expandPOIsForArea(
    area: AreaDataReturn,
    areaIndex: number,
    totalAreas: number,
    ctx: POIExpansionContext
  ): Promise<void> {
    this.logger.info(`[Area ${areaIndex + 1}/${totalAreas}] Generating POI brief list for "${area.name}"...`);

    const areaContext = JSON.stringify({
      name: area.name,
      levelType: area.levelType,
      description: area.description,
      descriptiveOverview: area.descriptiveOverview,
      descriptiveLocation: area.descriptiveLocation,
    }, null, 2);

    // ---- Phase 1: Brief list ----
    const briefUserMessage = [
      `Theme: ${ctx.data.themePrompt}`,
      `Campaign language: ${ctx.data.language}`,
      '',
      'World context:',
      ctx.worldContext,
      '',
      'Map context:',
      ctx.mapContext,
      '',
      'Parent area context:',
      areaContext,
    ].join('\n');

    const briefRaw = await this.aiProvider.chatJSON<POIBriefListAIResponse>([
      { role: 'system', content: this.getPOIBriefPrompt() },
      { role: 'user', content: briefUserMessage },
    ]);

    const briefParsed = POIBriefListSchema.parse(briefRaw);
    ctx.totalPOIs += briefParsed.pois.length;
    this.logger.info(`[Area ${areaIndex + 1}/${totalAreas}] Got ${briefParsed.pois.length} POI stubs for "${area.name}"`);

    const briefListContext = JSON.stringify(briefParsed.pois, null, 2);

    // ---- Phase 2: Detail loop + ASCII per POI ----
    for (let j = 0; j < briefParsed.pois.length; j++) {
      ctx.poiIndex++;
      const stub = briefParsed.pois[j];
      this.logger.info(`[POI ${ctx.poiIndex}] Expanding "${stub.name}" (${stub.type})...`);

      // -- Detail call --
      const detailUserMessage = [
        `Theme: ${ctx.data.themePrompt}`,
        `Campaign language: ${ctx.data.language}`,
        '',
        'World context:',
        ctx.worldContext,
        '',
        'Map context:',
        ctx.mapContext,
        '',
        'Parent area context:',
        areaContext,
        '',
        'All POI stubs for this area (for context, avoid overlap):',
        briefListContext,
        '',
        'Target POI stub (expand THIS one):',
        JSON.stringify({ name: stub.name, type: stub.type, description: stub.description }, null, 2),
      ].join('\n');

      const detailRaw = await this.aiProvider.chatJSON<POIDetailAIResponse>([
        { role: 'system', content: ctx.detailSystemPrompt },
        { role: 'user', content: detailUserMessage },
      ]);

      const detail = POIDetailSchema.parse(detailRaw);

      // -- ASCII call --
      const asciiMap = await this._generatePOIAscii(stub.type, detail, ctx.asciiSystemPrompt);

      // -- Persist --
      ctx.poisToCreate.push({
        areaId: area.id,
        name: detail.name,
        description: detail.description,
        descriptiveOverview: detail.descriptiveOverview,
        descriptiveLocation: detail.descriptiveLocation,
        map: asciiMap,
        lore: detail.lore,
      });

      this.logger.success(`[POI ${ctx.poiIndex}] Processed "${detail.name}" in area "${area.name}"`);
    }
  }

  /**
   * Persists a single lore entry for the given POI.
   * Mirrors _saveAreaLore — extracted to keep the POI expansion loop focused.
   */
  private async _savePOILore(
    poiId: number,
    lore: { title: string; content: string },
    ctx: POIExpansionContext
  ): Promise<void> {
    await Lore.create(
      {
        campaign_id: ctx.campaignId,
        source_id: poiId,
        source_type: 'poi',
        title: lore.title,
        content: lore.content,
      },
      { transaction: ctx.transaction ?? undefined }
    );
    this.logger.success(`[POI ${ctx.poiIndex}] Saved lore "${lore.title}" for POI ID ${poiId}`);
  }

  /**
   * Calls AI to generate a structured ASCII map (JSON) for a single POI.
   * Returns the validated JSON serialised as a string for storage in poi.map.
   */
  private async _generatePOIAscii(
    type: string,
    detail: POIDetailAIResponse,
    systemPrompt: string
  ): Promise<string> {
    const userMessage = [
      `Name: ${detail.name}`,
      `Type: ${type}`,
      '',
      'Description:',
      detail.description,
      '',
      'Descriptive Overview:',
      detail.descriptiveOverview,
    ].join('\n');

    const raw = await this.aiProvider.chatJSON<POIAsciiAIResponse>([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ]);

    const parsed = POIAsciiSchema.parse(raw);

    // Normalise rows: split plain-string rows into char arrays, then take
    // only the first character of every cell (guards against multi-char output).
    const normalizedMap: string[][] = parsed.map.map((row) => {
      const chars: string[] = typeof row === 'string' ? row.split('') : row;
      return chars.map((cell) => (cell.length > 0 ? cell[0] : ' '));
    });

    // Normalise legend symbols the same way.
    const normalizedLegend = parsed.legend.map((entry) => ({
      ...entry,
      symbol: entry.symbol.length > 0 ? entry.symbol[0] : '?',
    }));

    return JSON.stringify({ map: normalizedMap, legend: normalizedLegend });
  }

  async getWorldsByCampaignIds(campaignIds: number[]): Promise<WorldDataReturn[]> {
    if (campaignIds.length === 0) {
      return [];
    }

    const worlds = await World.findAll({
      where: {
        campaign_id: {
          [Op.in]: campaignIds,
        },
      },
    });

    return worlds.map((world) => ({
      id: world.id,
      campaignId: world.campaign_id,
      name: world.name,
      description: world.description,
      currencyName: world.currency_name,
      createdAt: world.created_at,
    }));
  }

  async getAreasByCampaignId(campaignId: number): Promise<AreaWithDetailsReturn[]> {
    const world = await World.findOne({
      where: { campaign_id: campaignId },
    });

    if (!world) {
      return [];
    }

    const map = await Map.findOne({
      where: { world_id: world.id },
    });

    if (!map) {
      return [];
    }

    const areas = await Area.findAll({
      where: { map_id: map.id },
      include: [
        {
          model: POI,
          as: 'pois',
        },
      ],
      order: [
        ['depth', 'ASC'],
        ['id', 'ASC'],
      ],
    });

    const areaIds = areas.map((area) => area.id);

    const lores = areaIds.length > 0
      ? await Lore.findAll({
        where: {
          campaign_id: campaignId,
          source_type: 'area',
          source_id: {
            [Op.in]: areaIds,
          },
        },
      })
      : [];

    const loreMap = new globalThis.Map<number, LoreDataReturn>();
    for (const lore of lores) {
      loreMap.set(lore.source_id, {
        id: lore.id,
        campaignId: lore.campaign_id,
        sourceId: lore.source_id,
        sourceType: lore.source_type,
        title: lore.title,
        content: lore.content,
        createdAt: lore.created_at,
      });
    }

    return areas.map((area) => {
      const baseArea = this.areaToReturn(area);
      const areaPois = (area.pois ?? []).map((poi) => this.poiToReturn(poi));
      const areaLore = loreMap.get(area.id) ?? null;

      return {
        ...baseArea,
        pois: areaPois,
        lore: areaLore,
      };
    });
  }

  private areaToReturn(area: Area): AreaDataReturn {
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
      createdAt: area.created_at,
    };
  }

  private poiToReturn(poi: POI): POIDataReturn {
    return {
      id: poi.id,
      areaId: poi.area_id,
      name: poi.name,
      description: poi.description,
      descriptiveOverview: poi.descriptive_overview,
      descriptiveLocation: poi.descriptive_location,
      map: poi.map,
      createdAt: poi.created_at,
    };
  }

  async linkNpcToPOI(npcId: number, poiId: number, position?: string | null, transaction?: Transaction): Promise<void> {
    await POINPC.create(
      {
        npc_id: npcId,
        poi_id: poiId,
        position: position ?? null,
      },
      { transaction: transaction ?? undefined }
    );
  }

  async linkNpcsToPOIs(links: { npcId: number; poiId: number; position?: string | null }[], transaction?: Transaction): Promise<void> {
    if (links.length === 0) return;
    await POINPC.bulkCreate(
      links.map((link) => ({
        npc_id: link.npcId,
        poi_id: link.poiId,
        position: link.position ?? null,
      })),
      { transaction: transaction ?? undefined }
    );
  }
}
