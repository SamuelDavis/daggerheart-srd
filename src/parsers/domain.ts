import { type DomainName, domains } from "../common.ts";
import {
  int,
  linkTexts,
  matchOrThrow,
  oneOf,
  parseDoc,
  text,
} from "../markdown.ts";
import type { Ability } from "./ability.ts";

export type Domain = {
  /** Official domains only for now; widen here to allow custom domains. */
  name: DomainName;
  description: string;
  /** One entry per level; `abilities` are ability names, in column order. */
  cards: { level: number; abilities: Ability["name"][] }[];
};

export function parseDomain(markdown: string): Domain {
  const doc = parseDoc(markdown);
  // Some domain files (Valor) have an explanatory "DOMAIN CARDS" section before the table.
  const rows = doc.sections
    .filter((s) => /^DOMAIN CARDS$/i.test(s.heading))
    .flatMap((s) => s.lines)
    .filter((l) => l.trim().startsWith("|"));

  // Skip the header row and the `:---:` separator row.
  const cards = rows.slice(2).map((row) => {
    const cells = row.trim().replace(/^\||\|$/g, "").split("|").map((c) =>
      c.trim()
    );
    const level = matchOrThrow(
      /^\*\*(\d+)\*\*$/,
      cells[0],
      "domain card level",
    );
    return {
      level: int(level[1], "level"),
      abilities: cells.slice(1).flatMap(linkTexts),
    };
  });
  if (cards.length === 0) throw new Error("no domain cards found");

  return {
    name: oneOf(domains, doc.title, "domain"),
    description: text(doc.preamble),
    cards,
  };
}
