import { parseDoc, text, withoutTypeMarker } from "../markdown.ts";
import type { Consumable } from "../types/consumable.ts";

export function parseConsumable(markdown: string, roll: number): Consumable {
  const doc = parseDoc(markdown);
  // The marker is usually first, but occasionally follows the text.
  const rest = withoutTypeMarker(doc.preamble, "Consumable");
  return { name: doc.title, type: "Consumable", roll, description: text(rest) };
}
