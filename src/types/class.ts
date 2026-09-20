import type { NamedFeature } from "../common.ts";
import type { Domain } from "./domain.ts";
import type { Subclass } from "./subclass.ts";

export type Class = {
  name: string;
  description: string;
  domains: Domain["name"][];
  startingEvasion: number;
  startingHitPoints: number;
  classItems: string;
  hopeFeature: NamedFeature;
  classFeatures: NamedFeature[];
  subclasses: Subclass["name"][];
  backgroundQuestions: string[];
  connections: string[];
};
