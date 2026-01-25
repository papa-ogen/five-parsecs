import { join } from 'path';

import {
    ISpecies,
    IBackground,
    ICharacterClass,
    ICrewType,
    ICampaign,
    ICampaignCrew,
    ICampaignCharacter,
    IShipType,
    IMotivation,
    ISpeciesAbility,
} from '@five-parsecs/parsec-api';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { JSONFilePreset } from 'lowdb/node';

interface DatabaseSchema {
    species: ISpecies[];
    speciesAbilities: ISpeciesAbility[];
    backgrounds: IBackground[];
    characterClasses: ICharacterClass[];
    crewTypes: ICrewType[];
    motivations: IMotivation[];
    shipTypes: IShipType[];
    campaigns: ICampaign[];
    campaignCrews: ICampaignCrew[];
    campaignCharacters: ICampaignCharacter[];
}

@Injectable()
export class DatabaseService implements OnModuleInit {
    private db: Awaited<ReturnType<typeof JSONFilePreset<DatabaseSchema>>>;

    async onModuleInit() {
        const dbPath = join(process.cwd(), 'apps', 'api', 'src', 'database', 'db.json');

        // Initialize the database with default data
        const defaultData: DatabaseSchema = {
            species: [],
            speciesAbilities: [],
            backgrounds: [],
            characterClasses: [],
            crewTypes: [],
            motivations: [],
            shipTypes: [],
            campaigns: [],
            campaignCrews: [],
            campaignCharacters: [],
        };

        this.db = await JSONFilePreset<DatabaseSchema>(dbPath, defaultData);
    }

    // Species methods
    async getAllSpecies(): Promise<ISpecies[]> {
        await this.db.read();
        return this.db.data.species;
    }

    async getSpeciesById(id: string): Promise<ISpecies | undefined> {
        await this.db.read();
        return this.db.data.species.find((s) => s.id === id);
    }

    // Species Abilities
    async getAllSpeciesAbilities(): Promise<ISpeciesAbility[]> {
        await this.db.read();
        return this.db.data.speciesAbilities;
    }

    async getSpeciesAbilityById(id: string): Promise<ISpeciesAbility | undefined> {
        await this.db.read();
        return this.db.data.speciesAbilities.find((sa) => sa.id === id);
    }

    async addSpecies(species: ISpecies): Promise<ISpecies> {
        await this.db.read();
        this.db.data.species.push(species);
        await this.db.write();
        return species;
    }

    // Background methods
    async getAllBackgrounds(): Promise<IBackground[]> {
        await this.db.read();
        return this.db.data.backgrounds;
    }

    async getBackgroundById(id: string): Promise<IBackground | undefined> {
        await this.db.read();
        return this.db.data.backgrounds.find((b) => b.id === id);
    }

    async addBackground(background: IBackground): Promise<IBackground> {
        await this.db.read();
        this.db.data.backgrounds.push(background);
        await this.db.write();
        return background;
    }

    // Class methods
    async getAllCharacterClasses(): Promise<ICharacterClass[]> {
        await this.db.read();
        return this.db.data.characterClasses;
    }

    async getCharacterClassById(id: string): Promise<ICharacterClass | undefined> {
        await this.db.read();
        return this.db.data.characterClasses.find((c) => c.id === id);
    }

    async addCharacterClass(characterClass: ICharacterClass): Promise<ICharacterClass> {
        await this.db.read();
        this.db.data.characterClasses.push(characterClass);
        await this.db.write();
        return characterClass;
    }

    // Crew Type methods
    async getAllCrewTypes(): Promise<ICrewType[]> {
        await this.db.read();
        return this.db.data.crewTypes;
    }

    async getCrewTypeById(id: string): Promise<ICrewType | undefined> {
        await this.db.read();
        return this.db.data.crewTypes.find((c) => c.id === id);
    }

    async addCrewType(crewType: ICrewType): Promise<ICrewType> {
        await this.db.read();
        this.db.data.crewTypes.push(crewType);
        await this.db.write();
        return crewType;
    }

    // Campaign methods
    async getAllCampaigns(): Promise<ICampaign[]> {
        await this.db.read();
        return this.db.data.campaigns;
    }

    async getCampaignById(id: string): Promise<ICampaign | undefined> {
        await this.db.read();
        return this.db.data.campaigns.find((c) => c.id === id);
    }

    async addCampaign(campaign: ICampaign): Promise<ICampaign> {
        await this.db.read();

        // Create a campaign crew automatically
        const crewId = `crew-${Date.now()}`;
        const now = new Date().toISOString();
        const campaignCrew: ICampaignCrew = {
            id: crewId,
            campaignId: campaign.id,
            name: `${campaign.name} Crew`,
            description: `Crew for ${campaign.name}`,
            characterIds: [],
            reputation: 0,
            patrons: 0,
            rivals: 0,
            questRumors: 0,
            rumors: 0,
            credits: 0,
            inBattle: false,
            gear: [],
            weapons: [],
            gadgets: 1,
            gears: 1,
            lowTechWeapons: 3,
            militaryWeapons: 0,
            highTechWeapons: 0,
            createdAt: now,
            updatedAt: now,
        };

        // Add the crew to the database
        this.db.data.campaignCrews.push(campaignCrew);

        // Link the crew to the campaign
        campaign.crewId = crewId;

        // Add the campaign
        this.db.data.campaigns.push(campaign);
        await this.db.write();
        return campaign;
    }

