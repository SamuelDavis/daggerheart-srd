import {
  fields,
  findSection,
  int,
  matchOrThrow,
  namedFeatures,
  parseDoc,
  requireField,
  splitHeader,
  thresholds,
  tier,
} from "../markdown.ts";
import type { Armor } from "../types/armor.ts";

export function parseArmor(markdown: string): Armor {
  const doc = parseDoc(markdown);
  const { header, rest } = splitHeader(doc.preamble);
  const h = matchOrThrow(
    /^\*\*_Tier (\d+)_\*\*\s*_Armor_$/,
    header,
    "armor header",
  );
  const f = fields(rest);
  const featureLines = findSection(doc, /^FEATURES?$/i);
  const features = featureLines ? namedFeatures(featureLines) : [];
  if (features.length > 1) throw new Error("armor has more than one feature");
  return {
    name: doc.title,
    tier: tier(h[1]),
    baseThresholds: thresholds(requireField(f, "base thresholds")),
    baseScore: int(requireField(f, "base score"), "base score"),
    feature: features[0] ?? null,
  };
}
