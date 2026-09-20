import { burdens, ranges, traits, weaponCategories } from "../common.ts";
import {
  damageWithType,
  fields,
  findSection,
  matchOrThrow,
  namedFeatures,
  oneOf,
  parseDoc,
  requireField,
  splitHeader,
  tier,
} from "../markdown.ts";
import type { Weapon } from "../types/weapon.ts";

export function parseWeapon(markdown: string): Weapon {
  const doc = parseDoc(markdown);
  const { header, rest } = splitHeader(doc.preamble);
  const h = matchOrThrow(
    /^\*\*_Tier (\d+)_\*\*\s*_(\w+)_\s*_\w+_\s*_Weapon_$/,
    header,
    "weapon header",
  );
  const f = fields(rest);
  const featureLines = findSection(doc, /^FEATURES?$/i);
  const features = featureLines ? namedFeatures(featureLines) : [];
  if (features.length > 1) throw new Error("weapon has more than one feature");

  return {
    name: doc.title,
    tier: tier(h[1]),
    category: oneOf(weaponCategories, h[2], "category"),
    trait: oneOf(traits, requireField(f, "trait").toLowerCase(), "trait"),
    range: oneOf(ranges, requireField(f, "range"), "range"),
    ...damageWithType(requireField(f, "damage")),
    burden: oneOf(burdens, requireField(f, "burden"), "burden"),
    feature: features[0] ?? null,
  };
}
