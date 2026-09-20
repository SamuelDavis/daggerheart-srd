import { join, resolve } from "@std/path";
import { parsers } from "./src/parsers/mod.ts";

const USAGE =
  "Usage: parse-daggerheart <parent directory containing the type directories> [output directory (default: CWD)]";

async function main(args: string[]): Promise<number> {
  if (
    args.length < 1 || args.length > 2 ||
    args.some((a) => a === "-h" || a === "--help")
  ) {
    console.error(USAGE);
    return args.length === 0 ? 1 : 0;
  }
  const inputDir = resolve(args[0]);
  const outputDir = resolve(args[1] ?? Deno.cwd());

  const typeDirs: string[] = [];
  for await (const entry of Deno.readDir(inputDir)) {
    if (entry.isDirectory) typeDirs.push(entry.name);
  }
  typeDirs.sort();

  // Type directories are independent, so process them concurrently. Each task
  // returns its output rather than printing, so the log order stays deterministic.
  const results = await Promise.all(
    typeDirs.map((dir) => processDir(dir, inputDir, outputDir)),
  );

  for (const r of results) {
    for (const line of r.out) console.log(line);
    for (const line of r.err) console.error(line);
  }
  return results.some((r) => r.failed) ? 1 : 0;
}

type DirResult = { out: string[]; err: string[]; failed: boolean };

async function processDir(
  dir: string,
  inputDir: string,
  outputDir: string,
): Promise<DirResult> {
  const parse = parsers[dir];
  if (!parse) {
    return { out: [`skip   ${dir} (no parser)`], err: [], failed: false };
  }

  const files: string[] = [];
  for await (const entry of Deno.readDir(join(inputDir, dir))) {
    if (entry.isFile && entry.name.endsWith(".md")) files.push(entry.name);
  }
  files.sort();

  // Files are independent too; allSettled keeps every per-file error.
  const settled = await Promise.allSettled(
    files.map(async (file) =>
      parse(await Deno.readTextFile(join(inputDir, dir, file)))
    ),
  );

  const parsed: unknown[] = [];
  const errors: string[] = [];
  settled.forEach((r, i) => {
    if (r.status === "fulfilled") parsed.push(r.value);
    else {
      const msg = r.reason instanceof Error ? r.reason.message : r.reason;
      errors.push(`  ${dir}/${files[i]}: ${msg}`);
    }
  });

  if (errors.length > 0) {
    return {
      out: [],
      err: [
        `FAILED ${dir} (${errors.length}/${files.length} files)`,
        ...errors,
      ],
      failed: true,
    };
  }

  await Deno.mkdir(outputDir, { recursive: true });
  const outPath = join(outputDir, `${dir}.json`);
  await Deno.writeTextFile(outPath, JSON.stringify(parsed, null, 2) + "\n");
  return {
    out: [`wrote  ${outPath} (${parsed.length})`],
    err: [],
    failed: false,
  };
}

Deno.exit(await main(Deno.args));
