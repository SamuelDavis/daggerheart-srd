import {
  type Burden,
  burdens,
  categories,
  type Category,
  type Damage,
  type DamageType,
  type NamedFeature,
  type Range,
  ranges,
  type Tier,
  type Trait,
  traits,
} from "../common.ts";
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

export type Weapon = {
  name: string;
  tier: Tier;
  category: Category;
  trait: Trait;
  range: Range;
  damage: Damage;
  damageType: DamageType;
  burden: Burden;
  /** null for weapons with no feature. */
  feature: NamedFeature | null;
};

// **_Tier 3_** _Primary_ _Magical_ _Weapon_
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
    category: oneOf(categories, h[2], "category"),
    trait: oneOf(traits, requireField(f, "trait").toLowerCase(), "trait"),
    range: oneOf(ranges, requireField(f, "range"), "range"),
    ...damageWithType(requireField(f, "damage")),
    burden: oneOf(burdens, requireField(f, "burden"), "burden"),
    feature: features[0] ?? null,
  };
}
