import {
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
  int,
  matchOrThrow,
  namedFeatures,
  oneOf,
  parseDoc,
  splitHeader,
  splitList,
  tier,
} from "../markdown.ts";

export type Beastform = {
  name: string;
  tier: Tier;
  /** Example creatures, e.g. ["Chimera", "Cockatrice"]. */
  examples: string[];
  /** traitBonus, evasionBonus and attack are null where the SRD says "<no value>" or omits them. */
  traitBonus: { trait: Trait; bonus: number } | null;
  evasionBonus: number | null;
  attack: {
    trait: Trait;
    range: Range;
    damage: Damage;
    damageType: DamageType[];
  } | null;
  advantages: string[];
  features: NamedFeature[];
};

// **_Tier 4_** _(Chimera, Cockatrice, Manticore, etc.)_
export function parseBeastform(markdown: string): Beastform {
  const doc = parseDoc(markdown);
  const { header, rest } = splitHeader(doc.preamble);
  const h = matchOrThrow(
    /^\*\*_Tier (\d+)_\*\*\s*_\((.*)\)_$/,
    header,
    "beastform header",
  );
  const f = fields(rest);

  const NONE = "<no value>";
  // Legendary/Mythic Beast and Hybrid cards omit some of these fields.
  const traitBonusText = f.get("trait bonus") ?? NONE;
  const evasionText = f.get("evasion bonus") ?? NONE;
  const attackText = f.get("attack") ?? NONE;
  const advantages = f.get("advantages") ?? NONE;
  const featureLines = findSection(doc, /^FEATURES?$/i);

  let traitBonus: Beastform["traitBonus"] = null;
  if (traitBonusText !== NONE) {
    const m = matchOrThrow(
      /^(\w+)\s+([+-]\d+)$/,
      traitBonusText,
      "trait bonus",
    );
    traitBonus = {
      trait: oneOf(traits, m[1].toLowerCase(), "trait"),
      bonus: int(m[2], "trait bonus"),
    };
  }

  let evasionBonus: number | null = null;
  if (evasionText !== NONE) {
    evasionBonus = int(
      matchOrThrow(/^Evasion\s+([+-]\d+)$/, evasionText, "evasion bonus")[1],
      "evasion bonus",
    );
  }

  // The SRD writes this as "Strength Melee d12+10 phy" or "Melee Agility d4 phy".
  let attack: Beastform["attack"] = null;
  if (attackText !== NONE) {
    const RANGE = "Very Close|Very Far|Melee|Close|Far";
    const m = attackText.match(new RegExp(`^(${RANGE})\\s+(\\w+)\\s+(.+)$`)) ??
      attackText.match(new RegExp(`^(\\w+)\\s+(${RANGE})\\s+(.+)$`));
    if (!m) {
      throw new Error(`could not parse attack: ${JSON.stringify(attackText)}`);
    }
    const [traitWord, range] = ranges.includes(m[1] as Range)
      ? [m[2], m[1]]
      : [m[1], m[2]];
    attack = {
      trait: oneOf(traits, traitWord.toLowerCase(), "trait"),
      range: oneOf(ranges, range, "range"),
      ...damageWithType(m[3]),
    };
  }

  return {
    name: doc.title,
    tier: tier(h[1]),
    examples: splitList(h[2]).filter((e) => e.toLowerCase() !== "etc."),
    traitBonus,
    evasionBonus,
    attack,
    advantages: advantages === NONE ? [] : splitList(advantages),
    features: featureLines ? namedFeatures(featureLines) : [],
  };
}
