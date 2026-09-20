import type { DomainName } from "../common.js";
import type { Ability } from "./ability.js";
export type Domain = {
    /** Official domains only for now; widen here to allow custom domains. */
    name: DomainName;
    description: string;
    /** One entry per level; `abilities` are ability names, in column order. */
    cards: {
        level: number;
        abilities: Ability["name"][];
    }[];
};
