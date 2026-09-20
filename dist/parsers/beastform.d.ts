import { type Damage, type DamageType, type NamedFeature, type Range, type Tier, type Trait } from "../common.js";
export type Beastform = {
    name: string;
    tier: Tier;
    /** Example creatures, e.g. ["Chimera", "Cockatrice"]. */
    examples: string[];
    /** traitBonus, evasionBonus and attack are null where the SRD says "<no value>" or omits them. */
    traitBonus: {
        trait: Trait;
        bonus: number;
    } | null;
    evasionBonus: number | null;
    attack: {
        trait: Trait;
        range: Range;
        damage: Damage;
        damageType: DamageType[];
    } | null;
    advantages: string[];
    features: NamedFeature[];
};
export declare function parseBeastform(markdown: string): Beastform;
