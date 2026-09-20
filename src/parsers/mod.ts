import { parseAbility } from "./ability.ts";
import { parseAdversary } from "./adversary.ts";
import { parseAncestry } from "./ancestry.ts";
import { parseArmor } from "./armor.ts";
import { parseBeastform } from "./beastform.ts";
import { parseClass } from "./class.ts";
import { parseCommunity } from "./community.ts";
import { parseConsumable } from "./consumable.ts";
import { parseDomain } from "./domain.ts";
import { parseEnvironment } from "./environment.ts";
import { parseItem } from "./item.ts";
import { parseSubclass } from "./subclass.ts";
import { parseTransformation } from "./transformation.ts";
import { parseWeapon } from "./weapon.ts";

/** Parser per SRD directory name. Each writes `<directory>.json`. */
export const parsers: Record<string, (markdown: string) => unknown> = {
  abilities: parseAbility,
  adversaries: parseAdversary,
  ancestries: parseAncestry,
  armor: parseArmor,
  beastforms: parseBeastform,
  classes: parseClass,
  communities: parseCommunity,
  consumables: parseConsumable,
  domains: parseDomain,
  environments: parseEnvironment,
  items: parseItem,
  subclasses: parseSubclass,
  transformations: parseTransformation,
  weapons: parseWeapon,
};

export * from "./ability.ts";
export * from "./adversary.ts";
export * from "./ancestry.ts";
export * from "./armor.ts";
export * from "./beastform.ts";
export * from "./class.ts";
export * from "./community.ts";
export * from "./consumable.ts";
export * from "./domain.ts";
export * from "./environment.ts";
export * from "./item.ts";
export * from "./subclass.ts";
export * from "./transformation.ts";
export * from "./weapon.ts";
