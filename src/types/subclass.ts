import type { NamedFeature, Trait } from "../common.ts";

export type Subclass = {
  name: string;
  description: string;
  /** null for subclasses with no spellcast trait. */
  spellcastTrait: Trait | null;
  foundationFeatures: NamedFeature[];
  specializationFeatures: NamedFeature[];
  masteryFeatures: NamedFeature[];
};
