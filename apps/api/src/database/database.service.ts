import { join } from 'path';

import {
    IModule,
    ISpecies,
    IBackground,
    ICharacterClass,
    ICrewType,
    ISpecialCircumstance,
} from '@five-parsecs/parsec-api';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { JSONFilePreset } from 'lowdb/node';

interface DatabaseSchema {
    modules: IModule[];
    species: ISpecies[];
    backgrounds: IBackground[];
    characterClasses: ICharacterClass[];
    crewTypes: ICrewType[];
    specialCircumstances: ISpecialCircumstance[];
}

@Injectable()
export class DatabaseService implements OnModuleInit {
    private db: Awaited<ReturnType<typeof JSONFilePreset<DatabaseSchema>>>;

    async onModuleInit() {
        const dbPath = join(process.cwd(), 'apps', 'api', 'src', 'database', 'db.json');

        // Initialize the database with default data
        const defaultData: DatabaseSchema = {
            modules: [],
            species: [],
            backgrounds: [],
            characterClasses: [],
            crewTypes: [],
            specialCircumstances: [],
        };

        this.db = await JSONFilePreset<DatabaseSchema>(dbPath, defaultData);
    }

    // Module methods
    async getAllModules(): Promise<IModule[]> {
        await this.db.read();
        return this.db.data.modules;
    }

    async getModuleById(id: string): Promise<IModule | undefined> {
        await this.db.read();
        return this.db.data.modules.find((m) => m.id === id);
    }

    async toggleModule(id: string, enabled: boolean): Promise<IModule | undefined> {
        await this.db.read();
        const module = this.db.data.modules.find((m) => m.id === id);
        if (module) {
            module.enabled = enabled;
            await this.db.write();
        }
        return module;
    }

    async addModule(module: IModule): Promise<IModule> {
        await this.db.read();
        this.db.data.modules.push(module);
        await this.db.write();
        return module;
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

    // Special Circumstance methods
    async getAllSpecialCircumstances(): Promise<ISpecialCircumstance[]> {
        await this.db.read();
        return this.db.data.specialCircumstances;
    }

    async getSpecialCircumstanceById(id: string): Promise<ISpecialCircumstance | undefined> {
        await this.db.read();
        return this.db.data.specialCircumstances.find((s) => s.id === id);
    }

    async addSpecialCircumstance(specialCircumstance: ISpecialCircumstance): Promise<ISpecialCircumstance> {
        await this.db.read();
        this.db.data.specialCircumstances.push(specialCircumstance);
        await this.db.write();
        return specialCircumstance;
    }

    // Utility method to reset database
    async resetDatabase(): Promise<void> {
        await this.db.read();
        this.db.data = {
            modules: [],
            species: [],
            backgrounds: [],
            characterClasses: [],
            crewTypes: [],
            specialCircumstances: [],
        };
        await this.db.write();
    }
}
