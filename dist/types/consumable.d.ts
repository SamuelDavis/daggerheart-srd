export type Consumable = {
    name: string;
    type: "Consumable";
    /** Position in the SRD loot table (1-60). */
    roll: number;
    description: string;
};
