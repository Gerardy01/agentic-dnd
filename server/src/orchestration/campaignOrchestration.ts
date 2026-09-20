import { Response } from 'express';
import sequelize from '@/config/database';
import { CampaignDataReturn, CampaignListReturn } from '@/interfaces/ICampaign';
import { ICampaignService } from '@/services/campaignService';
import { IFactionService } from '@/services/factionService';
import { IWorldService } from '@/services/worldService';
import { IClassService } from '@/services/classService';
import { IRaceService } from '@/services/raceService';
import { INpcService } from '@/services/npcService';
import { IItemService } from '@/services/itemService';
import { ISpellService } from '@/services/spellService';
import { IQuestService } from '@/services/questService';
import { LoggerService } from '@/services/loggerService';
import { sseManager } from '@/utils/sseManager';

import { CampaignModeEnum } from '@/utils/enums';

export type CampaignProgressCallback = (step: string, message: string, current: number, total: number) => void;

export interface ICampaignOrchestration {
  initiateCampaignCreation(
    name: string,
    themePrompt: string,
    language: string,
    accountId: string
  ): { processId: string };

  streamProgress(processId: string, accountId: string, res: Response): boolean;

  createCampaign(
    name: string,
    themePrompt: string,
    language: string,
    accountId: string,
    onProgress?: CampaignProgressCallback
  ): Promise<CampaignDataReturn>;

  getCampaigns(accountId: string): Promise<CampaignListReturn[]>;
  getCampaignById(campaignId: number, accountId: string): Promise<CampaignListReturn>;
}

export class CampaignOrchestration implements ICampaignOrchestration {
  private logger = new LoggerService('CampaignOrchestration');

  constructor(
    private campaignService: ICampaignService,
    private factionService: IFactionService,
    private worldService: IWorldService,
    private classService: IClassService,
    private raceService: IRaceService,
    private npcService: INpcService,
    private itemService: IItemService,
    private spellService: ISpellService,
    private questService: IQuestService,
  ) { }

  /**
   * Initiates campaign generation in background and registers an SSE channel.
   * Uses campaignService to generate the unique processId via ICryptProvider.
   */
  initiateCampaignCreation(
    name: string,
    themePrompt: string,
    language: string,
    accountId: string
  ): { processId: string } {
    const processId = this.campaignService.generateProcessId();

    sseManager.initChannel(processId, accountId);

    this.createCampaign(
      name,
      themePrompt,
      language,
      accountId,
      (step, message, current, total) => {
        sseManager.emitStep(processId, { step, message, current, total });
      }
    )
      .then((campaign) => {
        sseManager.emitComplete(processId, campaign);
      })
      .catch((err) => {
        sseManager.emitError(processId, err?.message || 'Campaign creation failed');
      });

    return { processId };
  }

  /**
   * Connects an incoming HTTP response to the SSE stream for a campaign generation process.
   */
  streamProgress(processId: string, accountId: string, res: Response): boolean {
    return sseManager.connect(processId, accountId, res);
  }

