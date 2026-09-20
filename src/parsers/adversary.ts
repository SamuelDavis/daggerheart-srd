import {
  type AdversaryThresholds,
  type AdversaryType,
  adversaryTypes,
  type AttackBonus,
  type Damage,
  type DamageType,
  type Feature,
  type Range,
  ranges,
  type Tier,
} from "../common.ts";
import {
  adversaryThresholds,
  damageWithType,
  fields,
  int,
  matchOrThrow,
  oneOf,
  parseDoc,
  requireField,
  requireSection,
  splitHeader,
  splitList,
  stripBullet,
  tier,
  typedFeatures,
} from "../markdown.ts";

export type Adversary = {
  name: string;
  tier: Tier;
  adversaryType: AdversaryType;
  /** Text in parentheses after the type, e.g. "2/HP" for `Horde (2/HP)`. */
  typeDetail?: string;
  description: string;
  motivesAndTactics: string[];
  difficulty: number;
  thresholds: AdversaryThresholds;
  hp: number;
  stress: number;
  attack: {
    bonus: AttackBonus;
    name: string;
    range: Range;
    damage: Damage;
    damageType: DamageType;
  };
  experiences: { name: string; bonus: number }[];
  features: Feature[];
};

// **_Tier 1 Solo._** _A massive humanoid who sees all sapient life as food._
// (Variants: `Horde (2/HP)`, and a description on the following line.)
export function parseAdversary(markdown: string): Adversary {
  const doc = parseDoc(markdown);
  const { header, rest } = splitHeader(doc.preamble);
  const h = matchOrThrow(
    /^\*\*_Tier (\d+) (\w+)(?: \((.*?)\))?\.?_\*\*\s*(?:_(.*)_)?$/,
    header,
    "adversary header",
  );
  const description = h[4] ??
    rest.map((l) => l.trim().match(/^_(.*)_$/)?.[1]).find((d) =>
      d !== undefined
    );
  if (description === undefined) throw new Error("missing description");
  const f = fields(rest);

  const atkLine = rest.map(stripBullet).find((l) => l.startsWith("**ATK:**"));
  if (!atkLine) throw new Error("missing ATK line");
  // **ATK:** +1 | **Club:** Very Close | 1d10+2 phy
  const atk = matchOrThrow(
    /^\*\*ATK:\*\*\s*([+-]\S+)\s*\|\s*\*\*(.+?):\*\*\s*(.+?)\s*\|\s*(.+?)\s*$/,
    atkLine,
    "attack",
  );

  const experience = f.get("experience");

  return {
    name: doc.title,
    tier: tier(h[1]),
    adversaryType: oneOf(adversaryTypes, h[2], "adversary type"),
    ...(h[3] !== undefined ? { typeDetail: h[3] } : {}),
    description,
    motivesAndTactics: splitList(requireField(f, "motives & tactics")),
    difficulty: int(requireField(f, "difficulty"), "difficulty"),
    thresholds: adversaryThresholds(requireField(f, "thresholds")),
    hp: int(requireField(f, "hp"), "hp"),
    stress: int(requireField(f, "stress"), "stress"),
    attack: {
      bonus: atk[1] as AttackBonus,
      name: atk[2],
      range: oneOf(ranges, atk[3], "range"),
      ...damageWithType(atk[4]),
    },
    experiences: experience
      ? splitList(experience).map((e) => {
        const m = matchOrThrow(/^(.+?)\s+([+-]\d+)$/, e, "experience");
        return { name: m[1], bonus: int(m[2], "experience bonus") };
      })
      : [],
    features: typedFeatures(requireSection(doc, /^FEATURES?$/i)),
  };
}
