// Common types, hard-coded from the SRD README.

export const tiers = [1, 2, 3, 4, 5] as const;
export type Tier = (typeof tiers)[number];

export const traits = [
  "agility",
  "strength",
  "finesse",
  "instinct",
  "presence",
  "knowledge",
] as const;
export type Trait = (typeof traits)[number];

export const ranges = [
  "Melee",
  "Very Close",
  "Close",
  "Far",
  "Very Far",
] as const;
export type Range = (typeof ranges)[number];

export type DiceRoll = `d${number}` | `${number}d${number}`;
export type RollModifier = `+${number}` | `-${number}`;
/** A dice roll with optional modifier, or a flat number (e.g. "4"). */
export type Damage = DiceRoll | `${DiceRoll}${RollModifier}` | `${number}`;
/** Attack bonus, usually "+1"/"-2"; occasionally a die like "+2d4". */
export type AttackBonus = RollModifier | `+${DiceRoll}`;

export const damageTypes = ["phy", "mag", "direct phy"] as const;
export type DamageType = (typeof damageTypes)[number];

export const burdens = ["One-Handed", "Two-Handed"] as const;
export type Burden = (typeof burdens)[number];

export const categories = ["Primary", "Secondary"] as const;
export type Category = (typeof categories)[number];

export const featureTypes = [
  "action",
  "reaction",
  "passive",
  "evolution",
] as const;
export type FeatureType = (typeof featureTypes)[number];

export const domains = [
  "Arcana",
  "Blade",
  "Bone",
  "Codex",
  "Dread",
  "Grace",
  "Midnight",
  "Sage",
  "Splendor",
  "Valor",
] as const;
export type DomainName = (typeof domains)[number];

export const cardTypes = ["Ability", "Spell", "Grimoire"] as const;
export type CardType = (typeof cardTypes)[number];

export const adversaryTypes = [
  "Bruiser",
  "Horde",
  "Leader",
  "Minion",
  "Ranged",
  "Skulk",
  "Social",
  "Solo",
  "Standard",
  "Support",
] as const;
export type AdversaryType = (typeof adversaryTypes)[number];

export const environmentTypes = [
  "Event",
  "Exploration",
  "Social",
  "Traversal",
] as const;
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

export type ArmorThresholds = [major: number, severe: number];

/** Adversary thresholds; a side is null where the SRD says "None". */
export type AdversaryThresholds = {
  major: number | null;
  severe: number | null;
};
