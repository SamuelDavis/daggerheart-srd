import { type EnvironmentType, type Tier, type TypedFeature } from "../common.js";
import type { Adversary } from "./adversary.js";
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
export declare function parseEnvironment(markdown: string): Environment;
