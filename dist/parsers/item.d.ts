export type Item = {
    name: string;
    type: "Item";
    description: string;
};
export declare function parseItem(markdown: string): Item;
