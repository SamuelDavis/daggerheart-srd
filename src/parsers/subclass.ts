import { traits } from "../common.ts";
import {
  findSection,
  namedFeatures,
  oneOf,
  parseDoc,
  requireSection,
  text,
} from "../markdown.ts";
import type { Subclass } from "../types/subclass.ts";

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
