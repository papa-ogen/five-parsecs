import type { ICampaign, ICampaignCharacter, ICampaignCrew, IShipType, IMotivation, ICharacterClass, ICrewType, IBackground, ISpecies, ISpeciesAbility, IGadget, IGear, IWeapon } from '@five-parsecs/parsec-api';

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

    campaignCrews: {
        getAll: async (): Promise<ICampaignCrew[]> => {
            const response = await fetch(`${API_BASE_URL}/campaign-crews`);
            if (!response.ok) {
                throw new Error('Failed to fetch campaign crews');
            }
            return response.json();
        },
        getById: async (id: string): Promise<ICampaignCrew> => {
            const response = await fetch(`${API_BASE_URL}/campaign-crews/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch campaign crew');
            }
            return response.json();
        },
        update: async (id: string, data: Partial<ICampaignCrew>): Promise<ICampaignCrew> => {
            const response = await fetch(`${API_BASE_URL}/campaign-crews/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to update campaign crew');
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

    items: {
        getAllGear: async (): Promise<IGear[]> => {
            const response = await fetch(`${API_BASE_URL}/items/gear`);
            if (!response.ok) {
                throw new Error('Failed to fetch gear');
            }
            return response.json();
        },

        getGearById: async (id: string): Promise<IGear> => {
            const response = await fetch(`${API_BASE_URL}/items/gear/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch gear');
            }
            return response.json();
        },

        getAllGadgets: async (): Promise<IGadget[]> => {
            const response = await fetch(`${API_BASE_URL}/items/gadgets`);
            if (!response.ok) {
                throw new Error('Failed to fetch gadgets');
            }
            return response.json();
        },

        getGadgetById: async (id: string): Promise<IGadget> => {
            const response = await fetch(`${API_BASE_URL}/items/gadgets/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch gadget');
            }
            return response.json();
        },

        getAllWeapons: async (type?: 'military' | 'lowTech' | 'highTech'): Promise<IWeapon[]> => {
            const url = type 
                ? `${API_BASE_URL}/items/weapons?type=${type}`
                : `${API_BASE_URL}/items/weapons`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch weapons');
            }
            return response.json();
        },

        getWeaponById: async (id: string): Promise<IWeapon> => {
            const response = await fetch(`${API_BASE_URL}/items/weapons/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch weapon');
            }
            return response.json();
        },
    },
};
