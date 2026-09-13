import { Router } from 'express';
import authRoutes from '@/routes/v1/authRoutes';
import accountRoutes from '@/routes/v1/accountRoutes';
import campaignRoutes from '@/routes/v1/campaignRoutes';

const v1Api = Router();

v1Api.use('/', authRoutes);
v1Api.use('/account', accountRoutes);
v1Api.use('/campaign', campaignRoutes);

export default v1Api;
