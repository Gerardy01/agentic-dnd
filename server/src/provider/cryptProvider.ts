import crypto from 'crypto';

export interface ICryptProvider {
  randomUUID(): string;
  randomBytes(size: number): Buffer;
}

export class NodeCryptoProvider implements ICryptProvider {
  randomUUID(): string {
    return crypto.randomUUID();
  }

  randomBytes(size: number): Buffer {
    return crypto.randomBytes(size);
  }
}
