import { Response } from 'express';
import sequelize from '@/config/database';
import { CampaignDataReturn, CampaignListReturn, CampaignSuccessParameter } from '@/interfaces/ICampaign';
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
import { DataNotFound } from '@/utils/exceptions';
import { WorldDataReturn, MapDataReturn, AreaDataReturn, POIDataReturn } from '@/interfaces/IWorld';
import { FactionDataReturn } from '@/interfaces/IFaction';
import { RaceDataReturn } from '@/interfaces/IRace';
import { ClassDataReturn } from '@/interfaces/IClass';

export type CampaignProgressCallback = (step: string, message: string, current: number, total: number) => void;

export interface ICampaignOrchestration {
  initiateCampaignCreation(
    name: string,
    themePrompt: string,
    language: string,
    accountId: string
  ): { processId: string };

  initiateCampaignContinuation(
    campaignId: number,
    accountId: string,
    successParameter: CampaignSuccessParameter
  ): { processId: string };

  streamProgress(processId: string, accountId: string, res: Response): boolean;

  createCampaign(
    name: string,
    themePrompt: string,
    language: string,
    accountId: string,
    onProgress?: CampaignProgressCallback
  ): Promise<CampaignDataReturn>;

  continueCampaign(
    campaignId: number,
    accountId: string,
    successParameter: CampaignSuccessParameter,
    onProgress?: CampaignProgressCallback
  ): Promise<CampaignDataReturn>;

