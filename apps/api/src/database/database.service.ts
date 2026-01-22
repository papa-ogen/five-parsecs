import { join } from 'path';

import {
    ISpecies,
    IBackground,
    IClass,
    ICRewType,
} from '@five-parsecs/parsec-api';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { JSONFilePreset } from 'lowdb/node';

interface DatabaseSchema {
    species: ISpecies[];
    backgrounds: IBackground[];
    classes: IClass[];
    crewTypes: ICRewType[];
}

@Injectable()
export class DatabaseService implements OnModuleInit {
    private db: Awaited<ReturnType<typeof JSONFilePreset<DatabaseSchema>>>;

    async onModuleInit() {
        const dbPath = join(process.cwd(), 'apps', 'api', 'src', 'database', 'db.json');

        // Initialize the database with default data
        const defaultData: DatabaseSchema = {
            species: [],
            backgrounds: [],
            classes: [],
            crewTypes: [],
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
    async getAllClasses(): Promise<IClass[]> {
        await this.db.read();
        return this.db.data.classes;
    }

    async getClassById(id: string): Promise<IClass | undefined> {
        await this.db.read();
        return this.db.data.classes.find((c) => c.id === id);
    }

    async addClass(classData: IClass): Promise<IClass> {
        await this.db.read();
        this.db.data.classes.push(classData);
        await this.db.write();
        return classData;
    }

    // Crew Type methods
    async getAllCrewTypes(): Promise<ICRewType[]> {
        await this.db.read();
        return this.db.data.crewTypes;
    }

    async getCrewTypeById(id: string): Promise<ICRewType | undefined> {
        await this.db.read();
        return this.db.data.crewTypes.find((c) => c.id === id);
    }

    async addCrewType(crewType: ICRewType): Promise<ICRewType> {
        await this.db.read();
        this.db.data.crewTypes.push(crewType);
        await this.db.write();
        return crewType;
    }

    // Utility method to reset database
    async resetDatabase(): Promise<void> {
        await this.db.read();
        this.db.data = {
            species: [],
            backgrounds: [],
            classes: [],
            crewTypes: [],
        };
        await this.db.write();
    }
}
