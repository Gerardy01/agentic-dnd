import sequelize from '@/config/database';
import { CampaignDataReturn } from '@/interfaces/ICampaign';
import { ICampaignService } from '@/services/campaignService';
import { IFactionService } from '@/services/factionService';
import { IWorldService } from '@/services/worldService';
import { ILoreService } from '@/services/loreService';
import { IClassService } from '@/services/classService';
import { IRaceService } from '@/services/raceService';
import { INpcService } from '@/services/npcService';
import { IItemService } from '@/services/itemService';
import { ISpellService } from '@/services/spellService';
import { IQuestService } from '@/services/questService';
import { LoggerService } from '@/services/loggerService';

import { CampaignModeEnum } from '@/utils/enums';

export interface ICampaignOrchestration {
  createCampaign(name: string, themePrompt: string, language: string, accountId: string): Promise<CampaignDataReturn>;
}

export class CampaignOrchestration implements ICampaignOrchestration {
  private logger = new LoggerService('CampaignOrchestration');

  constructor(
    private campaignService: ICampaignService,
    private factionService: IFactionService,
    private worldService: IWorldService,
    private loreService: ILoreService,
    private classService: IClassService,
    private raceService: IRaceService,
    private npcService: INpcService,
    private itemService: IItemService,
    private spellService: ISpellService,
    private questService: IQuestService,
  ) { }

  /**
   * Main campaign creation entry point.
   *
   * Execution order (all within a single transaction):
   *   1. Create Campaign record (with user-provided theme_prompt and language)
   *   2. Create World → Map (using themePrompt & language)
   *   3. Create Factions (using themePrompt & language)
   *   4. Initialize CampaignGameState (defaults: narrative mode, party_level 1, short_rest_count 2)
   *   5. Create Areas → POIs (using themePrompt)
   *   6. Create Lore entries (using themePrompt)
   *   7. Create Classes with ClassResources (using themePrompt)
   *   8. Create Races (using themePrompt)
   *   9. Create NPCs (using themePrompt)
   *   10. Create Items (using themePrompt)
   *   11. Create Spells per Class → link via ClassService.linkSpellToClass (using themePrompt)
   *  12. Initialize CampaignGameState (starting POI from step 3)
   */
  async createCampaign(name: string, themePrompt: string, language: string, accountId: string): Promise<CampaignDataReturn> {
    this.logger.info(`Starting campaign creation for: "${name}"`);
    this.logger.info(`Theme Prompt: "${themePrompt}"`);
    this.logger.info(`Language: "${language}"`);

    const transaction = await sequelize.transaction();

    try {
      // --- Step 1: Create Campaign ---
      this.logger.step('1/4', 'Creating campaign DB record...');
      const campaign = await this.campaignService.create({ name, themePrompt, language }, accountId, transaction);
      this.logger.success(`Campaign record created with ID: ${campaign.id}`);

      // --- Step 2: Initialize CampaignGameState ---
      this.logger.step('2/4', 'Initializing Campaign Game State...');
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
      this.logger.step('3/4', 'Generating World & Map via AI...');
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
      this.logger.step('4/4', 'Generating Factions via AI (Brief list + Detail loop)...');
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

      await transaction.commit();
      this.logger.success(`Campaign creation complete! Transaction committed for campaign ID: ${campaign.id}`);

      return campaign;
    } catch (error) {
      await transaction.rollback();
      this.logger.error('Campaign creation failed. Transaction rolled back.', error);
      throw error;
    }
  }
}
