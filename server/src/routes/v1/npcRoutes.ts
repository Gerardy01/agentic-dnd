import { Router } from 'express';
import { authenticate } from '@/utils/middleware';
import NpcController from '@/controller/npcController';

const npcRoutes = Router();

npcRoutes.get(
  '/campaign/:campaignId',
  authenticate,
  NpcController.getNpcs,
);

npcRoutes.get(
  '/:campaignId',
  authenticate,
  NpcController.getNpcs,
);

npcRoutes.get(
  '/',
  authenticate,
  NpcController.getNpcs,
);

export default npcRoutes;
