import { Router } from 'express';
import { authenticate } from '@/utils/middleware';
import RaceController from '@/controller/raceController';

const raceRoutes = Router();

raceRoutes.get(
  '/campaign/:campaignId',
  authenticate,
  RaceController.getRaces,
);

raceRoutes.get(
  '/:campaignId',
  authenticate,
  RaceController.getRaces,
);

raceRoutes.get(
  '/',
  authenticate,
  RaceController.getRaces,
);

export default raceRoutes;
