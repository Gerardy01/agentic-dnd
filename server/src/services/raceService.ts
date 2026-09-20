import { z } from 'zod';
import { Transaction } from 'sequelize';
import { Race } from '@/models';
import { IAIProvider } from '@/provider/aiProvider';
import { loadPrompt } from '@/utils/promptLoader';
import { LoggerService } from '@/services/loggerService';
import {
  CreateRaceDTO,
  GenerateRacesDTO,
  RaceDataReturn,
  RaceBriefListAIResponse,
  RaceDetailAIResponse,
} from '@/interfaces/IRace';

// ==========================================
// Zod schemas for AI response validation
// ==========================================

const RaceStubAISchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(300),
});

const RaceBriefListAISchema = z.object({
  races: z.array(RaceStubAISchema).min(1),
});

const RaceTraitItemAISchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1250),
  type: z.enum(['passive', 'active']),
});

const RaceDetailAISchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1500),
  speed: z.number().int().positive(),
  languages: z.array(z.string().min(1)).default(['Common']),
  traits: z.array(RaceTraitItemAISchema).default([]),
});

// ==========================================
// Interface
// ==========================================

export interface IRaceService {
  getRaceBriefPrompt(): string;
  getRaceDetailPrompt(): string;
  generateRaces(data: GenerateRacesDTO, campaignId: number, transaction?: Transaction): Promise<RaceDataReturn[]>;
  create(data: CreateRaceDTO, campaignId: number, transaction?: Transaction): Promise<RaceDataReturn>;
  createBulk(data: CreateRaceDTO[], campaignId: number, transaction?: Transaction): Promise<RaceDataReturn[]>;
}

// ==========================================
// Implementation
// ==========================================

export class RaceService implements IRaceService {
  private logger = new LoggerService('RaceService');

  constructor(private aiProvider: IAIProvider) {}

  // ------------------------------------------
  // Prompt methods
  // ------------------------------------------

  getRaceBriefPrompt(): string {
    return loadPrompt('GENERATE_RACE_BRIEF.md');
  }

  getRaceDetailPrompt(): string {
    return loadPrompt('GENERATE_RACE_DETAILED.md');
  }

  // ------------------------------------------
  // AI-powered generation methods
  // ------------------------------------------

  async generateRaces(
    data: GenerateRacesDTO,
    campaignId: number,
    transaction?: Transaction
  ): Promise<RaceDataReturn[]> {
    const briefSystemPrompt = this.getRaceBriefPrompt();

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
      `Theme: ${data.themePrompt}`,
      `Campaign language: ${data.language}`,
      '',
      'World context:',
      worldContext,
    ].join('\n');

    this.logger.info('Requesting brief race list from AI...');
    const briefRaw = await this.aiProvider.chatJSON<RaceBriefListAIResponse>([
      { role: 'system', content: briefSystemPrompt },
      { role: 'user', content: briefUserMessage },
    ]);

    const briefParsed = RaceBriefListAISchema.parse(briefRaw);
    this.logger.info(
      `Generated ${briefParsed.races.length} brief races: ${briefParsed.races.map((r) => `"${r.name}"`).join(', ')}`
    );

    const racesToCreate: CreateRaceDTO[] = [];

    for (let i = 0; i < briefParsed.races.length; i++) {
      const stub = briefParsed.races[i];
      this.logger.info(`[${i + 1}/${briefParsed.races.length}] Generating race "${stub.name}"...`);

      // Race Detail Prompt (name, description, speed, languages, traits)
      const detailSystemPrompt = this.getRaceDetailPrompt();
      const otherRacesBrief = JSON.stringify(
        briefParsed.races.filter((r) => r.name !== stub.name),
        null,
        2
      );

      const detailUserMessage = [
        `Theme: ${data.themePrompt}`,
        `Campaign language: ${data.language}`,
        '',
        'World context:',
        worldContext,
        '',
        'Other races brief (for context and variety):',
        otherRacesBrief,
        '',
        'Target race brief (you MUST expand this one):',
        JSON.stringify({ name: stub.name, description: stub.description }, null, 2),
      ].join('\n');

      const detailRaw = await this.aiProvider.chatJSON<RaceDetailAIResponse>([
        { role: 'system', content: detailSystemPrompt },
        { role: 'user', content: detailUserMessage },
      ]);

      const detailParsed = RaceDetailAISchema.parse(detailRaw);

      racesToCreate.push({
        name: detailParsed.name,
        description: detailParsed.description,
        speed: detailParsed.speed,
        languages: detailParsed.languages,
        traits: detailParsed.traits,
      });
    }

    const results = await this.createBulk(racesToCreate, campaignId, transaction);
    this.logger.success(`Successfully saved ${results.length} races in bulk`);

    return results;
  }

  // ------------------------------------------
  // Direct DB persistence methods
  // ------------------------------------------

  async create(data: CreateRaceDTO, campaignId: number, transaction?: Transaction): Promise<RaceDataReturn> {
    const race = await Race.create(
      {
        campaign_id: campaignId,
        name: data.name,
        description: data.description ?? null,
        speed: data.speed ?? 30,
        languages: data.languages ?? [],
        traits: data.traits ?? [],
      },
      { transaction: transaction ?? undefined }
    );

    return this.toReturn(race);
  }

  async createBulk(data: CreateRaceDTO[], campaignId: number, transaction?: Transaction): Promise<RaceDataReturn[]> {
    if (data.length === 0) return [];

    const races = await Race.bulkCreate(
      data.map(d => ({
        campaign_id: campaignId,
        name: d.name,
        description: d.description ?? null,
        speed: d.speed ?? 30,
        languages: d.languages ?? [],
        traits: d.traits ?? [],
      })),
      { transaction: transaction ?? undefined, returning: true }
    );

    return races.map(r => this.toReturn(r));
  }

  private toReturn(race: any): RaceDataReturn {
    return {
      id: race.id,
      campaignId: race.campaign_id,
      name: race.name,
      description: race.description,
      speed: race.speed,
      languages: race.languages,
      traits: race.traits,
      createdAt: race.createdAt ?? race.created_at,
    };
  }
}
