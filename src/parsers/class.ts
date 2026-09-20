import {
  type DomainName,
  domains,
  type NamedFeature,
  type Trait,
  traits,
} from "../common.ts";
import {
  bullets,
  fields,
  int,
  linkTexts,
  namedFeatures,
  oneOf,
  parseDoc,
  requireField,
  requireSection,
  splitList,
  text,
} from "../markdown.ts";

export type Class = {
  name: string;
  description: string;
  domains: DomainName[];
  startingEvasion: number;
  startingHitPoints: number;
  classItems: string;
  suggestedTraits: Record<Trait, number>;
  suggestedPrimary: string;
  /** null when the class suggests no secondary weapon. */
  suggestedSecondary: string | null;
  suggestedArmor: string;
  hopeFeature: NamedFeature;
  classFeatures: NamedFeature[];
  subclasses: string[];
  backgroundQuestions: string[];
  connections: string[];
};

export function parseClass(markdown: string): Class {
  const doc = parseDoc(markdown);
  const f = fields(doc.preamble);

  const firstRule = doc.preamble.findIndex((l) => l.trim() === "---");
  const description = text(
    firstRule < 0 ? doc.preamble : doc.preamble.slice(0, firstRule),
  );

  // Suggested traits are listed in the same order as `traits`.
  const traitValues = splitList(requireField(f, "suggested traits")).map((v) =>
    int(v, "suggested trait")
  );
  if (traitValues.length !== traits.length) {
    throw new Error(
      `expected ${traits.length} suggested traits, got ${traitValues.length}`,
    );
  }
  const suggestedTraits = Object.fromEntries(
    traits.map((t, i) => [t, traitValues[i]]),
  ) as Record<Trait, number>;

  const hopeFeatures = namedFeatures(requireSection(doc, /^HOPE FEATURE$/i));
  if (hopeFeatures.length !== 1) {
    throw new Error(`expected 1 hope feature, got ${hopeFeatures.length}`);
  }

  return {
    name: doc.title,
    description,
    domains: linkTexts(requireField(f, "domains")).map((d) =>
      oneOf(domains, d, "domain")
    ),
    startingEvasion: int(
      requireField(f, "starting evasion"),
      "starting evasion",
    ),
    startingHitPoints: int(
      requireField(f, "starting hit points"),
      "starting hit points",
    ),
    classItems: requireField(f, "class items"),
    suggestedTraits,
    suggestedPrimary: requireField(f, "suggested primary"),
    suggestedSecondary: f.get("suggested secondary") ?? null,
    suggestedArmor: requireField(f, "suggested armor"),
    hopeFeature: hopeFeatures[0],
    classFeatures: namedFeatures(requireSection(doc, /^CLASS FEATURES?$/i)),
    subclasses: linkTexts(text(requireSection(doc, /^SUBCLASSES$/i))),
    backgroundQuestions: bullets(
      requireSection(doc, /^BACKGROUND QUESTIONS$/i),
    ),
    connections: bullets(requireSection(doc, /^CONNECTIONS$/i)),
  };
}
