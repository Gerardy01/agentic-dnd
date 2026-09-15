import { Router } from 'express';
import { authenticate, validateRequest } from '@/utils/middleware';
import { CreateCampaignSchema } from '@/schema/campaignSchema';
import CampaignController from '@/controller/campaignController';

const campaignRoutes = Router();

campaignRoutes.post(
  '/',
  authenticate,
  validateRequest(CreateCampaignSchema),
  CampaignController.createCampaign,
);

campaignRoutes.get(
  '/',
  authenticate,
  CampaignController.getCampaigns,
);

campaignRoutes.get(
  '/progress/:processId',
  authenticate,
  CampaignController.getCampaignProgress,
);

export default campaignRoutes;
