import type { NamedFeature } from "../common.ts";

export type Transformation = {
  name: string;
  description: string;
  features: NamedFeature[];
  questions: string[];
};
