import { z } from 'zod';

export const CreateCampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required').max(255, 'Campaign name is too long'),
  themePrompt: z.string().min(1, 'Theme prompt is required'),
  language: z.string().min(1, 'Language cannot be empty').max(50, 'Language is too long').optional().default('en'),
});

export const ContinueCampaignSchema = z.object({
  successParameter: z.object({
    world: z.boolean(),
    factions: z.boolean(),
    areas: z.boolean(),
    pois: z.boolean(),
    classes: z.boolean(),
    races: z.boolean(),
    npcs: z.boolean(),
    items: z.boolean(),
    spells: z.boolean(),
  }),
});