    async updateCampaign(id: string, updates: Partial<ICampaign>): Promise<ICampaign | undefined> {
        await this.db.read();
        const campaign = this.db.data.campaigns.find((c) => c.id === id);
        if (campaign) {
            Object.assign(campaign, updates);
            await this.db.write();
        }
        return campaign;
    }

    async deleteCampaign(id: string): Promise<boolean> {
        await this.db.read();
        const index = this.db.data.campaigns.findIndex((c) => c.id === id);
        if (index !== -1) {
            this.db.data.campaigns.splice(index, 1);
            await this.db.write();
            return true;
        }
        return false;
    }

    // Campaign Crew methods
    async getAllCampaignCrews(): Promise<ICampaignCrew[]> {
        await this.db.read();
        return this.db.data.campaignCrews;
    }

    async getCampaignCrewById(id: string): Promise<ICampaignCrew | undefined> {
        await this.db.read();
        return this.db.data.campaignCrews.find((c) => c.id === id);
    }

    async addCampaignCrew(crew: ICampaignCrew): Promise<ICampaignCrew> {
        await this.db.read();
        this.db.data.campaignCrews.push(crew);
        await this.db.write();
        return crew;
    }

    async updateCampaignCrew(id: string, updates: Partial<ICampaignCrew>): Promise<ICampaignCrew | undefined> {
        await this.db.read();
        const crew = this.db.data.campaignCrews.find((c) => c.id === id);
        if (crew) {
            Object.assign(crew, updates, { updatedAt: new Date().toISOString() });
            await this.db.write();
        }
        return crew;
    }

    // Campaign Character methods
    getCampaignCharacters(): ICampaignCharacter[] {
        return this.db.data.campaignCharacters;
    }

    getCampaignCharacterById(id: string): ICampaignCharacter | undefined {
        return this.db.data.campaignCharacters.find((c) => c.id === id);
    }

