import jwt from 'jsonwebtoken';

export interface IJwtProvider {
  sign(payload: object, expiresIn?: string | number, secret?: string): string;
  verify<T extends object>(token: string, secret?: string): T;
  decode<T extends object>(token: string): T | null;
}

export class JsonWebTokenProvider implements IJwtProvider {
  private defaultSecret: string;

  constructor() {
    this.defaultSecret = process.env.JWT_SECRET || 'agentic-dnd-secret-key-12345';
  }

  sign(payload: object, expiresIn: string | number = '15m', secret?: string): string {
    return jwt.sign(payload, secret || this.defaultSecret, {
      expiresIn: expiresIn as any,
    });
  }

  verify<T extends object>(token: string, secret?: string): T {
    return jwt.verify(token, secret || this.defaultSecret) as T;
  }

  decode<T extends object>(token: string): T | null {
    return jwt.decode(token) as T | null;
  }
}
