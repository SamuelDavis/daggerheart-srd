import type { CardType } from "../common.js";
import type { Domain } from "./domain.js";
export type Ability = {
    name: string;
    level: number;
    domain: Domain["name"];
    cardType: CardType;
    recallCost: number;
    description: string;
};