    createCampaignCharacter(data: Partial<ICampaignCharacter>): ICampaignCharacter {
        // Get species abilities to determine base stats
        const species = this.db.data.species.find(s => s.id === data.speciesId);
        const speciesAbilities = species?.abilitiesId
            ? this.db.data.speciesAbilities.find(sa => sa.id === species.abilitiesId)
            : null;

        // Initialize base stats from species abilities
        let reactions = speciesAbilities?.reactions || 1;
        let speed = speciesAbilities?.speed || 4;
        let combat = speciesAbilities?.combat || 0;
        let toughness = speciesAbilities?.toughness || 3;
        let savvy = speciesAbilities?.savvy || 0;
        let xp = 0;

        // Get background, motivation, and character class for effects
        const background = data.backgroundId
            ? this.db.data.backgrounds.find(b => b.id === data.backgroundId)
            : null;
        const motivation = data.motivationId
            ? this.db.data.motivations.find(m => m.id === data.motivationId)
            : null;
        const characterClass = data.characterClassId
            ? this.db.data.characterClasses.find(c => c.id === data.characterClassId)
            : null;

        // Apply effects from background, motivation, and class
        const allEffects = [
            ...(background?.effect || []),
            ...(motivation?.effect || []),
            ...(characterClass?.effect || []),
        ];

        for (const effect of allEffects) {
            switch (effect.abilityId) {
                case 'reactions':
                    reactions += effect.amount;
                    break;
                case 'speed':
                    speed += effect.amount;
                    break;
                case 'combat':
                    combat += effect.amount;
                    break;
                case 'toughness':
                    toughness += effect.amount;
                    break;
                case 'savvy':
                    savvy += effect.amount;
                    break;
                case 'xp':
                    xp += effect.amount;
                    break;
            }
        }

        // Create the character with calculated stats
        const character: ICampaignCharacter = {
            id: Date.now().toString(),
            crewId: data.crewId || '',
            name: data.name || '',
            speciesId: data.speciesId || '',
            backgroundId: data.backgroundId || '',
            motivationId: data.motivationId || '',
            characterClassId: data.characterClassId || '',
            talentIds: data.talentIds || [],
            isLeader: data.isLeader || false,
            reactions,
            speed,
            combat,
            toughness,
            savvy,
            xp,
            level: data.level || 1,
            isInjured: data.isInjured || false,
            injuries: data.injuries || [],
            weapons: data.weapons || [],
            armor: data.armor || [],
            gear: data.gear || [],
            isActive: data.isActive !== undefined ? data.isActive : true,
            isDead: data.isDead || false,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Add character to the database
        this.db.data.campaignCharacters.push(character);

        // Update the crew with resources and starting rolls
        if (character.crewId) {
            const crew = this.db.data.campaignCrews.find((c) => c.id === character.crewId);
            if (crew) {
                // Add character ID to crew
                crew.characterIds.push(character.id);

                // Apply resources from background, motivation, and class
                const allResources = [
                    ...(background?.resources || []),
                    ...(motivation?.resources || []),
                    ...(characterClass?.resources || []),
                ];

                for (const resource of allResources) {
                    const amount = typeof resource.amount === 'number'
                        ? resource.amount
                        : this.rollDice(resource.amount.numDice, resource.amount.diceSize, resource.amount.modifier);

                    switch (resource.resourceType) {
                        case 'credits':
                            crew.credits += amount;
                            break;
                        case 'reputation':
                            crew.reputation += amount;
                            break;
                        case 'patrons':
                            crew.patrons += amount;
                            break;
                        case 'rivals':
                            crew.rivals += amount;
                            break;
                        case 'questRumors':
                            crew.questRumors += amount;
                            break;
                        case 'rumor':
                            crew.rumors += amount;
                            break;
                        case 'storyPoints': {
                            // Story points go to the campaign, not the crew
                            const campaign = this.db.data.campaigns.find(c => c.id === crew.campaignId);
                            if (campaign) {
                                campaign.storyPoints += amount;
                            }
                            break;
                        }
                    }
                }

                // Track starting rolls (items to be rolled for later)
                const allStartingRolls = [
                    ...(background?.startingRolls || []),
                    ...(motivation?.startingRolls || []),
                    ...(characterClass?.startingRolls || []),
                ];

                for (const item of allStartingRolls) {
                    switch (item.itemType) {
                        case 'weapon':
                            if (item.subtype === 'lowTech') {
                                crew.lowTechWeapons += item.amount;
                            } else if (item.subtype === 'military') {
                                crew.militaryWeapons += item.amount;
                            } else if (item.subtype === 'highTech') {
                                crew.highTechWeapons += item.amount;
                            }
                            break;
                        case 'gear':
                            crew.gears += item.amount;
                            break;
                        case 'gadget':
                            crew.gadgets += item.amount;
                            break;
                    }
                }

                crew.updatedAt = new Date().toISOString();
            }
        }

        this.db.write();
        return character;
    }

    // Helper method to roll dice
    private rollDice(numDice: number, diceSize: number, modifier: number = 0): number {
        let total = modifier;
        for (let i = 0; i < numDice; i++) {
            total += Math.floor(Math.random() * diceSize) + 1;
        }
        return total;
    }

    updateCampaignCharacter(id: string, data: Partial<ICampaignCharacter>): ICampaignCharacter {
        const index = this.db.data.campaignCharacters.findIndex((c) => c.id === id);
        if (index === -1) {
            throw new Error(`Campaign character with id ${id} not found`);
        }
        const updated = {
            ...this.db.data.campaignCharacters[index],
            ...data,
            id,
            updatedAt: new Date().toISOString(),
        };
        this.db.data.campaignCharacters[index] = updated;
        this.db.write();
        return updated;
    }

    deleteCampaignCharacter(id: string): void {
        const index = this.db.data.campaignCharacters.findIndex((c) => c.id === id);
        if (index === -1) {
            throw new Error(`Campaign character with id ${id} not found`);
        }

        // Get the character before deleting to access crewId
        const character = this.db.data.campaignCharacters[index];

        // Remove character from database
        this.db.data.campaignCharacters.splice(index, 1);

        // Remove character ID from crew's characterIds array
        if (character.crewId) {
            const crew = this.db.data.campaignCrews.find((c) => c.id === character.crewId);
            if (crew) {
                crew.characterIds = crew.characterIds.filter((charId) => charId !== id);
                crew.updatedAt = new Date().toISOString();
            }
        }

        this.db.write();
    }

    // Ship Type methods
    async getAllShipTypes(): Promise<IShipType[]> {
        await this.db.read();
        return this.db.data.shipTypes;
    }

    async getShipTypeById(id: string): Promise<IShipType | undefined> {
        await this.db.read();
        return this.db.data.shipTypes.find((s) => s.id === id);
    }

    // Motivations
    async getAllMotivations(): Promise<IMotivation[]> {
        await this.db.read();
        return this.db.data.motivations;
    }

    async getMotivationById(id: string): Promise<IMotivation | undefined> {
        await this.db.read();
        return this.db.data.motivations.find((m) => m.id === id);
    }

    // Utility method to reset database
    async resetDatabase(): Promise<void> {
        await this.db.read();
        this.db.data = {
            species: [],
            speciesAbilities: [],
            backgrounds: [],
            characterClasses: [],
            crewTypes: [],
            motivations: [],
            shipTypes: [],
            campaigns: [],
            campaignCrews: [],
            campaignCharacters: [],
        };
        await this.db.write();
    }
}
