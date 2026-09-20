// Builds the package and commits it to the `dist` branch, tagged v<N>, where N
// is the previous highest tag + 1. `main` never contains generated output.
// Usage: deno task publish <srd dir> [--push]
import { join } from "@std/path";

const args = Deno.args.filter((a) => a !== "--push");
const push = Deno.args.includes("--push");
const srd = args[0];
if (!srd) {
  console.error("Usage: deno task publish <srd dir> [--push]");
  Deno.exit(1);
}

async function git(cwd: string, ...gitArgs: string[]): Promise<string> {
  const { code, stdout, stderr } = await new Deno.Command("git", {
    args: gitArgs,
    cwd,
  }).output();
  const dec = new TextDecoder();
  if (code !== 0) {
    throw new Error(`git ${gitArgs.join(" ")}: ${dec.decode(stderr)}`);
  }
  return dec.decode(stdout).trim();
}

const repo = Deno.cwd();
if (await git(repo, "status", "--porcelain")) {
  console.error("Working tree is not clean; commit or stash first.");
  Deno.exit(1);
}

await git(repo, "fetch", "origin", "--tags").catch(() => {});
await git(repo, "fetch", "origin", "dist").catch(() => {});

const tags = (await git(repo, "tag", "--list", "v*")).split("\n");
const last = Math.max(
  0,
  ...tags.filter((t) => /^v\d+$/.test(t)).map((t) => +t.slice(1)),
);
const next = last + 1;
const source = await git(repo, "rev-parse", "--short", "HEAD");

const tmp = await Deno.makeTempDir({ prefix: "dh-publish-" });
const built = join(tmp, "built");
const tree = join(tmp, "tree");
try {
  const build = await new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", "scripts/build.ts", srd, built, String(next)],
    stdout: "inherit",
    stderr: "inherit",
  }).output();
  if (build.code !== 0) throw new Error("build failed");

  // Check out the dist branch in a scratch worktree (created orphaned the
  // first time) so the main working tree is never touched.
  const remote = await git(repo, "branch", "-r", "--list", "origin/dist");
  const local = await git(repo, "branch", "--list", "dist");
  if (remote) {
    await git(repo, "worktree", "add", "-B", "dist", tree, "origin/dist");
  } else if (local) await git(repo, "worktree", "add", tree, "dist");
  else await git(repo, "worktree", "add", "--orphan", "-b", "dist", tree);

  for await (const e of Deno.readDir(tree)) {
    if (e.name !== ".git") {
      await Deno.remove(join(tree, e.name), { recursive: true });
    }
  }
  for await (const e of Deno.readDir(built)) {
    await Deno.rename(join(built, e.name), join(tree, e.name));
  }

  await git(tree, "add", "-A");
  await git(
    tree,
    "commit",
    "--allow-empty",
    "-m",
    `v${next} (built from ${source})`,
  );
  await git(tree, "tag", `v${next}`);
  console.log(`committed dist branch and tagged v${next}`);

  if (push) {
    await git(repo, "push", "origin", "dist", `v${next}`);
    console.log("pushed dist and tag");
  } else {
    console.log("not pushed; run: git push origin dist v" + next);
  }
} finally {
  await git(repo, "worktree", "remove", "--force", tree).catch(() => {});
  await Deno.remove(tmp, { recursive: true }).catch(() => {});
}
