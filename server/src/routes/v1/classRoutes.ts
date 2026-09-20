import { Router } from 'express';
import { authenticate } from '@/utils/middleware';
import ClassController from '@/controller/classController';

const classRoutes = Router();

classRoutes.get(
  '/campaign/:campaignId',
  authenticate,
  ClassController.getClasses,
);

classRoutes.get(
  '/:campaignId',
  authenticate,
  ClassController.getClasses,
);

classRoutes.get(
  '/',
  authenticate,
  ClassController.getClasses,
);

export default classRoutes;
