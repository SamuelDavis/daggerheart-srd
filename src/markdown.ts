// Small helpers shared by the per-type parsers. The SRD markdown is very regular,
// so these are line/regex based rather than a full markdown parser.

import {
  type AdversaryThresholds,
  type Damage,
  type DamageType,
  damageTypes,
  type Feature,
  featureTypes,
  type NamedFeature,
  type Thresholds,
  type Tier,
  tiers,
} from "./common.ts";

export type Section = { heading: string; lines: string[] };
export type Doc = {
  title: string;
  /** Lines between the `# Title` and the first `###` section. */
  preamble: string[];
  sections: Section[];
};

export function parseDoc(text: string): Doc {
  const lines = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").split("\n");
  const titleIdx = lines.findIndex((l) => l.startsWith("# "));
  if (titleIdx < 0) throw new Error("missing '# ' title");
  const rawTitle = lines[titleIdx].slice(2).trim();
  // A couple of files have ALL-CAPS titles; normalise those to Title Case.
  const title = rawTitle === rawTitle.toUpperCase()
    ? rawTitle.toLowerCase().replace(
      /(^|\s)(\p{L})/gu,
      (_, sp, c) => sp + c.toUpperCase(),
    )
    : rawTitle;

  const preamble: string[] = [];
  const sections: Section[] = [];
  let current: string[] = preamble;
  for (const line of lines.slice(titleIdx + 1)) {
    if (/^#{2,3}\s/.test(line)) {
      const section = {
        heading: line.replace(/^#+\s*/, "").trim(),
        lines: [] as string[],
      };
      sections.push(section);
      current = section.lines;
    } else {
      current.push(line);
    }
  }
  return { title, preamble, sections };
}

/** Finds a section whose heading matches, e.g. `/^FEATURES?$/i`. */
export function findSection(doc: Doc, heading: RegExp): string[] | undefined {
  return doc.sections.find((s) => heading.test(s.heading))?.lines;
}

export function requireSection(doc: Doc, heading: RegExp): string[] {
  const lines = findSection(doc, heading);
  if (!lines) throw new Error(`missing section matching ${heading}`);
  return lines;
}

export function trimBlank(lines: string[]): string[] {
  let start = 0;
  let end = lines.length;
  while (start < end && lines[start].trim() === "") start++;
  while (end > start && lines[end - 1].trim() === "") end--;
  return lines.slice(start, end);
}

/** Joins lines back into text, preserving internal blank lines and newlines. */
export function text(lines: string[]): string {
  return trimBlank(lines).map((l) => l.trimEnd()).join("\n");
}

/** Index of the first non-blank line. */
function firstContent(lines: string[]): number {
  const i = lines.findIndex((l) => l.trim() !== "");
  if (i < 0) throw new Error("expected content, found none");
  return i;
}

/** Returns the first non-blank line and the lines after it. */
export function splitHeader(
  lines: string[],
): { header: string; rest: string[] } {
  const i = firstContent(lines);
  return { header: lines[i].trim(), rest: lines.slice(i + 1) };
}

export function matchOrThrow(
  re: RegExp,
  s: string,
  what: string,
): RegExpMatchArray {
  const m = s.match(re);
  if (!m) throw new Error(`could not parse ${what}: ${JSON.stringify(s)}`);
  return m;
}

/** Removes a leading list dash or blockquote marker. */
export function stripBullet(line: string): string {
  return line.replace(/^(?:>\s*|-\s+)/, "");
}

/** Parses `- **Key:** value | **Key2:** value` bullets into a lowercase-keyed map. */
export function fields(lines: string[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of lines) {
    for (const piece of stripBullet(line).split(" | ")) {
      const m = piece.match(/^\*\*(.+?)(?::| -)\*\*\s*(.*)$/);
      if (m) map.set(m[1].trim().toLowerCase(), m[2].trim());
    }
  }
  return map;
}

export function requireField(f: Map<string, string>, key: string): string {
  const v = f.get(key);
  if (v === undefined) throw new Error(`missing field '${key}'`);
  return v;
}

/**
 * Finds a standalone type marker line (e.g. `**_Item_**`, or `*Consumable*` placed
 * after the text) and returns the remaining lines.
 */
export function withoutTypeMarker(lines: string[], word: string): string[] {
  const marker = new RegExp(`^\\*{1,2}_?${word}_?\\*{1,2}$`, "i");
  const i = lines.findIndex((l) => marker.test(l.trim()));
  if (i < 0) throw new Error(`missing '${word}' marker line`);
  return [...lines.slice(0, i), ...lines.slice(i + 1)];
}

/** Plain bullet items (`- text`) as strings. */
export function bullets(lines: string[]): string[] {
  return lines.filter((l) => l.startsWith("- ")).map((l) => l.slice(2).trim());
}

/** Splits on commas that are not inside parentheses. */
export function splitList(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

export function oneOf<const T extends readonly unknown[]>(
  list: T,
  value: unknown,
  label: string,
): T[number] {
  if (!list.includes(value)) {
    throw new Error(
      `invalid ${label}: ${JSON.stringify(value)} (expected one of ${
        list.join(", ")
      })`,
    );
  }
  return value as T[number];
}

export function int(s: string, label: string): number {
  if (!/^[+-]?\d+$/.test(s.trim())) {
    throw new Error(`invalid ${label}: ${JSON.stringify(s)}`);
  }
  return Number(s);
}

export function tier(s: string): Tier {
  return oneOf(tiers, int(s, "tier"), "tier");
}

export const DAMAGE_WITH_TYPE =
  /^(\d*d\d+(?:[+-]\d+)?|\d+)\s+(phy or mag|[\w/]+)$/;

/** "d6+7 mag" -> { damage: "d6+7", damageType: "mag" } */
export function damageWithType(
  s: string,
): { damage: Damage; damageType: DamageType } {
  const m = matchOrThrow(DAMAGE_WITH_TYPE, s.trim(), "damage");
  return {
    damage: m[1] as Damage,
    damageType: oneOf(damageTypes, m[2], "damage type"),
  };
}

/** "8/15" or "11 / 23" */
export function thresholds(s: string): Thresholds {
  const m = matchOrThrow(/^(\d+)\s*\/\s*(\d+)$/, s.trim(), "thresholds");
  return { major: Number(m[1]), severe: Number(m[2]) };
}

/** "8/15", "4/None" or "None". */
export function adversaryThresholds(s: string): AdversaryThresholds {
  const side = (v: string) => (/^none$/i.test(v) ? null : int(v, "threshold"));
  const parts = s.split("/").map((p) => p.trim());
  if (parts.length === 1 && /^none$/i.test(parts[0])) {
    return { major: null, severe: null };
  }
  if (parts.length !== 2) {
    throw new Error(`could not parse thresholds: ${JSON.stringify(s)}`);
  }
  return { major: side(parts[0]), severe: side(parts[1]) };
}

type RawFeature = { heading: string; description: string };

const FEATURE_LINE = /^\*\*_(.+?):_\*\*\s*(.*)$/;

/**
 * Splits lines into `**_Heading:_** description` blocks. A block's description runs
 * to the next feature line, with newlines (including blank lines) preserved.
 */
function rawFeatures(lines: string[]): RawFeature[] {
  const out: { heading: string; lines: string[] }[] = [];
  for (const line of lines) {
    const m = line.match(FEATURE_LINE);
    if (m) {
      out.push({ heading: m[1].trim(), lines: [m[2]] });
    } else if (out.length > 0) {
      out[out.length - 1].lines.push(line);
    } else if (line.trim() !== "") {
      throw new Error(
        `unexpected text before first feature: ${JSON.stringify(line)}`,
      );
    }
  }
  return out.map((f) => ({ heading: f.heading, description: text(f.lines) }));
}

/** Features written as `**_Name:_** description`. */
export function namedFeatures(lines: string[]): NamedFeature[] {
  return rawFeatures(lines).map((f) => ({
    name: f.heading,
    description: f.description,
  }));
}

/** Features written as `**_Name - Type:_** description` (type may carry a `: detail`). */
export function typedFeatures(lines: string[]): Feature[] {
  return rawFeatures(lines).map((f) => {
    // "Name - Type" or "Name - Type: detail"; tolerates "Name- Type".
    const m = f.heading.match(/^(.*?)\s*-\s*(\w+)(?::\s*(.*))?$/);
    if (!m) {
      throw new Error(`feature has no type: ${JSON.stringify(f.heading)}`);
    }
    const name = m[1].trim();
    const type = oneOf(
      featureTypes,
      m[2].toLowerCase(),
      `type of feature '${name}'`,
    );
    const detail = m[3]?.trim();
    return {
      name,
      type,
      ...(detail ? { detail } : {}),
      description: f.description,
    };
  });
}

/** Link texts, e.g. `[A](x.md) & [B](y.md)` -> ["A", "B"]. */
export function linkTexts(s: string): string[] {
  return [...s.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1]);
}
