import type { NamedFeature } from "../common.js";
export type Transformation = {
    name: string;
    description: string;
    features: NamedFeature[];
    questions: string[];
};
export declare function parseTransformation(markdown: string): Transformation;
