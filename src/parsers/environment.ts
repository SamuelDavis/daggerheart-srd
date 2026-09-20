import {
  type EnvironmentType,
  environmentTypes,
  type Feature,
  type Tier,
} from "../common.ts";
import {
  fields,
  matchOrThrow,
  oneOf,
  parseDoc,
  requireField,
  requireSection,
  splitHeader,
  splitList,
  tier,
  typedFeatures,
} from "../markdown.ts";
import type { Adversary } from "./adversary.ts";

export type Environment = {
  name: string;
  tier: Tier;
  environmentType: EnvironmentType;
  description: string;
  impulses: string[];
  difficulty: string;
  potentialAdversaries: "Any" | Adversary["name"][];
  features: Feature[];
};

// **_Tier 4 Traversal._** _An otherworldly space ..._
export function parseEnvironment(markdown: string): Environment {
  const doc = parseDoc(markdown);
  const { header, rest } = splitHeader(doc.preamble);
  const h = matchOrThrow(
    /^\*\*_Tier (\d+) (\w+)\._\*\*\s*_(.*)_$/,
    header,
    "environment header",
  );
  const f = fields(rest);
  const adversaries = requireField(f, "potential adversaries");

  return {
    name: doc.title,
    tier: tier(h[1]),
    environmentType: oneOf(environmentTypes, h[2], "environment type"),
    description: h[3],
    impulses: splitList(requireField(f, "impulses")),
    difficulty: requireField(f, "difficulty"),
    potentialAdversaries: adversaries === "Any"
      ? "Any"
      : splitList(adversaries),
    features: typedFeatures(requireSection(doc, /^FEATURES?$/i)),
  };
}
