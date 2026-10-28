import { Router } from 'express';
import { authenticate, validateRequest } from '@/utils/middleware';
import { CreateCampaignSchema, ContinueCampaignSchema } from '@/schema/campaignSchema';
import CampaignController from '@/controller/campaignController';

const campaignRoutes = Router();

campaignRoutes.post(
  '/',
  authenticate,
  validateRequest(CreateCampaignSchema),
  CampaignController.createCampaign,
);

campaignRoutes.post(
  '/:id/continue',
  authenticate,
  validateRequest(ContinueCampaignSchema),
  CampaignController.continueCampaign,
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

campaignRoutes.get(
  '/:id/counts',
  authenticate,
  CampaignController.getCampaignCounts,
);

campaignRoutes.get(
  '/:id',
  authenticate,
  CampaignController.getCampaignById,
);

campaignRoutes.delete(
  '/:id',
  authenticate,
  CampaignController.deleteCampaign,
);

export default campaignRoutes;
