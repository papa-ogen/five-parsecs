import type { ICampaign, ICampaignCharacter, IShipType, IMotivation, ICharacterClass, ICrewType, IBackground, ISpecies, ISpeciesAbility } from '@five-parsecs/parsec-api';

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

    crewTypes: {
        getAll: async (): Promise<ICrewType[]> => {
            const response = await fetch(`${API_BASE_URL}/crew-types`);
            if (!response.ok) {
                throw new Error('Failed to fetch crew types');
            }
            return response.json();
        },
    },

    backgrounds: {
        getAll: async (): Promise<IBackground[]> => {
            const response = await fetch(`${API_BASE_URL}/backgrounds`);
            if (!response.ok) {
                throw new Error('Failed to fetch backgrounds');
            }
            return response.json();
        },
    },

    species: {
        getAll: async (): Promise<ISpecies[]> => {
            const response = await fetch(`${API_BASE_URL}/species`);
            if (!response.ok) {
                throw new Error('Failed to fetch species');
            }
            return response.json();
        },
        getById: async (id: string): Promise<ISpecies> => {
            const response = await fetch(`${API_BASE_URL}/species/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch species');
            }
            return response.json();
        },
    },

    speciesAbilities: {
        getById: async (id: string): Promise<ISpeciesAbility> => {
            const response = await fetch(`${API_BASE_URL}/species-abilities/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch species abilities');
            }
            return response.json();
        },
    },

    campaignCharacters: {
        getAll: async (): Promise<ICampaignCharacter[]> => {
            const response = await fetch(`${API_BASE_URL}/campaign-characters`);
            if (!response.ok) {
                throw new Error('Failed to fetch campaign characters');
            }
            return response.json();
        },

        getById: async (id: string): Promise<ICampaignCharacter> => {
            const response = await fetch(`${API_BASE_URL}/campaign-characters/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch campaign character');
            }
            return response.json();
        },

        create: async (data: Partial<ICampaignCharacter>): Promise<ICampaignCharacter> => {
            const response = await fetch(`${API_BASE_URL}/campaign-characters`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to create campaign character');
            }
            return response.json();
        },

        update: async (id: string, data: Partial<ICampaignCharacter>): Promise<ICampaignCharacter> => {
            const response = await fetch(`${API_BASE_URL}/campaign-characters/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to update campaign character');
            }
            return response.json();
        },

        delete: async (id: string): Promise<void> => {
            const response = await fetch(`${API_BASE_URL}/campaign-characters/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete campaign character');
            }
        },
    },
};
