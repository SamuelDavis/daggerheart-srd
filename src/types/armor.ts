import type { ArmorThresholds, NamedFeature, Tier } from "../common.ts";

export type Armor = {
  name: string;
  tier: Tier;
  baseThresholds: ArmorThresholds;
  baseScore: number;
  /** null for armor with no feature. */
  feature: NamedFeature | null;
};

// **_Tier 2_** _Armor_