  /**
   * Main campaign creation entry point.
   *
   * Execution order (all within a single transaction):
   *   1. Create Campaign record
   *   2. Initialize CampaignGameState
   *   3. Create World → Map
   *   4. Create Factions
   *   5. Create Areas (geographic skeleton — continent/kingdom/duchy level)
   *   6. Create Sub-Areas (optional settlement-level areas under each leaf)
   *   7. Create POIs (brief → detail → ASCII per leaf area)
   *   8. Create Classes with ClassResources
   *   9. Create Races
   *   10. Create NPCs
   *   11. Create Items
   *   12. Create Spells per Class
   */
  async createCampaign(
    name: string,
    themePrompt: string,
    language: string,
    accountId: string,
    onProgress?: CampaignProgressCallback
  ): Promise<CampaignDataReturn> {
    const emitStep = (stepStr: string, message: string) => {
      this.logger.step(stepStr, message);
      const [curr, tot] = stepStr.split('/').map(Number);
      onProgress?.(stepStr, `[${stepStr}] ${message}`, curr || 0, tot || 13);
    };

    this.logger.info(`Starting campaign creation for: "${name}"`);
    this.logger.info(`Theme Prompt: "${themePrompt}"`);
    this.logger.info(`Language: "${language}"`);

    const transaction = await sequelize.transaction();

    try {
      // --- Step 1: Create Campaign ---
      emitStep('1/13', 'Creating campaign DB record...');
      const campaign = await this.campaignService.create({ name, themePrompt, language }, accountId, transaction);
      this.logger.success(`Campaign record created with ID: ${campaign.id}`);

      // --- Step 2: Initialize CampaignGameState ---
      emitStep('2/13', 'Initializing Campaign Game State...');
      await this.campaignService.createGameState(
        {
          campaignId: campaign.id,
          mode: CampaignModeEnum.NARRATIVE,
          partyLevel: 1,
          shortRestCount: 2,
          inGameTime: null,
          inGameWeather: null,
          currentPoiId: null,
          chapterSummary: null,
          position: null,
        },
        transaction
      );
      this.logger.success('Campaign Game State initialized');

      // --- Step 3: Create World → Map (AI-generated)
      emitStep('3/13', 'Generating World & Map via AI...');
      const world = await this.worldService.generateWorld(
        { campaignName: name, themePrompt, language },
        campaign.id,
        transaction
      );

      const map = await this.worldService.generateMap(
        {
          themePrompt,
          language,
          world: { name: world.name, description: world.description, currencyName: world.currencyName },
        },
        world.id,
        transaction
      );
      this.logger.success(`World and Map created (World ID: ${world.id}, Map ID: ${map.id})`);

      // --- Step 4: Create Factions (AI-generated) ---
      emitStep('4/13', 'Generating Factions via AI (Brief list + Detail loop)...');
      const factions = await this.factionService.generateFactions(
        {
          themePrompt,
          language,
          world: {
            name: world.name,
            description: world.description,
            currencyName: world.currencyName,
          },
          map: {
            descriptiveOverview: map.descriptiveOverview,
          },
        },
        campaign.id,
        transaction
      );
      this.logger.success(`Successfully generated and saved ${factions.length} factions`);

      // --- Step 5: Generate Areas (AI-generated, brief tree + detail loop) ---
      emitStep('5/13', 'Generating Areas via AI (Brief tree + Detail loop)...');
      const areas = await this.worldService.generateAreas(
        {
          themePrompt,
          language,
          world: {
            name: world.name,
            description: world.description,
            currencyName: world.currencyName,
          },
          map: {
            descriptiveOverview: map.descriptiveOverview,
          },
          factions: factions.map(f => ({
            id: f.id,
            name: f.name,
            description: f.description,
            reputation: f.reputation,
            influence: f.influence,
          })),
        },
        campaign.id,
        map.id,
        transaction
      );
      this.logger.success(`Successfully generated and saved ${areas.length} areas`);

      // Determine leaf areas: areas not referenced as parentAreaId by any other area,
      // sorted deepest first (most specific = best starting candidate).
      const parentIds = new Set(areas.map(a => a.parentAreaId).filter((id): id is number => id !== null));
      const leafAreas = areas
        .filter(a => !parentIds.has(a.id))
        .sort((a, b) => b.depth - a.depth);
      this.logger.info(`Identified ${leafAreas.length} leaf area(s); using 1 as starting area`);

      // Build a compact area tree string for sub-area context
      const fullAreaTreeContext = JSON.stringify(
        areas.map(a => ({ id: a.id, name: a.name, levelType: a.levelType, parentAreaId: a.parentAreaId, depth: a.depth })),
        null, 2
      );

      // --- Step 6: Generate Sub-Areas for the 1 starting leaf only ---
      // We only subdivide the single starting area — the AI DM generates more during gameplay.
      emitStep('6/13', 'Generating Sub-Areas via AI (starting area only)...');
      const startingLeaf = leafAreas.slice(0, 1);
      const finalLeafAreas = await this.worldService.generateSubAreas(
        {
          themePrompt,
          language,
          world: {
            name: world.name,
            description: world.description,
            currencyName: world.currencyName,
          },
          map: {
            descriptiveOverview: map.descriptiveOverview,
          },
          fullAreaTreeContext,
        },
        campaign.id,
        map.id,
        startingLeaf,
        transaction
      );
      this.logger.success(`Sub-area pass complete — ${finalLeafAreas.length} starting leaf area(s)`);

      // --- Step 7: Generate POIs for starting areas only (max 2 areas × 2-3 POIs = ~4-6 POIs) ---
      // Cap to 2 areas. More POIs/areas will be generated by the AI DM during gameplay.
      emitStep('7/13', 'Generating POIs via AI (starting areas only)...');
      const areasForPOIs = finalLeafAreas.slice(0, 2);
      const pois = await this.worldService.generatePOIs(
        {
          themePrompt,
          language,
          world: {
            name: world.name,
            description: world.description,
            currencyName: world.currencyName,
          },
          map: {
            descriptiveOverview: map.descriptiveOverview,
          },
        },
        campaign.id,
        areasForPOIs,
        transaction
      );
      this.logger.success(`Successfully generated and saved ${pois.length} starting POIs`);

      // --- Step 8: Generate Classes via AI (Brief list + Detail loop) ---
      emitStep('8/13', 'Generating Classes via AI (Brief list + Detail loop)...');
      const classes = await this.classService.generateClasses(
        {
          themePrompt,
          language,
          world: {
            name: world.name,
            description: world.description,
            currencyName: world.currencyName,
          },
        },
        campaign.id,
        transaction
      );
      this.logger.success(`Successfully generated and saved ${classes.length} classes`);

      // --- Step 9: Create Races via AI (Brief list + Detail loop) ---
      emitStep('9/13', 'Generating Races via AI (Brief list + Detail loop)...');
      const races = await this.raceService.generateRaces(
        {
          themePrompt,
          language,
          world: {
            name: world.name,
            description: world.description,
            currencyName: world.currencyName,
          },
        },
        campaign.id,
        transaction
      );
      this.logger.success(`Successfully generated and saved ${races.length} races`);

      await transaction.commit();
      this.logger.success(`Campaign creation complete! Transaction committed for campaign ID: ${campaign.id}`);

      return campaign;
    } catch (error) {
      await transaction.rollback();
      this.logger.error('Campaign creation failed. Transaction rolled back.', error);
      throw error;
    }
  }

