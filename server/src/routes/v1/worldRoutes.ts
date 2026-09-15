import { Router } from 'express';
import { authenticate } from '@/utils/middleware';
import WorldController from '@/controller/worldController';

const worldRoutes = Router();

worldRoutes.get(
  '/area/campaign/:campaignId',
  authenticate,
  WorldController.getAreas,
);

worldRoutes.get(
  '/area/:campaignId',
  authenticate,
  WorldController.getAreas,
);

worldRoutes.get(
  '/area',
  authenticate,
  WorldController.getAreas,
);

worldRoutes.get(
  '/areas/:campaignId',
  authenticate,
  WorldController.getAreas,
);

worldRoutes.get(
  '/areas',
  authenticate,
  WorldController.getAreas,
);

export default worldRoutes;
