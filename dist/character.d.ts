import type { DomainName, NamedFeature, Trait } from "./common.js";
import type { Ability } from "./types/ability.js";
import type { Ancestry } from "./types/ancestry.js";
import type { Armor } from "./types/armor.js";
import type { Beastform } from "./types/beastform.js";
import type { Class } from "./types/class.js";
import type { Community } from "./types/community.js";
import type { Consumable } from "./types/consumable.js";
import type { Item } from "./types/item.js";
import type { Subclass } from "./types/subclass.js";
import type { Transformation } from "./types/transformation.js";
import type { Weapon } from "./types/weapon.js";
export declare const levels: readonly [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export type Level = (typeof levels)[number];
/** Modifiers assigned to the six traits, in any order, at character creation. */
export declare const startingTraitModifiers: readonly [2, 1, 1, 0, 0, -1];
export declare const startingHope = 2;
export declare const maxHope = 6;
export declare const startingStress = 6;
/** HP and Stress slots can be increased by level-ups up to this many. */
export declare const maxHitPointSlots = 12;
export declare const maxStressSlots = 12;
export declare const startingProficiency = 1;
/** Experiences a PC starts with, each at this bonus. */
export declare const startingExperiences = 2;
export declare const startingExperienceBonus = 2;
/** Domain cards that can be active in the loadout at once; the rest are in the vault. */
export declare const maxLoadout = 5;
/** `[current, maximum]` */
export type Resource = [current: number, maximum: number];
export type Experience = {
    name: string;
    bonus: number;
};
/** Gold on the character sheet. */
export type Gold = {
    handfuls: number;
    bags: number;
    chests: number;
};
/** Anything in the inventory that isn't an SRD item (a torch, rope, ...). */
export type CustomItem = {
    name: string;
    description?: string;
};
/**
 * Either a single ancestry, or a Mixed Ancestry: the first-listed feature of
 * one ancestry and the second-listed feature of another.
 */
export type Heritage = {
    ancestry: Ancestry;
    community: Community;
} | {
    mixedAncestry: {
        first: {
            ancestry: Ancestry["name"];
            feature: NamedFeature;
        };
        second: {
            ancestry: Ancestry["name"];
            feature: NamedFeature;
        };
    };
    community: Community;
};
/** A class gained by multiclassing (level 5+). */
export type Multiclass = {
    class: Class;
    subclass: Subclass;
    /** The one of the class's domains gained access to. */
    domain: DomainName;
};
export type PlayerCharacter = {
    name: string;
    pronouns: string;
    /** Free-text character description (appearance, demeanor, ...). */
    description: string;
    level: Level;
    class: Class;
    subclass: Subclass;
    multiclass: Multiclass | null;
    heritage: Heritage;
    transformations: Transformation[];
    /** The Beastform currently taken, if any. */
    beastform: Beastform | null;
    /** Trait modifiers, e.g. { agility: 2, strength: 1, ... }. */
    traits: Record<Trait, number>;
    evasion: number;
    hitPoints: Resource;
    stress: Resource;
    hope: Resource;
    proficiency: number;
    /** Armor slots as `[marked, total]`, total being the Armor Score. */
    armorSlots: Resource;
    /** Equipped armor; null if unarmored. */
    armor: Armor | null;
    /** Active weapons: a two-handed primary, or a one-handed primary and secondary. */
    weapons: Weapon[];
    inventory: (Item | Consumable | CustomItem)[];
    gold: Gold;
    experiences: Experience[];
    /** Domain cards in the loadout (at most `maxLoadout`). */
    loadout: Ability[];
    /** Acquired domain cards not currently in the loadout. */
    vault: Ability[];
    /** Answers to the class's background questions, in the same order. */
    background: string[];
    /** Relationships to the other PCs. */
    connections: string[];
};
