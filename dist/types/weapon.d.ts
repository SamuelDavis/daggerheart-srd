import type { Burden, Damage, DamageType, NamedFeature, Range, Tier, Trait, WeaponCategory } from "../common.js";
export type Weapon = {
    name: string;
    tier: Tier;
    category: WeaponCategory;
    trait: Trait;
    range: Range;
    damage: Damage;
    damageType: DamageType[];
    burden: Burden;
    /** null for weapons with no feature. */
    feature: NamedFeature | null;
};
