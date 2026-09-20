import { parseDoc, text, withoutTypeMarker } from "../markdown.ts";

export type Consumable = {
  name: string;
  type: "Consumable";
  /** Position in the SRD loot table (1-60). */
  roll: number;
  description: string;
};

// **_Consumable_**
export function parseConsumable(markdown: string, roll: number): Consumable {
  const doc = parseDoc(markdown);
  // The marker is usually first, but occasionally follows the text.
  const rest = withoutTypeMarker(doc.preamble, "Consumable");
  return { name: doc.title, type: "Consumable", roll, description: text(rest) };
}
