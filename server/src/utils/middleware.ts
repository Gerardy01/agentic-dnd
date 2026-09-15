import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { jwtProvider } from '@/provider';
import { AccessTokenBody } from '@/interfaces/IAuth';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const schemaErrors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          status: 'failed',
          message: 'bad request',
          userMessage: '',
          schemaErrors,
        });
      }

      return res.status(400).json({
        status: 'failed',
        message: 'Invalid request payload',
        userMessage: '',
      });
    }
  };
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query?.token && typeof req.query.token === 'string') {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({
      status: 'failed',
      message: 'Unauthorized: No token provided',
      userMessage: 'AUTH001',
    });
  }

  try {
    const decoded = jwtProvider.verify<AccessTokenBody>(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'failed',
      message: 'Unauthorized: Invalid or expired token',
      userMessage: 'AUTH002',
    });
  }
};
