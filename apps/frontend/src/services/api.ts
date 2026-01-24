import type { ICampaign, IShipType, IOrigin, IMotivation, ICharacterClass, ISpecialCircumstance } from '@five-parsecs/parsec-api';

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

        update: async (id: string, data: Partial<ICampaign>): Promise<ICampaign> => {
            const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to update campaign');
            }
            return response.json();
        },
    },

    shipTypes: {
        getAll: async (): Promise<IShipType[]> => {
            const response = await fetch(`${API_BASE_URL}/ship-types`);
            if (!response.ok) {
                throw new Error('Failed to fetch ship types');
            }
            return response.json();
        },
    },

    origins: {
        getAll: async (): Promise<IOrigin[]> => {
            const response = await fetch(`${API_BASE_URL}/origins`);
            if (!response.ok) {
                throw new Error('Failed to fetch origins');
            }
            return response.json();
        },
    },

    motivations: {
        getAll: async (): Promise<IMotivation[]> => {
            const response = await fetch(`${API_BASE_URL}/motivations`);
            if (!response.ok) {
                throw new Error('Failed to fetch motivations');
            }
            return response.json();
        },
    },

    characterClasses: {
        getAll: async (): Promise<ICharacterClass[]> => {
            const response = await fetch(`${API_BASE_URL}/character-classes`);
            if (!response.ok) {
                throw new Error('Failed to fetch character classes');
            }
            return response.json();
        },
    },

    specialCircumstances: {
        getAll: async (): Promise<ISpecialCircumstance[]> => {
            const response = await fetch(`${API_BASE_URL}/special-circumstances`);
            if (!response.ok) {
                throw new Error('Failed to fetch special circumstances');
            }
            return response.json();
        },
    },
};
