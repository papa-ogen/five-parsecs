import { z } from 'zod';

export const campaignSchema = z.object({
    name: z
        .string()
        .min(3, 'Campaign name must be at least 3 characters')
        .max(50, 'Campaign name must be less than 50 characters'),
    description: z
        .string()
        .max(500, 'Description must be less than 500 characters')
        .optional()
        .or(z.literal('')),
});

export type CampaignFormData = z.infer<typeof campaignSchema>;
