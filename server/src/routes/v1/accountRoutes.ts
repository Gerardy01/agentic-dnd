import { Router } from 'express';
import { validateRequest, authenticate } from '@/utils/middleware';
import { CreateAccountSchema, UpdateUsernameSchema } from '@/schema/accountSchema';
import AccountController from '@/controller/accountController';

const accountRoutes = Router();

accountRoutes.post('/', validateRequest(CreateAccountSchema), AccountController.createAccount);
accountRoutes.get('/me', authenticate, AccountController.getAccount);
accountRoutes.patch(
  '/username',
  authenticate,
  validateRequest(UpdateUsernameSchema),
  AccountController.updateUsername
);

export default accountRoutes;
