import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const LoginSchema = z.object({
  identifier: z.string().min(1, 'Identifier (username or email) is required'),
  password: z.string().min(1, 'Password is required'),
});

export const VerifyOtpSchema = z.object({
  code: z.number().int('OTP code must be an integer'),
  verificationToken: z.string().min(1, 'Verification token is required'),
});

export const GetOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
});
