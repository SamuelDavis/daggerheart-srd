import type { NamedFeature } from "../common.ts";

export type Community = {
  name: string;
  description: string;
  /** From "_X are often candid, cooperative, and weathered._" */
  temperament: string[];
  feature: NamedFeature;
};
