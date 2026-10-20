import { AuthOrchestration } from '@/orchestration/authOrchestration';
import { AccountOrchestration } from '@/orchestration/accountOrchestration';
import { CampaignOrchestration } from '@/orchestration/campaignOrchestration';
import { FactionOrchestration } from '@/orchestration/factionOrchestration';
import { WorldOrchestration } from '@/orchestration/worldOrchestration';
import { ClassOrchestration } from '@/orchestration/classOrchestration';
import { RaceOrchestration } from '@/orchestration/raceOrchestration';
import { NpcOrchestration } from '@/orchestration/npcOrchestration';
import { ItemOrchestration } from '@/orchestration/itemOrchestration';
import { accountService, authService } from '@/services';
import {
  campaignService,
  factionService,
  worldService,
  classService,
  raceService,
  npcService,
  itemService,
  spellService,
  questService,
} from '@/services';
import { bcryptHashProvider } from '@/provider';

export const authOrchestration = new AuthOrchestration(
  accountService,
  authService,
  bcryptHashProvider
);

export const accountOrchestration = new AccountOrchestration(
  accountService,
  authService
);

export const campaignOrchestration = new CampaignOrchestration(
  campaignService,
  factionService,
  worldService,
  classService,
  raceService,
  npcService,
  itemService,
  spellService,
  questService
);

export const factionOrchestration = new FactionOrchestration(
  factionService,
  campaignService
);

export const worldOrchestration = new WorldOrchestration(
  worldService,
  campaignService
);

export const classOrchestration = new ClassOrchestration(
  classService,
  campaignService
);

export const raceOrchestration = new RaceOrchestration(
  raceService,
  campaignService
);

export const npcOrchestration = new NpcOrchestration(
  npcService,
  campaignService
);

export const itemOrchestration = new ItemOrchestration(
  itemService,
  campaignService
);


