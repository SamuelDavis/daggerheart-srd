import type { NamedFeature } from "../common.ts";
import {
  bullets,
  namedFeatures,
  parseDoc,
  requireSection,
  text,
} from "../markdown.ts";

export type Transformation = {
  name: string;
  description: string;
  features: NamedFeature[];
  questions: string[];
};

export function parseTransformation(markdown: string): Transformation {
  const doc = parseDoc(markdown);
  return {
    name: doc.title,
    description: text(doc.preamble),
    features: namedFeatures(requireSection(doc, /^TRANSFORMATION FEATURES?$/i)),
    questions: bullets(requireSection(doc, /^TRANSFORMATION QUESTIONS$/i)),
  };
}