  getCampaigns(accountId: string): Promise<CampaignListReturn[]>;
  getCampaignById(campaignId: number, accountId: string): Promise<CampaignListReturn>;
  deleteCampaign(campaignId: number, accountId: string): Promise<void>;
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
   * Initiates campaign generation continuation in background and registers an SSE channel.
   */
  initiateCampaignContinuation(
    campaignId: number,
    accountId: string,
    successParameter: CampaignSuccessParameter
  ): { processId: string } {
    const processId = this.campaignService.generateProcessId();

    sseManager.initChannel(processId, accountId);

    this.continueCampaign(
      campaignId,
      accountId,
      successParameter,
      (step, message, current, total) => {
        sseManager.emitStep(processId, { step, message, current, total });
      }
    )
      .then((campaign) => {
        sseManager.emitComplete(processId, campaign);
      })
      .catch((err) => {
        sseManager.emitError(processId, err?.message || 'Campaign continuation failed');
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
   * Execution order:
   *   Core transaction (Steps 1-3, locked & rolled back if failure):
   *     1. Create Campaign record
   *     2. Initialize CampaignGameState
   *     3. Create World → Map
   *   Independent modules (Steps 4-11, each in try/catch without transaction lock):
   *     4. Create Factions
   *     5. Create Areas (geographic skeleton — continent/kingdom/duchy level)
   *     6. Create Sub-Areas (optional settlement-level areas under each leaf)
   *     7. Create POIs (brief → detail → ASCII per leaf area)
   *     8. Create Classes with ClassResources
   *     9. Create Races
   *     10. Create NPCs
   *     11. Create Items
   *     12. Create Spells (brief → detail per spell, then assigned to the classes that can learn them)
   */
  async createCampaign(
    name: string,
    themePrompt: string,
    language: string,
    accountId: string,
    onProgress?: CampaignProgressCallback
  ): Promise<CampaignDataReturn> {
    this.logger.info(`Starting campaign creation for: "${name}"`);
    this.logger.info(`Theme Prompt: "${themePrompt}"`);
    this.logger.info(`Language: "${language}"`);

    const successParameter: CampaignSuccessParameter = {
      world: false,
      factions: false,
      areas: false,
      pois: false,
      classes: false,
      races: false,
      npcs: false,
      items: false,
      spells: false,
    };

    // --- Core Transaction (Campaign, GameState, World & Map) ---
    const transaction = await sequelize.transaction();
    let campaign: CampaignDataReturn;
    let world: WorldDataReturn;
    let map: MapDataReturn;

    try {
      // --- Step 1: Create Campaign ---
      this.emitStep('1/13', 'Creating campaign DB record...', onProgress);
      campaign = await this.campaignService.create({ name, themePrompt, language }, accountId, transaction);
      this.logger.success(`Campaign record created with ID: ${campaign.id}`);

      // --- Step 2: Initialize CampaignGameState ---
      this.emitStep('2/13', 'Initializing Campaign Game State...', onProgress);
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

      // --- Step 3: Create World → Map (AI-generated) ---
      this.emitStep('3/13', 'Generating World & Map via AI...', onProgress);
      world = await this.worldService.generateWorld(
        { campaignName: name, themePrompt, language },
        campaign.id,
        transaction
      );

      map = await this.worldService.generateMap(
        {
          themePrompt,
          language,
          world: { name: world.name, description: world.description, currencyName: world.currencyName },
        },
        world.id,
        transaction
      );
      this.logger.success(`World and Map created (World ID: ${world.id}, Map ID: ${map.id})`);

      await transaction.commit();
      successParameter.world = true;
      this.logger.success('Core campaign, game state, and world committed successfully');
    } catch (error) {
      await transaction.rollback();
      this.logger.error('Core campaign creation failed. Transaction rolled back.', error);
      throw error;
    }

    // --- Step 4: Create Factions (AI-generated) ---
    let factions: FactionDataReturn[] = [];
    try {
      this.emitStep('4/13', 'Generating Factions via AI (Brief list + Detail loop)...', onProgress);
      factions = await this.factionService.generateFactions(
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
        campaign.id
      );
      successParameter.factions = true;
      this.logger.success(`Successfully generated and saved ${factions.length} factions`);
    } catch (error) {
      this.logger.error('Failed to generate factions:', error);
      return this.buildCampaignResponse(campaign, successParameter);
    }

    // --- Step 5 & 6: Generate Areas & Sub-Areas (AI-generated) ---
    let finalLeafAreas: AreaDataReturn[] = [];
    try {
      this.emitStep('5/13', 'Generating Areas via AI (Brief tree + Detail loop)...', onProgress);
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
          factions: factions.map((f) => ({
            id: f.id,
            name: f.name,
            description: f.description,
            reputation: f.reputation,
            influence: f.influence,
          })),
        },
        campaign.id,
        map.id
      );
      this.logger.success(`Successfully generated and saved ${areas.length} areas`);

      // Determine leaf areas: areas not referenced as parentAreaId by any other area,
      // sorted deepest first (most specific = best starting candidate).
      const parentIds = new Set(areas.map((a) => a.parentAreaId).filter((id): id is number => id !== null));
      const leafAreas = areas
        .filter((a) => !parentIds.has(a.id))
        .sort((a, b) => b.depth - a.depth);
      this.logger.info(`Identified ${leafAreas.length} leaf area(s); using 1 as starting area`);

      // Build a compact area tree string for sub-area context
      const fullAreaTreeContext = JSON.stringify(
        areas.map((a) => ({ id: a.id, name: a.name, levelType: a.levelType, parentAreaId: a.parentAreaId, depth: a.depth })),
        null,
        2
      );

      // --- Step 6: Generate Sub-Areas for the 1 starting leaf only ---
      // We only subdivide the single starting area — the AI DM generates more during gameplay.
      this.emitStep('6/13', 'Generating Sub-Areas via AI (starting area only)...', onProgress);
      const startingLeaf = leafAreas.slice(0, 1);
      try {
        finalLeafAreas = await this.worldService.generateSubAreas(
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
          startingLeaf
        );
        this.logger.success(`Sub-area pass complete — ${finalLeafAreas.length} starting leaf area(s)`);
      } catch (subAreaErr) {
        this.logger.warn('Failed to generate sub-areas, falling back to top-level leaf area:', subAreaErr);
        finalLeafAreas = startingLeaf;
      }

      successParameter.areas = true;
    } catch (error) {
      this.logger.error('Failed to generate areas:', error);
      return this.buildCampaignResponse(campaign, successParameter);
    }

    // --- Step 7: Generate POIs for starting areas only (max 2 areas × 2-3 POIs = ~4-6 POIs) ---
    // Cap to 2 areas. More POIs/areas will be generated by the AI DM during gameplay.
    let pois: POIDataReturn[] = [];
    try {
      this.emitStep('7/13', 'Generating POIs via AI (starting areas only)...', onProgress);
      if (finalLeafAreas.length > 0) {
        const areasForPOIs = finalLeafAreas.slice(0, 2);
        pois = await this.worldService.generatePOIs(
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
          areasForPOIs
        );
        successParameter.pois = true;
        this.logger.success(`Successfully generated and saved ${pois.length} starting POIs`);
      } else {
        this.logger.warn('No leaf areas available, skipping POI generation');
        return this.buildCampaignResponse(campaign, successParameter);
      }
    } catch (error) {
      this.logger.error('Failed to generate POIs:', error);
      return this.buildCampaignResponse(campaign, successParameter);
    }

    // --- Step 8: Generate Classes via AI (Brief list + Detail loop) ---
    let classes: ClassDataReturn[] = [];
    try {
      this.emitStep('8/13', 'Generating Classes via AI (Brief list + Detail loop)...', onProgress);
      classes = await this.classService.generateClasses(
        {
          themePrompt,
          language,
          world: {
            name: world.name,
            description: world.description,
            currencyName: world.currencyName,
          },
        },
        campaign.id
      );
      successParameter.classes = true;
      this.logger.success(`Successfully generated and saved ${classes.length} classes`);
    } catch (error) {
      this.logger.error('Failed to generate classes:', error);
      return this.buildCampaignResponse(campaign, successParameter);
    }

    // --- Step 9: Create Races via AI (Brief list + Detail loop) ---
    let races: RaceDataReturn[] = [];
    try {
      this.emitStep('9/13', 'Generating Races via AI (Brief list + Detail loop)...', onProgress);
      races = await this.raceService.generateRaces(
        {
          themePrompt,
          language,
          world: {
            name: world.name,
            description: world.description,
            currencyName: world.currencyName,
          },
        },
        campaign.id
      );
      successParameter.races = true;
      this.logger.success(`Successfully generated and saved ${races.length} races`);
    } catch (error) {
      this.logger.error('Failed to generate races:', error);
      return this.buildCampaignResponse(campaign, successParameter);
    }

    // --- Step 10: Generate NPCs via AI (Brief list + Detail loop) ---
    try {
      this.emitStep('10/13', 'Generating NPCs via AI (Brief list + Detail loop)...', onProgress);
      const generatedNpcs = await this.npcService.generateNpcs(
        {
          themePrompt,
          language,
          world: {
            name: world.name,
            description: world.description,
            currencyName: world.currencyName,
          },
          races: races.map((r) => ({
            id: r.id,
            name: r.name,
            description: r.description,
          })),
          pois: pois.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            map: p.map,
          })),
        },
        campaign.id
      );
      this.logger.success(`Successfully generated and saved ${generatedNpcs.length} NPCs`);

