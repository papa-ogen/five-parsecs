import { z } from 'zod';

export const CREW_SIZE_OPTIONS = [4, 5, 6] as const;
export type CrewSizeOption = (typeof CREW_SIZE_OPTIONS)[number];

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
    crewCompositionMethod: z.string().min(1, 'Select a crew composition method'),
    crewSize: z.number().min(4).max(6),
});

export type CampaignFormData = z.infer<typeof campaignSchema>;
