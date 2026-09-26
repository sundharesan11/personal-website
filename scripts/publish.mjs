#!/usr/bin/env node
// Publish the working copy: build (the schema gate), then commit and push.
// Usage: npm run publish [-- "commit message"]
// GitHub Pages deploys pushes to main through .github/workflows/deploy.yml.

import { execSync } from "node:child_process";

const run = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", ...opts });
const out = (cmd) => execSync(cmd, { encoding: "utf8" }).trim();

const status = out("git status --porcelain");
if (!status) {
  console.log("Nothing to publish: working tree is clean.");
  process.exit(0);
}

console.log("Changes to publish:\n" + status + "\n");

console.log("Running the build gate (zod validates every entry)…");
run("npm run build");

const changedContent = status
  .split("\n")
  .map((l) => l.slice(3))
  .filter((f) => f.startsWith("src/content/"));

const custom = process.argv[2];
const message =
  custom ??
  (changedContent.length
    ? `content: ${changedContent.map((f) => f.split("/").pop().replace(/\.mdx?$/, "")).join(", ")}`
    : "site: update");

run("git add -A");
run(`git commit -m ${JSON.stringify(message)}`);

try {
  run("git push");
  console.log("\nPublished. Pushes to main deploy through GitHub Pages.");
} catch {
  console.error("\nCommitted locally, but the push failed (no remote or no network). Run `git push` when ready.");
  process.exit(1);
}
