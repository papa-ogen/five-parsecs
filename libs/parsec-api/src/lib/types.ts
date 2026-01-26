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


export interface IEffect {
    id: string;
    abilityId: string;
    amount: number;
    description: string;
}

export type ResourceType = 'credits' | 'storyPoints' | 'reputation' | 'patrons' | 'rivals' | 'questRumors' | 'rumor';

export interface IDiceRoll {
    numDice: number;    // Number of dice to roll
    diceSize: number;   // Size of each die (6 for D6, etc.)
    modifier?: number;  // Optional fixed modifier (+1, +2, etc.)
}

export interface IResourceEffect {
    id: string;
    resourceType: ResourceType;
    amount: number | IDiceRoll; // Fixed amount or dice roll
    description: string;
}

export type ItemType = 'weapon' | 'gear' | 'gadget' | 'armor';
export type WeaponSubtype = 'military' | 'lowTech' | 'highTech' | 'any';

export interface IStartingItem {
    id: string;
    itemType: ItemType;
    subtype?: WeaponSubtype;  // Only for weapons
    amount: number;
    description: string;
}

export interface IMotivation {
    id: string;
    name: string;
    description: string;
    effect: IEffect[];
    resources: IResourceEffect[];
    startingRolls: IStartingItem[];
}

export interface ICharacterClass {
    id: string;
    name: string;
    description: string;
    effect: IEffect[];
    resources: IResourceEffect[];
    startingRolls: IStartingItem[];
}

export interface IBackground {
    id: string;
    name: string;
    description: string;
    effect: IEffect[];
    resources: IResourceEffect[];
    startingRolls: IStartingItem[];
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

export interface IGadget {
    id: string;
    name: string;
    description: string;
}

export interface IShipType {
    id: string;
    name: string;
    hull: number;
    cost: number;
    description: string;
}

export type WeaponType = 'military' | 'lowTech' | 'highTech'

export interface IWeapon {
    id: string;
    name: string;
    type: WeaponType;
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
    crewId: string;
    campaignTurn: number;
    storyPoints: number;
    difficulty?: CampaignDifficulty;
    createdAt: string;
    updatedAt: string;
}

export interface ICampaignCrew {
    id: string;
    campaignId: string;
    name: string;
    description?: string;
    characterIds: string[];
    reputation: number;
    patrons: number;
    rivals: number;
    questRumors: number;
    rumors: number;
    location?: string;
    inBattle: boolean;
    ship?: IShipType & { name: string };
    credits: number;
    debt: number;
    createdAt: string;
    updatedAt: string;
    gear: IGear[];
    gadgets: IGadget[];
    weapons: IWeapon[];
    gadgetCount: number;
    gearCount: number;
    lowTechWeaponCount: number;
    militaryWeaponCount: number;
    highTechWeaponCount: number;
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

    // Character Stats
    reactions: number;
    speed: number;
    combat: number;
    toughness: number;
    savvy: number;
    luck: number;

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