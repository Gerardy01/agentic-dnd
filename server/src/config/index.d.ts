import { AccessTokenBody } from '@/interfaces/IAuth';

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenBody;
    }
  }
}

export {};
