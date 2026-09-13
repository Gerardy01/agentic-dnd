import { AuthOrchestration } from '@/orchestration/authOrchestration';
import { AccountOrchestration } from '@/orchestration/accountOrchestration';
import { CampaignOrchestration } from '@/orchestration/campaignOrchestration';
import { accountService, authService } from '@/services';
import {
  campaignService,
  factionService,
  worldService,
  loreService,
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
  loreService,
  classService,
  raceService,
  npcService,
  itemService,
  spellService,
  questService,
);
