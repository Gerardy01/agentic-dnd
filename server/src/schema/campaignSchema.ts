import { z } from 'zod';

export const CreateCampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required').max(255, 'Campaign name is too long'),
  themePrompt: z.string().min(1, 'Theme prompt is required'),
  language: z.string().min(1, 'Language cannot be empty').max(50, 'Language is too long').optional().default('en'),
});

