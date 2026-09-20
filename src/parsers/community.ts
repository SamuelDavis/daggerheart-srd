import type { NamedFeature } from "../common.ts";
import {
  matchOrThrow,
  namedFeatures,
  parseDoc,
  requireSection,
  text,
  trimBlank,
} from "../markdown.ts";

export type Community = {
  name: string;
  description: string;
  /** From "_X are often candid, cooperative, and weathered._" */
  temperament: string[];
  feature: NamedFeature;
};

export function parseCommunity(markdown: string): Community {
  const doc = parseDoc(markdown);
  const body = trimBlank(doc.preamble);
  const last = body[body.length - 1] ?? "";
  const m = matchOrThrow(
    /^_.*? often (.+?)\.?_$/,
    last,
    "community temperament",
  );

  const features = namedFeatures(requireSection(doc, /^COMMUNITY FEATURES?$/i));
  if (features.length !== 1) {
    throw new Error(`expected 1 community feature, got ${features.length}`);
  }

  return {
    name: doc.title,
    description: text(body.slice(0, -1)),
    temperament: m[1].split(/,\s*(?:and\s+)?|\s+and\s+/).map((s) => s.trim())
      .filter(Boolean),
    feature: features[0],
  };
}
