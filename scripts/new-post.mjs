#!/usr/bin/env node
// Scaffold a new writing or reading entry with schema-correct frontmatter.
// Usage: npm run new
// Prompts for everything; enums mirror src/content.config.ts.

import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const LENSES = ["theatrical", "economics", "technical"];
const STATUSES = ["writing", "published"];

// Buffered line reader: works the same for a terminal and for piped input.
const rl = createInterface({ input: stdin });
const pending = [];
const waiters = [];
let stdinDone = false;
rl.on("line", (l) => {
  const w = waiters.shift();
  if (w) w(l);
  else pending.push(l);
});
rl.on("close", () => {
  stdinDone = true;
  waiters.splice(0).forEach((w) => w(null));
});
function nextLine(prompt) {
  stdout.write(prompt);
  if (pending.length) return Promise.resolve(pending.shift());
  if (stdinDone) return Promise.resolve(null);
  return new Promise((res) => waiters.push(res));
}

const slugify = (s) =>
  s.toLowerCase().trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function ask(question, { choices, fallback } = {}) {
  const hint = choices ? ` (${choices.join(" / ")})` : fallback !== undefined ? ` [${fallback}]` : "";
  while (true) {
    const line = await nextLine(`${question}${hint}: `);
    const answer = (line ?? "").trim();
    if (line !== null && !stdin.isTTY) stdout.write(`${answer}\n`);
    if (!answer && fallback !== undefined) return fallback;
    if (line === null) {
      console.error("\nInput ended before all questions were answered.");
      process.exit(1);
    }
    if (!choices) {
      if (answer) return answer;
      continue;
    }
    const match = choices.find((c) => c === answer.toLowerCase());
    if (match) return match;
    console.log(`  Pick one of: ${choices.join(", ")}`);
  }
}

const quote = (s) => `"${s.replace(/"/g, '\\"')}"`;
const today = new Date().toISOString().slice(0, 10);

const kind = await ask("New entry", { choices: ["writing", "reading"] });

let path, frontmatter, body, closing;

if (kind === "writing") {
  const title = await ask("Title");
  const description = await ask("Description (the dek, one sentence)");
  const lens = await ask("Lens", { choices: LENSES });
  const status = await ask("Status", { choices: STATUSES, fallback: "writing" });
  const draft = (await ask("Private draft? hidden everywhere", { choices: ["no", "yes"], fallback: "no" })) === "yes";
  const slug = slugify(await ask("Slug", { fallback: slugify(title) }));

  path = resolve(`src/content/writing/${slug}.md`);
  frontmatter = [
    `title: ${quote(title)}`,
    `description: ${quote(description)}`,
    `date: ${today}`,
    ...(draft ? ["draft: true"] : []),
    `lens: ${lens}`,
    `status: ${status}`,
  ].join("\n");
  body = "\nStart here.\n";
  closing = `Workflow: draft privately with "draft: true" · show on the being-written desk with "status: writing" · flip to "status: published" (and bump the date) to ship.`;
} else {
  const title = await ask("Book title");
  const author = await ask("Author");
  const note = await ask("Note (what it did to you)");
  const question = await ask("Question it opened (optional)", { fallback: "" });
  const opened = await ask("Group (the 'opened' heading on /reading)");
  const status = await ask("Status", { choices: ["read", "on-deck"], fallback: "read" });
  const slug = slugify(await ask("Slug", { fallback: slugify(title) }));

  path = resolve(`src/content/reading/${slug}.md`);
  frontmatter = [
    `title: ${quote(title)}`,
    `author: ${quote(author)}`,
    `note: ${quote(note)}`,
    ...(question ? [`question: ${quote(question)}`] : []),
    `status: ${status}`,
    `opened: ${quote(opened)}`,
    `order: 0`,
  ].join("\n");
  body = "";
  closing = `It will appear on /reading under "${opened}" after the next build.`;
}

rl.close();

if (existsSync(path)) {
  console.error(`\nRefusing to overwrite ${path}`);
  process.exit(1);
}

await writeFile(path, `---\n${frontmatter}\n---\n${body}`);
console.log(`\nCreated ${path}`);
console.log(closing);
