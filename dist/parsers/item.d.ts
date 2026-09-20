export type Item = {
    name: string;
    type: "Item";
    /** Position in the SRD loot table (1-60). */
    roll: number;
    description: string;
};
export declare function parseItem(markdown: string, roll: number): Item;
