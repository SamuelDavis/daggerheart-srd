import { parseDoc, text, withoutTypeMarker } from "../markdown.ts";

export type Item = {
  name: string;
  type: "Item";
  /** Position in the SRD loot table (1-60). */
  roll: number;
  description: string;
};

// **_Item_**
export function parseItem(markdown: string, roll: number): Item {
  const doc = parseDoc(markdown);
  // The marker is usually first, but occasionally follows the text.
  const rest = withoutTypeMarker(doc.preamble, "Item");
  return { name: doc.title, type: "Item", roll, description: text(rest) };
}
