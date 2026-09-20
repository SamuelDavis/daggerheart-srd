// Builds the publishable package into <out>: JSON data, JS + .d.ts, package.json.
// Usage: deno run -A scripts/build.ts <srd dir> <out dir> <version number>
import { join, resolve } from "@std/path";

const [srdArg, outArg, versionArg] = Deno.args;
if (!srdArg || !outArg || !versionArg) {
  console.error("Usage: build.ts <srd dir> <out dir> <version number>");
  Deno.exit(1);
}
const srd = resolve(srdArg);
const out = resolve(outArg);

async function run(cmd: string, args: string[]) {
  const { code } = await new Deno.Command(cmd, {
    args,
    stdout: "inherit",
    stderr: "inherit",
  }).output();
  if (code !== 0) throw new Error(`${cmd} ${args.join(" ")} failed (${code})`);
}

await Deno.remove(out, { recursive: true }).catch(() => {});
await Deno.mkdir(out, { recursive: true });

// 1. Parsed data.
await run(Deno.execPath(), [
  "run",
  "--allow-read",
  "--allow-write",
  "main.ts",
  srd,
  join(out, "data"),
]);

// 2. Types + constants. Declarations for everything; JS only for the modules
// consumers import at runtime (parser JS would need Deno-only dependencies).
await run(Deno.execPath(), [
  "run",
  "-A",
  "npm:typescript/tsc",
  "src/index.ts",
  "--outDir",
  join(out, "dist"),
  "--declaration",
  "--target",
  "es2022",
  "--module",
  "esnext",
  "--moduleResolution",
  "bundler",
  "--allowImportingTsExtensions",
  "--rewriteRelativeImportExtensions",
  "--skipLibCheck",
  "--strict",
]);
for await (const f of Deno.readDir(join(out, "dist"))) {
  const keep = f.name === "index.js" || f.name === "common.js" ||
    f.name === "character.js" ||
    f.name.endsWith(".d.ts") || f.isDirectory;
  if (!keep) await Deno.remove(join(out, "dist", f.name));
}
for await (const f of Deno.readDir(join(out, "dist", "parsers"))) {
  if (f.name.endsWith(".js")) {
    await Deno.remove(join(out, "dist", "parsers", f.name));
  }
}

// tsc leaves ".ts" specifiers in declarations; point them at ".js" instead.
async function fixDeclarations(dir: string) {
  for await (const f of Deno.readDir(dir)) {
    const path = join(dir, f.name);
    if (f.isDirectory) await fixDeclarations(path);
    else if (f.name.endsWith(".d.ts")) {
      const text = await Deno.readTextFile(path);
      await Deno.writeTextFile(
        path,
        text.replace(/(from "\.[^"]*)\.ts"/g, '$1.js"'),
      );
    }
  }
}
await fixDeclarations(join(out, "dist"));

// 3. package.json
const pkg = {
  name: "@samueldavis/daggerheart-srd",
  version: `${versionArg}.0.0`,
  type: "module",
  types: "./dist/index.d.ts",
  exports: {
    ".": { types: "./dist/index.d.ts", default: "./dist/index.js" },
    "./data/*": "./data/*.json",
  },
  files: ["dist", "data"],
};
await Deno.writeTextFile(
  join(out, "package.json"),
  JSON.stringify(pkg, null, 2) + "\n",
);
console.log(`built v${versionArg} in ${out}`);
