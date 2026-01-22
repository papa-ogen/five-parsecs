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

export interface IGear {
    id: string;
    name: string;
    description: string;
    moduleId?: string;
    rollMin: number;
    rollMax: number;
}

export interface IShipType {
    id: string;
    name: string;
    description: string;
    moduleId?: string;
    rollMin: number;
    rollMax: number;
}

export interface IWeapon {
    id: string;
    name: string;
    description: string;
    moduleId?: string;
    rollMin: number;
    rollMax: number;
}

export interface IArmor {
    id: string;
    name: string;
    description: string;
    moduleId?: string;
    rollMin: number;
    rollMax: number;
}


// Campaign System Interfaces
export enum CampaignDifficulty {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard',
}
export enum CampaignStatus {
    NO_STARTED = 'no_started',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    ABANDONED = 'abandoned',
}

export interface ICampaign {
    id: string;
    name: string;
    description?: string;
    status: CampaignStatus;
    crewId: string; // Reference to ICampaignCrew

    // Campaign Progress
    campaignTurn: number;
    credits: number;
    storyPoints: number;

    // Ship Info
    shipName?: string;
    shipType?: string;

    // Settings
    enabledModuleIds: string[]; // Which expansions are active
    difficulty?: CampaignDifficulty;

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

export interface ICampaignCrew {
    id: string;
    campaignId: string; // Reference to ICampaign
    name: string;
    description?: string;

    // Character References
    characterIds: string[]; // Array of ICampaignCharacter IDs

    // Crew Resources
    reputation: number;
    patrons: number;
    rivals: number;

    // Crew Status
    location?: string;
    inBattle: boolean;

    createdAt: string;
    updatedAt: string;
}

export interface ICampaignCharacter {
    id: string;
    crewId: string; // Reference to ICampaignCrew

    // Basic Info
    name: string;

    // Character Creation References (from templates)
    speciesId: string; // Reference to ISpecies
    backgroundId: string; // Reference to IBackground
    originId: string; // Reference to IOrigin
    motivationId: string; // Reference to IMotivation
    characterClassId: string; // Reference to ICharacterClass
    specialCircumstanceId?: string; // Reference to ISpecialCircumstance
    talentIds: string[]; // References to ITalent

    // Character Stats
    reactions: number;
    speed: number;
    combat: number;
    toughness: number;
    savvy: number;

    // Character Status
    xp: number;
    level: number;
    isInjured: boolean;
    injuries: string[];

    // Equipment
    weapons: string[];
    armor: string[];
    gear: string[];

    // Character State
    isActive: boolean; // Is character in the active crew?
    isDead: boolean;

    createdAt: string;
    updatedAt: string;
}