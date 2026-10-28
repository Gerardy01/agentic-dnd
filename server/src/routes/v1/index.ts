import { Router } from 'express';
import authRoutes from '@/routes/v1/authRoutes';
import accountRoutes from '@/routes/v1/accountRoutes';
import campaignRoutes from '@/routes/v1/campaignRoutes';
import factionRoutes from '@/routes/v1/factionRoutes';
import worldRoutes from '@/routes/v1/worldRoutes';
import classRoutes from '@/routes/v1/classRoutes';
import raceRoutes from '@/routes/v1/raceRoutes';
import npcRoutes from '@/routes/v1/npcRoutes';
import itemRoutes from '@/routes/v1/itemRoutes';
import spellRoutes from '@/routes/v1/spellRoutes';

const v1Api = Router();

v1Api.use('/', authRoutes);
v1Api.use('/account', accountRoutes);
v1Api.use('/campaign', campaignRoutes);
v1Api.use('/faction', factionRoutes);
v1Api.use('/world', worldRoutes);
v1Api.use('/class', classRoutes);
v1Api.use('/race', raceRoutes);
v1Api.use('/npc', npcRoutes);
v1Api.use('/item', itemRoutes);
v1Api.use('/spell', spellRoutes);

export default v1Api;
