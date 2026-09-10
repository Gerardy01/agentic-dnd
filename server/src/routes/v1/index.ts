import { Router } from 'express';
import authRoutes from '@/routes/v1/authRoutes';
import accountRoutes from '@/routes/v1/accountRoutes';

const v1Api = Router();

v1Api.use('/', authRoutes);
v1Api.use('/account', accountRoutes);

export default v1Api;

