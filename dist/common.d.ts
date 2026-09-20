export declare const tiers: readonly [1, 2, 3, 4, 5];
export type Tier = (typeof tiers)[number];
export declare const traits: readonly ["agility", "strength", "finesse", "instinct", "presence", "knowledge"];
export type Trait = (typeof traits)[number];
export declare const ranges: readonly ["Melee", "Very Close", "Close", "Far", "Very Far"];
export type Range = (typeof ranges)[number];
export type DiceRoll = `d${number}` | `${number}d${number}`;
export type RollModifier = `+${number}` | `-${number}`;
/** A dice roll with optional modifier, or a flat number (e.g. "4"). */
export type Damage = DiceRoll | `${DiceRoll}${RollModifier}` | `${number}`;
/** Attack bonus, usually "+1"/"-2"; occasionally a die like "+2d4". */
export type AttackBonus = RollModifier | `+${DiceRoll}`;
export declare const damageTypes: readonly ["phy", "mag", "phy/mag", "phy or mag", "direct phy"];
export type DamageType = (typeof damageTypes)[number];
export declare const burdens: readonly ["One-Handed", "Two-Handed"];
export type Burden = (typeof burdens)[number];
export declare const categories: readonly ["Primary", "Secondary"];
export type Category = (typeof categories)[number];
export declare const featureTypes: readonly ["action", "reaction", "passive", "evolution"];
export type FeatureType = (typeof featureTypes)[number];
export declare const domains: readonly ["Arcana", "Blade", "Bone", "Codex", "Dread", "Grace", "Midnight", "Sage", "Splendor", "Valor"];
export type DomainName = (typeof domains)[number];
export declare const cardTypes: readonly ["Ability", "Spell", "Grimoire"];
export type CardType = (typeof cardTypes)[number];
export declare const adversaryTypes: readonly ["Bruiser", "Horde", "Leader", "Minion", "Ranged", "Skulk", "Social", "Solo", "Standard", "Support"];
export type AdversaryType = (typeof adversaryTypes)[number];
export declare const environmentTypes: readonly ["Event", "Exploration", "Social", "Traversal"];
export type EnvironmentType = (typeof environmentTypes)[number];
/** A feature with no action type (weapons, armor, ancestries, ...). */
export type NamedFeature = {
    name: string;
    description: string;
};
/** A feature with an action type (adversaries, environments). */
export type TypedFeature = {
    name: string;
    type: FeatureType;
    /** Text after the type, e.g. "Countdown (Loop 1d4)". Not parsed further. */
    detail?: string;
    description: string;
};
export type ArmorThresholds = {
    major: number;
    severe: number;
};
/** Adversary thresholds; a side is null where the SRD says "None". */
export type AdversaryThresholds = {
    major: number | null;
    severe: number | null;
};
