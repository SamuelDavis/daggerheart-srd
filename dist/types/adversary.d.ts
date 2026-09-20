import type { AdversaryThresholds, AdversaryType, AttackBonus, Damage, DamageType, Range, Tier, TypedFeature } from "../common.js";
export type Adversary = {
    name: string;
    tier: Tier;
    adversaryType: AdversaryType;
    /** Text in parentheses after the type, e.g. "2/HP" for `Horde (2/HP)`. */
    typeDetail?: string;
    description: string;
    motivesAndTactics: string[];
    difficulty: number;
    thresholds: AdversaryThresholds;
    hp: number;
    /** null where the SRD says "None". */
    stress: number | null;
    attack: {
        bonus: AttackBonus;
        name: string;
        range: Range;
        damage: Damage;
        damageType: DamageType[];
    };
    experiences: {
        name: string;
        bonus: number;
    }[];
    features: TypedFeature[];
};
