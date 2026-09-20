import { type Burden, type Category, type Damage, type DamageType, type NamedFeature, type Range, type Tier, type Trait } from "../common.js";
export type Weapon = {
    name: string;
    tier: Tier;
    category: Category;
    trait: Trait;
    range: Range;
    damage: Damage;
    damageType: DamageType[];
    burden: Burden;
    /** null for weapons with no feature. */
    feature: NamedFeature | null;
};
export declare function parseWeapon(markdown: string): Weapon;
