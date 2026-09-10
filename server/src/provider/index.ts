import { BcryptHashProvider } from '@/provider/hashProvider';
import { JsonWebTokenProvider } from '@/provider/jwtProvider';
import { ValidatorProvider } from '@/provider/validatorProvider';
import { EventEmitterPublisherProvider } from '@/provider/eventPublisherProvider';
import { NodemailerEmailProvider } from '@/provider/emailProvider';

export const bcryptHashProvider = new BcryptHashProvider();
export const jwtProvider = new JsonWebTokenProvider();
export const validatorProvider = new ValidatorProvider();
export const eventPublisherProvider = new EventEmitterPublisherProvider();
export const emailProvider = new NodemailerEmailProvider();
