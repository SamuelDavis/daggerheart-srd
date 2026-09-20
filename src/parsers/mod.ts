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

/** Extra input for parsers whose data lives outside their own file. */
export type ParseContext = {
  /** Path relative to the SRD root, e.g. "items/Torch.md". */
  path: string;
  /** Loot table rolls from the README, keyed by path. */
  rolls: Map<string, number>;
};

function rollOf(ctx: ParseContext): number {
  const roll = ctx.rolls.get(ctx.path);
  if (roll === undefined) throw new Error("not found in a README loot table");
  return roll;
}

/** Parser per SRD directory name. Each writes `<directory>.json`. */
export const parsers: Record<
  string,
  (markdown: string, ctx: ParseContext) => unknown
> = {
  abilities: parseAbility,
  adversaries: parseAdversary,
  ancestries: parseAncestry,
  armor: parseArmor,
  beastforms: parseBeastform,
  classes: parseClass,
  communities: parseCommunity,
  consumables: (md, ctx) => parseConsumable(md, rollOf(ctx)),
  domains: parseDomain,
  environments: parseEnvironment,
  items: (md, ctx) => parseItem(md, rollOf(ctx)),
  subclasses: parseSubclass,
  transformations: parseTransformation,
  weapons: parseWeapon,
};
