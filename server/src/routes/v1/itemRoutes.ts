import { Router } from 'express';
import { authenticate } from '@/utils/middleware';
import ItemController from '@/controller/itemController';

const itemRoutes = Router();

itemRoutes.get(
  '/campaign/:campaignId',
  authenticate,
  ItemController.getItems,
);

itemRoutes.get(
  '/:campaignId',
  authenticate,
  ItemController.getItems,
);

itemRoutes.get(
  '/',
  authenticate,
  ItemController.getItems,
);

export default itemRoutes;