      if (pois.length > 0 && generatedNpcs.length > 0) {
        this.emitStep('10/13', 'Assigning NPCs to Points of Interest...', onProgress);
        const validPoiIds = new Set(pois.map((p) => p.id));
        const validLinks = generatedNpcs
          .filter((item) => validPoiIds.has(item.poiId))
          .map((item) => ({
            npcId: item.npc.id,
            poiId: item.poiId,
            position: JSON.stringify(item.position),
          }));

        if (validLinks.length > 0) {
          await this.worldService.linkNpcsToPOIs(validLinks);
          this.logger.success(`Successfully assigned ${validLinks.length} NPCs to their POIs`);
        }
      }

      successParameter.npcs = true;
    } catch (error) {
      this.logger.error('Failed to generate NPCs:', error);
      return this.buildCampaignResponse(campaign, successParameter);
    }

    // --- Step 11: Generate Items via AI (Brief list + Detail loop) ---
    try {
      this.emitStep('11/13', 'Generating Items via AI (Brief list + Detail loop)...', onProgress);
      const items = await this.itemService.generateItems(
        {
          themePrompt,
          language,
          world: {
            name: world.name,
            description: world.description,
            currencyName: world.currencyName,
          },
        },
        campaign.id
      );
      successParameter.items = true;
      this.logger.success(`Successfully generated and saved ${items.length} items`);
    } catch (error) {
      this.logger.error('Failed to generate items:', error);
      return this.buildCampaignResponse(campaign, successParameter);
    }

    // --- Step 12: Generate Spells via AI (Brief list + Detail loop, then assign to classes) ---
    try {
      this.emitStep('12/13', 'Generating Spells via AI (Brief list + Detail loop)...', onProgress);
      const spellcasterClasses = this.classService.getSpellcasterClasses(classes);
      if (spellcasterClasses.length === 0) {
        this.logger.info('No spellcasting classes found, skipping spell generation');
      } else {
        // Spells and their class_spells links are saved together so a failed link never leaves orphan spells
        const spellTransaction = await sequelize.transaction();
        try {
          const generatedSpells = await this.spellService.generateSpells(
            {
              themePrompt,
              language,
              world: {
                name: world.name,
                description: world.description,
                currencyName: world.currencyName,
              },
              classes: spellcasterClasses,
            },
            campaign.id,
            spellTransaction
          );

          const classSpellLinks = generatedSpells.flatMap(({ spell, classIds }) =>
            classIds.map((classId) => ({ classId, spellId: spell.id }))
          );
          await this.classService.linkSpellsToClasses(classSpellLinks, spellTransaction);

          await spellTransaction.commit();
          this.logger.success(
            `Successfully generated ${generatedSpells.length} spells and linked them to classes (${classSpellLinks.length} class_spells records)`
          );
        } catch (spellError) {
          await spellTransaction.rollback();
          throw spellError;
        }
      }
      successParameter.spells = true;
    } catch (error) {
      this.logger.error('Failed to generate spells:', error);
      return this.buildCampaignResponse(campaign, successParameter);
    }

    return this.buildCampaignResponse(campaign, successParameter);
  }

  private emitStep(
    stepStr: string,
    message: string,
    onProgress?: CampaignProgressCallback
  ): void {
    this.logger.step(stepStr, message);
    const [curr, tot] = stepStr.split('/').map(Number);
    onProgress?.(stepStr, `[${stepStr}] ${message}`, curr || 0, tot || 13);
  }

  private buildCampaignResponse(
    campaign: CampaignDataReturn,
    successParameter: CampaignSuccessParameter
  ): CampaignDataReturn {
    this.logger.info(
      `Campaign creation finished for campaign ID: ${campaign.id}. Summary: ${JSON.stringify(successParameter)}`
    );
    return {
      ...campaign,
      successParameter,
    };
  }

  /**
   * Continues campaign generation for modules that failed or were left off.
   * Loads existing entities via service layer methods and runs remaining modules.
   */
  async continueCampaign(
    campaignId: number,
    accountId: string,
    successParameter: CampaignSuccessParameter,
    onProgress?: CampaignProgressCallback
  ): Promise<CampaignDataReturn> {
    const campaign = await this.campaignService.getById(campaignId, accountId);
    if (!campaign) {
      throw new DataNotFound('Campaign not found');
    }

    const name = campaign.name;
    const themePrompt = campaign.themePrompt || '';
    const language = campaign.language || 'en';

    this.logger.info(`Continuing campaign creation for ID ${campaignId}: "${name}"`);
    this.logger.info(`Current success parameters: ${JSON.stringify(successParameter)}`);

    const currentSuccessParameter: CampaignSuccessParameter = { ...successParameter };

    // --- Ensure World & Map exist via Service ---
    let world = await this.worldService.getWorldByCampaignId(campaignId);
    if (!world) {
      this.logger.info('World not found in DB, generating World via AI...');
      this.emitStep('3/13', 'Generating World & Map via AI...', onProgress);
      world = await this.worldService.generateWorld(
        { campaignName: name, themePrompt, language },
        campaign.id
      );
    }

    let map = await this.worldService.getMapByWorldId(world.id);
    if (!map) {
      this.logger.info('Map not found in DB, generating Map via AI...');
      map = await this.worldService.generateMap(
        {
          themePrompt,
          language,
          world: { name: world.name, description: world.description, currencyName: world.currencyName },
        },
        world.id
      );
    }
    currentSuccessParameter.world = true;

    // --- Step 4: Factions ---
    let factions: FactionDataReturn[] = [];
    if (!currentSuccessParameter.factions) {
      try {
        this.emitStep('4/13', 'Generating Factions via AI (Brief list + Detail loop)...', onProgress);
        factions = await this.factionService.generateFactions(
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
          campaign.id
        );
        currentSuccessParameter.factions = true;
        this.logger.success(`Successfully generated and saved ${factions.length} factions`);
      } catch (error) {
        this.logger.error('Failed to generate factions:', error);
        return this.buildCampaignResponse(campaign, currentSuccessParameter);
      }
    } else {
      factions = await this.factionService.getByCampaignId(campaign.id);
      this.logger.info(`Loaded ${factions.length} existing factions from service`);
    }

    // --- Step 5 & 6: Areas & Sub-Areas ---
    let finalLeafAreas: AreaDataReturn[] = [];
    if (!currentSuccessParameter.areas) {
      try {
        this.emitStep('5/13', 'Generating Areas via AI (Brief tree + Detail loop)...', onProgress);
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
            factions: factions.map((f) => ({
              id: f.id,
              name: f.name,
              description: f.description,
              reputation: f.reputation,
              influence: f.influence,
            })),
          },
          campaign.id,
          map.id
        );
        this.logger.success(`Successfully generated and saved ${areas.length} areas`);

        const parentIds = new Set(areas.map((a) => a.parentAreaId).filter((id): id is number => id !== null));
        const leafAreas = areas
          .filter((a) => !parentIds.has(a.id))
          .sort((a, b) => b.depth - a.depth);
        this.logger.info(`Identified ${leafAreas.length} leaf area(s); using 1 as starting area`);

        const fullAreaTreeContext = JSON.stringify(
          areas.map((a) => ({ id: a.id, name: a.name, levelType: a.levelType, parentAreaId: a.parentAreaId, depth: a.depth })),
          null,
          2
        );

        this.emitStep('6/13', 'Generating Sub-Areas via AI (starting area only)...', onProgress);
        const startingLeaf = leafAreas.slice(0, 1);
        try {
          finalLeafAreas = await this.worldService.generateSubAreas(
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
            startingLeaf
          );
          this.logger.success(`Sub-area pass complete — ${finalLeafAreas.length} starting leaf area(s)`);
        } catch (subAreaErr) {
          this.logger.warn('Failed to generate sub-areas, falling back to top-level leaf area:', subAreaErr);
          finalLeafAreas = startingLeaf;
        }

        currentSuccessParameter.areas = true;
      } catch (error) {
        this.logger.error('Failed to generate areas:', error);
        return this.buildCampaignResponse(campaign, currentSuccessParameter);
      }
    } else {
      const existingAreas = await this.worldService.getAreasByMapId(map.id);
      const parentIds = new Set(existingAreas.map((a) => a.parentAreaId).filter((id): id is number => id !== null));
      const leafAreas = existingAreas
        .filter((a) => !parentIds.has(a.id))
        .sort((a, b) => b.depth - a.depth);
      finalLeafAreas = leafAreas.slice(0, 1);
      this.logger.info(`Loaded ${existingAreas.length} existing areas from service; ${leafAreas.length} leaves`);
    }

    // --- Step 7: POIs ---
    let pois: POIDataReturn[] = [];
    if (!currentSuccessParameter.pois) {
      try {
        this.emitStep('7/13', 'Generating POIs via AI (starting areas only)...', onProgress);
        if (finalLeafAreas.length > 0) {
          const areasForPOIs = finalLeafAreas.slice(0, 2);
          pois = await this.worldService.generatePOIs(
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
            areasForPOIs
          );
          currentSuccessParameter.pois = true;
          this.logger.success(`Successfully generated and saved ${pois.length} starting POIs`);
        } else {
          this.logger.warn('No leaf areas available, skipping POI generation');
          return this.buildCampaignResponse(campaign, currentSuccessParameter);
        }
      } catch (error) {
        this.logger.error('Failed to generate POIs:', error);
        return this.buildCampaignResponse(campaign, currentSuccessParameter);
      }
    } else {
      const areasForPOIs = finalLeafAreas.slice(0, 2);
      pois = await this.worldService.getPOIsByAreaIds(areasForPOIs.map((a) => a.id));
      this.logger.info(`Loaded ${pois.length} existing POIs from service`);
    }

    // --- Step 8: Classes ---
    let classes: ClassDataReturn[] = [];
    if (!currentSuccessParameter.classes) {
      try {
        this.emitStep('8/13', 'Generating Classes via AI (Brief list + Detail loop)...', onProgress);
        classes = await this.classService.generateClasses(
          {
            themePrompt,
            language,
            world: {
              name: world.name,
              description: world.description,
              currencyName: world.currencyName,
            },
          },
          campaign.id
        );
        currentSuccessParameter.classes = true;
        this.logger.success(`Successfully generated and saved ${classes.length} classes`);
      } catch (error) {
        this.logger.error('Failed to generate classes:', error);
        return this.buildCampaignResponse(campaign, currentSuccessParameter);
      }
    } else {
      classes = await this.classService.getByCampaignId(campaign.id);
      this.logger.info(`Loaded ${classes.length} existing classes from service`);
    }

    // --- Step 9: Races ---
    let races: RaceDataReturn[] = [];
    if (!currentSuccessParameter.races) {
      try {
        this.emitStep('9/13', 'Generating Races via AI (Brief list + Detail loop)...', onProgress);
        races = await this.raceService.generateRaces(
          {
            themePrompt,
            language,
            world: {
              name: world.name,
              description: world.description,
              currencyName: world.currencyName,
            },
          },
          campaign.id
        );
        currentSuccessParameter.races = true;
        this.logger.success(`Successfully generated and saved ${races.length} races`);
      } catch (error) {
        this.logger.error('Failed to generate races:', error);
        return this.buildCampaignResponse(campaign, currentSuccessParameter);
      }
    } else {
      races = await this.raceService.getByCampaignId(campaign.id);
      this.logger.info(`Loaded ${races.length} existing races from service`);
    }

    // --- Step 10: NPCs ---
    if (!currentSuccessParameter.npcs) {
      try {
        this.emitStep('10/13', 'Generating NPCs via AI (Brief list + Detail loop)...', onProgress);
        const generatedNpcs = await this.npcService.generateNpcs(
          {
            themePrompt,
            language,
            world: {
              name: world.name,
              description: world.description,
              currencyName: world.currencyName,
            },
            races: races.map((r) => ({
              id: r.id,
              name: r.name,
              description: r.description,
            })),
            pois: pois.map((p) => ({
              id: p.id,
              name: p.name,
              description: p.description,
              map: p.map,
            })),
          },
          campaign.id
        );
        this.logger.success(`Successfully generated and saved ${generatedNpcs.length} NPCs`);

        if (pois.length > 0 && generatedNpcs.length > 0) {
          this.emitStep('10/13', 'Assigning NPCs to Points of Interest...', onProgress);
          const validPoiIds = new Set(pois.map((p) => p.id));
          const validLinks = generatedNpcs
            .filter((item) => validPoiIds.has(item.poiId))
            .map((item) => ({
              npcId: item.npc.id,
              poiId: item.poiId,
              position: JSON.stringify(item.position),
            }));

          if (validLinks.length > 0) {
            await this.worldService.linkNpcsToPOIs(validLinks);
            this.logger.success(`Successfully assigned ${validLinks.length} NPCs to their POIs`);
          }
        }

        currentSuccessParameter.npcs = true;
      } catch (error) {
        this.logger.error('Failed to generate NPCs:', error);
        return this.buildCampaignResponse(campaign, currentSuccessParameter);
      }
    } else {
      this.logger.info('NPCs already generated, skipping');
    }

    // --- Step 11: Items ---
    if (!currentSuccessParameter.items) {
      try {
        this.emitStep('11/13', 'Generating Items via AI (Brief list + Detail loop)...', onProgress);
        const items = await this.itemService.generateItems(
          {
            themePrompt,
            language,
            world: {
              name: world.name,
              description: world.description,
              currencyName: world.currencyName,
            },
          },
          campaign.id
        );
        currentSuccessParameter.items = true;
        this.logger.success(`Successfully generated and saved ${items.length} items`);
      } catch (error) {
        this.logger.error('Failed to generate items:', error);
        return this.buildCampaignResponse(campaign, currentSuccessParameter);
      }
    } else {
      this.logger.info('Items already generated, skipping');
    }

    // --- Step 12: Spells ---
    if (!currentSuccessParameter.spells) {
      try {
        this.emitStep('12/13', 'Generating Spells via AI (Brief list + Detail loop)...', onProgress);
        const spellcasterClasses = this.classService.getSpellcasterClasses(classes);
        if (spellcasterClasses.length === 0) {
          this.logger.info('No spellcasting classes found, skipping spell generation');
        } else {
          // Spells and their class_spells links are saved together so a failed link never leaves orphan spells
          const spellTransaction = await sequelize.transaction();
          try {
            const generatedSpells = await this.spellService.generateSpells(
              {
                themePrompt,
                language,
                world: {
                  name: world.name,
                  description: world.description,
                  currencyName: world.currencyName,
                },
                classes: spellcasterClasses,
              },
              campaign.id,
              spellTransaction
            );

            const classSpellLinks = generatedSpells.flatMap(({ spell, classIds }) =>
              classIds.map((classId) => ({ classId, spellId: spell.id }))
            );
            await this.classService.linkSpellsToClasses(classSpellLinks, spellTransaction);

            await spellTransaction.commit();
            this.logger.success(
              `Successfully generated ${generatedSpells.length} spells and linked them to classes (${classSpellLinks.length} class_spells records)`
            );
          } catch (spellError) {
            await spellTransaction.rollback();
            throw spellError;
          }
        }
        currentSuccessParameter.spells = true;
      } catch (error) {
        this.logger.error('Failed to generate spells:', error);
        return this.buildCampaignResponse(campaign, currentSuccessParameter);
      }
    } else {
      this.logger.info('Spells already generated, skipping');
    }

    return this.buildCampaignResponse(campaign, currentSuccessParameter);
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

    // Calculate success parameters
    const successParameter = await this.calculateSuccessParameter(campaignId, world);

    return {
      id: campaign.id,
      accountId: campaign.accountId,
      name: campaign.name,
      themePrompt: campaign.themePrompt,
      language: campaign.language,
      worldDescription: world?.description ?? null,
      createdAt: campaign.createdAt,
      successParameter,
    };
  }

  /**
   * Calculate which campaign modules have been successfully generated
   */
  private async calculateSuccessParameter(
    campaignId: number,
    world?: { id: number } | null
  ): Promise<CampaignSuccessParameter> {
    const successParameter: CampaignSuccessParameter = {
      world: false,
      factions: false,
      areas: false,
      pois: false,
      classes: false,
      races: false,
      npcs: false,
      items: false,
      spells: false,
    };

    // Check world & map
    if (world) {
      try {
        const map = await this.worldService.getMapByWorldId(world.id);
        successParameter.world = !!map;
      } catch {
        successParameter.world = false;
      }
    }

    // Check factions
    try {
      const factions = await this.factionService.getByCampaignId(campaignId);
      successParameter.factions = factions.length > 0;
    } catch {
      successParameter.factions = false;
    }

    // Check areas
    if (world) {
      try {
        const map = await this.worldService.getMapByWorldId(world.id);
        if (map) {
          const areas = await this.worldService.getAreasByMapId(map.id);
          successParameter.areas = areas.length > 0;

          // Check POIs
          if (areas.length > 0) {
            const areaIds = areas.map((a) => a.id);
            const pois = await this.worldService.getPOIsByAreaIds(areaIds);
            successParameter.pois = pois.length > 0;
          }
        }
      } catch {
        successParameter.areas = false;
        successParameter.pois = false;
      }
    }

    // Check classes
    let classes: ClassDataReturn[] = [];
    try {
      classes = await this.classService.getByCampaignId(campaignId);
      successParameter.classes = classes.length > 0;
    } catch {
      successParameter.classes = false;
    }

    // Check races
    try {
      const races = await this.raceService.getByCampaignId(campaignId);
      successParameter.races = races.length > 0;
    } catch {
      successParameter.races = false;
    }

    // Check NPCs
    try {
      const npcs = await this.npcService.getByCampaignId(campaignId);
      successParameter.npcs = npcs.length > 0;
    } catch {
      successParameter.npcs = false;
    }

    // Check items
    try {
      const items = await this.itemService.getByCampaignId(campaignId);
      successParameter.items = items.length > 0;
    } catch {
      successParameter.items = false;
    }

    // Check spells (nothing to generate when no class can cast spells)
    if (successParameter.classes) {
      try {
        const spells = await this.spellService.getByCampaignId(campaignId);
        successParameter.spells = spells.length > 0 || this.classService.getSpellcasterClasses(classes).length === 0;
      } catch {
        successParameter.spells = false;
      }
    }

    return successParameter;
  }

  /**
   * Delete a campaign with name confirmation
   */
  async deleteCampaign(campaignId: number, accountId: string): Promise<void> {
    this.logger.info(`Deleting campaign ID: ${campaignId} for account: ${accountId}`);
    await this.campaignService.deleteCampaign(campaignId, accountId);
    this.logger.success(`Campaign ID: ${campaignId} successfully deleted`);
  }
}
