import { type NamedFeature } from "../common.js";
import type { Domain } from "./domain.js";
import type { Subclass } from "./subclass.js";
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
export declare function parseClass(markdown: string): Class;
