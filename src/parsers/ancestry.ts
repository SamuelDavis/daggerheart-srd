import type { NamedFeature } from "../common.ts";
import { namedFeatures, parseDoc, requireSection, text } from "../markdown.ts";

export type Ancestry = {
  name: string;
  description: string;
  features: NamedFeature[];
};

export function parseAncestry(markdown: string): Ancestry {
  const doc = parseDoc(markdown);
  return {
    name: doc.title,
    description: text(doc.preamble),
    features: namedFeatures(requireSection(doc, /^ANCESTRY FEATURES?$/i)),
  };
}
