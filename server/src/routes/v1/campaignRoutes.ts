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

export default campaignRoutes;
