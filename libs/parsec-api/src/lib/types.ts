export interface ISpecies {
    id: string;
    name: string;
    description: string;
    abilitiesId: string;
}

export interface ISpeciesAbility {
    id: string;
    reactions: number;
    speed: number;
    combat: number;
    toughness: number;
    savvy: number;
    luck?: number;
}

export interface IMotivation {
    id: string;
    name: string;
    description: string;
    effect: string;
    resources: string;
    startingRolls: string;
}

export interface ICharacterClass {
    id: string;
    name: string;
    description: string;
    effect: string;
    resources: string;
    startingRolls: string;
}

export interface ITalent {
    id: string;
    name: string;
    description: string;
}


export interface IBackground {
    id: string;
    name: string;
    description: string;
    effect: string;
    resources: string;
    startinRolls: string
}

export interface ICrewType {
    id: string;
    name: string;
    description: string;
    rollMin: number;
    rollMax: number;
}

export interface IPrimaryAlien {
    id: string;
    speciesId: string;
}

export interface IStrangeCharacter {
    id: string;
    speciesId: string;
}

export interface IGear {
    id: string;
    name: string;
    description: string;
}

export interface IShipType {
    id: string;
    name: string;
    description: string;
}

export interface IWeapon {
    id: string;
    name: string;
    description: string;
}

export interface IArmor {
    id: string;
    name: string;
    description: string;
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
    motivationId: string; // Reference to IMotivation
    characterClassId: string; // Reference to ICharacterClass
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
    isLeader: boolean;

    createdAt: string;
    updatedAt: string;
}