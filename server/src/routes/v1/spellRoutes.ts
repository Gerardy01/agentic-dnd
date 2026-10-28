import { Router } from 'express';
import { authenticate } from '@/utils/middleware';
import SpellController from '@/controller/spellController';

const spellRoutes = Router();

spellRoutes.get(
  '/:campaignId',
  authenticate,
  SpellController.getSpells,
);

export default spellRoutes;
