import { z } from 'zod';

export const CreateAccountSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const UpdateUsernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Adventurer name must be at least 3 characters')
    .max(50, 'Adventurer name cannot exceed 50 characters'),
});
