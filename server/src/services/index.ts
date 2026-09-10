import { AccountService } from '@/services/accountService';
import { AuthService } from '@/services/authService';
import { NotificationService } from '@/services/notificationService';

import {
  bcryptHashProvider,
  jwtProvider,
  validatorProvider,
  eventPublisherProvider,
  emailProvider,
} from '@/provider';

export const accountService = new AccountService(bcryptHashProvider, validatorProvider);
export const authService = new AuthService(jwtProvider, eventPublisherProvider);
export const notificationService = new NotificationService(emailProvider, eventPublisherProvider);
