import type { NamedFeature } from "../common.js";
export type Ancestry = {
    name: string;
    description: string;
    features: NamedFeature[];
};
export declare function parseAncestry(markdown: string): Ancestry;
