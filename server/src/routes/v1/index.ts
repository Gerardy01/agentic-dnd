import { Router } from 'express';
import authRoutes from '@/routes/v1/authRoutes';
import accountRoutes from '@/routes/v1/accountRoutes';
import campaignRoutes from '@/routes/v1/campaignRoutes';
import factionRoutes from '@/routes/v1/factionRoutes';
import worldRoutes from '@/routes/v1/worldRoutes';
import classRoutes from '@/routes/v1/classRoutes';

const v1Api = Router();

v1Api.use('/', authRoutes);
v1Api.use('/account', accountRoutes);
v1Api.use('/campaign', campaignRoutes);
v1Api.use('/faction', factionRoutes);
v1Api.use('/world', worldRoutes);
v1Api.use('/class', classRoutes);

export default v1Api;
