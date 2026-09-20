export type Consumable = {
    name: string;
    type: "Consumable";
    description: string;
};
export declare function parseConsumable(markdown: string): Consumable;
