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

    // Campaign Character methods
    getCampaignCharacters(): ICampaignCharacter[] {
        return this.db.data.campaignCharacters;
    }

    getCampaignCharacterById(id: string): ICampaignCharacter | undefined {
        return this.db.data.campaignCharacters.find((c) => c.id === id);
    }

    createCampaignCharacter(data: Partial<ICampaignCharacter>): ICampaignCharacter {
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
            reactions: data.reactions || 1,
            speed: data.speed || 4,
            combat: data.combat || 0,
            toughness: data.toughness || 3,
            savvy: data.savvy || 0,
            xp: data.xp || 0,
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
        this.db.data.campaignCharacters.push(character);
        this.db.write();
        return character;
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
        this.db.data.campaignCharacters.splice(index, 1);
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
