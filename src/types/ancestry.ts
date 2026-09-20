import type { NamedFeature } from "../common.ts";

export type Ancestry = {
  name: string;
  description: string;
  features: NamedFeature[];
};
