import { parseDoc, text, withoutTypeMarker } from "../markdown.ts";

export type Consumable = {
  name: string;
  type: "Consumable";
  description: string;
};

// **_Consumable_**
export function parseConsumable(markdown: string): Consumable {
  const doc = parseDoc(markdown);
  // The marker is usually first, but occasionally follows the text.
  const rest = withoutTypeMarker(doc.preamble, "Consumable");
  return { name: doc.title, type: "Consumable", description: text(rest) };
}
