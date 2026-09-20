import type { CardType } from "../common.ts";
import type { Domain } from "./domain.ts";

export type Ability = {
  name: string;
  level: number;
  domain: Domain["name"];
  cardType: CardType;
  recallCost: number;
  description: string;
};

// **_Level 5_** _Splendor Spell._ **_Recall Cost_** _2._
