import { type NamedFeature, type Trait, traits } from "../common.ts";
import {
  findSection,
  namedFeatures,
  oneOf,
  parseDoc,
  requireSection,
  text,
} from "../markdown.ts";

export type Subclass = {
  name: string;
  description: string;
  /** null for subclasses with no spellcast trait. */
  spellcastTrait: Trait | null;
  foundationFeatures: NamedFeature[];
  specializationFeatures: NamedFeature[];
  masteryFeatures: NamedFeature[];
};

export function parseSubclass(markdown: string): Subclass {
  const doc = parseDoc(markdown);
  const traitLines = findSection(doc, /^SPELLCAST TRAIT$/i);
  return {
    name: doc.title,
    description: text(doc.preamble),
    spellcastTrait: traitLines
      ? oneOf(traits, text(traitLines).toLowerCase(), "spellcast trait")
      : null,
    foundationFeatures: namedFeatures(
      requireSection(doc, /^FOUNDATION FEATURES?$/i),
    ),
    specializationFeatures: namedFeatures(
      requireSection(doc, /^SPECIALIZATION FEATURES?$/i),
    ),
    masteryFeatures: namedFeatures(requireSection(doc, /^MASTERY FEATURES?$/i)),
  };
}
