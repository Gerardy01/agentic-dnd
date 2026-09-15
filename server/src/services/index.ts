import { AccountService } from '@/services/accountService';
import { AuthService } from '@/services/authService';
import { NotificationService } from '@/services/notificationService';
import { CampaignService } from '@/services/campaignService';
import { FactionService } from '@/services/factionService';
import { WorldService } from '@/services/worldService';
import { ClassService } from '@/services/classService';
import { RaceService } from '@/services/raceService';
import { NpcService } from '@/services/npcService';
import { ItemService } from '@/services/itemService';
import { SpellService } from '@/services/spellService';
import { QuestService } from '@/services/questService';

import {
  bcryptHashProvider,
  jwtProvider,
  validatorProvider,
  eventPublisherProvider,
  emailProvider,
  aiProvider,
  cryptProvider,
} from '@/provider';

export const accountService = new AccountService(bcryptHashProvider, validatorProvider);
export const authService = new AuthService(jwtProvider, eventPublisherProvider);
export const notificationService = new NotificationService(emailProvider, eventPublisherProvider);

export const campaignService = new CampaignService(cryptProvider);
export const factionService = new FactionService(aiProvider);
export const worldService = new WorldService(aiProvider);
export const classService = new ClassService();
export const raceService = new RaceService();
export const npcService = new NpcService();
export const itemService = new ItemService();
export const spellService = new SpellService();
export const questService = new QuestService();

export { LoggerService, ILoggerService } from '@/services/loggerService';

