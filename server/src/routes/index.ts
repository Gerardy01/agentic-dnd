import { Router } from 'express';
import v1Api from '@/routes/v1';

const rootRouter = Router();

rootRouter.use('/v1', v1Api);

export default rootRouter;
