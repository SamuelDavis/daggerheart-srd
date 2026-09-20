import { parseDoc, text, withoutTypeMarker } from "../markdown.ts";
import type { Item } from "../types/item.ts";

export function parseItem(markdown: string, roll: number): Item {
  const doc = parseDoc(markdown);
  // The marker is usually first, but occasionally follows the text.
  const rest = withoutTypeMarker(doc.preamble, "Item");
  return { name: doc.title, type: "Item", roll, description: text(rest) };
}
