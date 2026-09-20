import { namedFeatures, parseDoc, requireSection, text } from "../markdown.ts";
import type { Ancestry } from "../types/ancestry.ts";

export function parseAncestry(markdown: string): Ancestry {
  const doc = parseDoc(markdown);
  return {
    name: doc.title,
    description: text(doc.preamble),
    features: namedFeatures(requireSection(doc, /^ANCESTRY FEATURES?$/i)),
  };
}
