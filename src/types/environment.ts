import type { EnvironmentType, Tier, TypedFeature } from "../common.ts";
import type { Adversary } from "./adversary.ts";

export type Environment = {
  name: string;
  tier: Tier;
  environmentType: EnvironmentType;
  description: string;
  impulses: string[];
  difficulty: string;
  potentialAdversaries: "Any" | Adversary["name"][];
  features: TypedFeature[];
};

// **_Tier 4 Traversal._** _An otherworldly space ..._