  async getCampaigns(accountId: string): Promise<CampaignListReturn[]> {
    const campaigns = await this.campaignService.getCampaigns(accountId);
    if (campaigns.length === 0) {
      return [];
    }

    const campaignIds = campaigns.map((c) => c.id);
    const worlds = await this.worldService.getWorldsByCampaignIds(campaignIds);
    const worldMap = new Map<number, string | null>();
    for (const world of worlds) {
      worldMap.set(world.campaignId, world.description);
    }

    return campaigns.map((campaign) => ({
      id: campaign.id,
      accountId: campaign.accountId,
      name: campaign.name,
      themePrompt: campaign.themePrompt,
      language: campaign.language,
      worldDescription: worldMap.get(campaign.id) ?? null,
      createdAt: campaign.createdAt,
    }));
  }

  async getCampaignById(campaignId: number, accountId: string): Promise<CampaignListReturn> {
    const campaign = await this.campaignService.getById(campaignId, accountId);
    const worlds = await this.worldService.getWorldsByCampaignIds([campaign.id]);
    const world = worlds[0];

    return {
      id: campaign.id,
      accountId: campaign.accountId,
      name: campaign.name,
      themePrompt: campaign.themePrompt,
      language: campaign.language,
      worldDescription: world?.description ?? null,
      createdAt: campaign.createdAt,
    };
  }
}
