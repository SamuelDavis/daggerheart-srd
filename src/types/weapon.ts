import type {
  Burden,
  Category,
  Damage,
  DamageType,
  NamedFeature,
  Range,
  Tier,
  Trait,
} from "../common.ts";

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

// **_Tier 3_** _Primary_ _Magical_ _Weapon_
