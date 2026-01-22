import type { ICampaign } from '@five-parsecs/parsec-api';

const API_BASE_URL = 'http://localhost:9999';

export const api = {
    campaigns: {
        getAll: async (): Promise<ICampaign[]> => {
            const response = await fetch(`${API_BASE_URL}/campaigns`);
            if (!response.ok) {
                throw new Error('Failed to fetch campaigns');
            }
            return response.json();
        },

        getById: async (id: string): Promise<ICampaign> => {
            const response = await fetch(`${API_BASE_URL}/campaigns/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch campaign');
            }
            return response.json();
        },

        create: async (data: Partial<ICampaign>): Promise<ICampaign> => {
            const response = await fetch(`${API_BASE_URL}/campaigns`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to create campaign');
            }
            return response.json();
        },
    },
};
