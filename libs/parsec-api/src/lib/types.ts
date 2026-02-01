export interface ISpecies {
    id: string;
    name: string;
    description: string;
    abilitiesId: string;
    speciesTypeId: string;
}

export interface ISpeciesType {
    id: string;
    name: string;
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

export type ResourceType = 'credits' | 'storyPoints' | 'reputation' | 'patrons' | 'rivals' | 'rumor';

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
export type WeaponType = 'military' | 'lowTech' | 'highTech';

export interface IStartingItem {
    id: string;
    itemType: ItemType;
    subtype?: WeaponType;
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

export interface IWeaponTrait {
    id: string;
    name: string;
    description: string;
}
export interface IWeapon {
    id: string;
    name: string;
    type: WeaponType;
    description: string;
    range: number;
    shots: number;
    damage: number;
    traits: string[];
}

export interface IArmor {
    id: string;
    name: string;
    description: string;
}

// consumables, gun mods    etc

export interface IWeMetThrough {
    id: string
    name: string;
}

export interface ICaracterizedAs {
    id: string;
    name: string
}

export interface ICampaignCard {
    id: string;
    name: string;
    description: string;
    isPlayed: boolean;
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
    /** Target number of crew members (from create campaign). Default 6 when missing. */
    crewSize?: number;
    /** Crew composition method, e.g. 'first-timer' (only humans), 'random', 'miniatures'. */
    crewCompositionMethod?: string;
    campaignTurn: number;
    storyPoints: number;
    difficulty?: CampaignDifficulty;
    createdAt: string;
    updatedAt: string;
    cards: ICampaignCard[];
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
    weMetThrough?: string;
    caracterizedAs?: string;
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
    isInjured: boolean;
    injuries: string[];

    // Equipment
    weapons: string[];
    armor: string[];
    gear: string[];
    gadgets: string[];

    // Character State
    isActive: boolean; // Is character in the active crew?
    isDead: boolean;
    isLeader: boolean;

    createdAt: string;
    updatedAt: string;
}

export type UnitSystem = 'imperial' | 'metric';

export interface IBattleSize {
    id: string;
    name: string;
    value: number;
}

export interface IUserSettings {
    id: string;
    userId: string;
    unitSystem: UnitSystem;
}