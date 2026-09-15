import { Router } from 'express';
import { authenticate } from '@/utils/middleware';
import FactionController from '@/controller/factionController';

const factionRoutes = Router();

factionRoutes.get(
  '/campaign/:campaignId',
  authenticate,
  FactionController.getFactions,
);

factionRoutes.get(
  '/:campaignId',
  authenticate,
  FactionController.getFactions,
);

factionRoutes.get(
  '/',
  authenticate,
  FactionController.getFactions,
);

export default factionRoutes;
