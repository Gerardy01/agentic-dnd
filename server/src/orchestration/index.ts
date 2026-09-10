import { AuthOrchestration } from '@/orchestration/authOrchestration';
import { AccountOrchestration } from '@/orchestration/accountOrchestration';
import { accountService, authService } from '@/services';
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
