import { type AdversaryThresholds, type ArmorThresholds, type Damage, type DamageType, type NamedFeature, type Tier, type TypedFeature } from "./common.js";
export type Section = {
    heading: string;
    lines: string[];
};
export type Doc = {
    title: string;
    /** Lines between the `# Title` and the first `###` section. */
    preamble: string[];
    sections: Section[];
};
export declare function parseDoc(text: string): Doc;
/** Finds a section whose heading matches, e.g. `/^FEATURES?$/i`. */
export declare function findSection(doc: Doc, heading: RegExp): string[] | undefined;
export declare function requireSection(doc: Doc, heading: RegExp): string[];
export declare function trimBlank(lines: string[]): string[];
/** Joins lines back into text, preserving internal blank lines and newlines. */
export declare function text(lines: string[]): string;
/** Returns the first non-blank line and the lines after it. */
export declare function splitHeader(lines: string[]): {
    header: string;
    rest: string[];
};
export declare function matchOrThrow(re: RegExp, s: string, what: string): RegExpMatchArray;
/** Removes a leading list dash or blockquote marker. */
export declare function stripBullet(line: string): string;
/** Parses `- **Key:** value | **Key2:** value` bullets into a lowercase-keyed map. */
export declare function fields(lines: string[]): Map<string, string>;
export declare function requireField(f: Map<string, string>, key: string): string;
/**
 * Finds a standalone type marker line (e.g. `**_Item_**`, or `*Consumable*` placed
 * after the text) and returns the remaining lines.
 */
export declare function withoutTypeMarker(lines: string[], word: string): string[];
/** Plain bullet items (`- text`) as strings. */
export declare function bullets(lines: string[]): string[];
/** Splits on commas that are not inside parentheses. */
export declare function splitList(s: string): string[];
export declare function oneOf<const T extends readonly unknown[]>(list: T, value: unknown, label: string): T[number];
export declare function int(s: string, label: string): number;
export declare function tier(s: string): Tier;
export declare const DAMAGE_WITH_TYPE: RegExp;
/** "d6+7 mag" -> { damage: "d6+7", damageType: "mag" } */
export declare function damageWithType(s: string): {
    damage: Damage;
    damageType: DamageType;
};
/** "8/15" or "11 / 23" */
export declare function thresholds(s: string): ArmorThresholds;
/** "8/15", "4/None" or "None". */
export declare function adversaryThresholds(s: string): AdversaryThresholds;
/** Features written as `**_Name:_** description`. */
export declare function namedFeatures(lines: string[]): NamedFeature[];
/** Features written as `**_Name - Type:_** description` (type may carry a `: detail`). */
export declare function typedFeatures(lines: string[]): TypedFeature[];
/** Link texts, e.g. `[A](x.md) & [B](y.md)` -> ["A", "B"]. */
export declare function linkTexts(s: string): string[];
