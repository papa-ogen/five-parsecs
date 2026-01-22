export interface IModule {
    id: string;
    name: string;
    description: string;
    enabled?: boolean;
}

export interface IOrigin {
    id: string;
    name: string;
    description: string;
    moduleId?: string;
    rollMin: number;
    rollMax: number;
}

export interface IMotivation {
    id: string;
    name: string;
    description: string;
    moduleId?: string;
    rollMin: number;
    rollMax: number;
}

export interface ICharacterClass {
    id: string;
    name: string;
    description: string;
    moduleId?: string;
    rollMin: number;
    rollMax: number;
}

export interface ISpecialCircumstance {
    id: string;
    name: string;
    description: string;
    moduleId?: string;
    rollMin: number;
    rollMax: number;
}

export interface ITalent {
    id: string;
    name: string;
    description: string;
    moduleId?: string;
    rollMin: number;
    rollMax: number;
}

export interface ISpecies {
    id: string;
    name: string;
    description: string;
    moduleId?: string;
}

export interface IBackground {
    id: string;
    name: string;
    description: string;
    moduleId?: string;
}



export interface ICrewType {
    id: string;
    name: string;
    description: string;
    moduleId?: string;
}