import { parseDoc, text, withoutTypeMarker } from "../markdown.ts";

export type Item = {
  name: string;
  type: "Item";
  description: string;
};

// **_Item_**
export function parseItem(markdown: string): Item {
  const doc = parseDoc(markdown);
  // The marker is usually first, but occasionally follows the text.
  const rest = withoutTypeMarker(doc.preamble, "Item");
  return { name: doc.title, type: "Item", description: text(rest) };
}
