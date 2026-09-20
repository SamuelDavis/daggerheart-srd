import { type CardType, cardTypes, domains } from "../common.ts";
import {
  int,
  matchOrThrow,
  oneOf,
  parseDoc,
  splitHeader,
  text,
} from "../markdown.ts";
import type { Domain } from "./domain.ts";

export type Ability = {
  name: string;
  level: number;
  domain: Domain["name"];
  cardType: CardType;
  recallCost: number;
  description: string;
};

// **_Level 5_** _Splendor Spell._ **_Recall Cost_** _2._
export function parseAbility(markdown: string): Ability {
  const doc = parseDoc(markdown);
  const { header, rest } = splitHeader(doc.preamble);
  const m = matchOrThrow(
    /^\*\*_Level (\d+)_\*\*\s+_(\w+) (\w+)\._\s+\*\*_Recall Cost_\*\*\s+_(\d+)\._$/,
    header,
    "ability header",
  );
  return {
    name: doc.title,
    level: int(m[1], "level"),
    domain: oneOf(domains, m[2], "domain"),
    cardType: oneOf(cardTypes, m[3], "card type"),
    recallCost: int(m[4], "recall cost"),
    description: text([
      ...rest,
      ...doc.sections.flatMap((s) => [`### ${s.heading}`, ...s.lines]),
    ]),
  };
}
