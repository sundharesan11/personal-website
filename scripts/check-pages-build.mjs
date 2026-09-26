#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const base = `/${(process.env.SITE_BASE ?? "").replace(/^\/+|\/+$/g, "")}`;
if (base === "/") {
  throw new Error("SITE_BASE is required, for example SITE_BASE=/personal-website");
}

const textExtensions = new Set([".html", ".css", ".js"]);
const files = [];

async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collect(path);
    else if (textExtensions.has(extname(entry.name))) files.push(path);
  }
}

await collect("dist");

const failures = [];
const attributePattern = /(?:href|src)=["'](\/[^"']*)["']/g;
const cssUrlPattern = /url\((?:["']?)(\/[^)"']*)/g;

for (const file of files) {
  const source = await readFile(file, "utf8");
  for (const pattern of [attributePattern, cssUrlPattern]) {
    pattern.lastIndex = 0;
    for (const match of source.matchAll(pattern)) {
      const url = match[1];
      if (!url.startsWith("//") && url !== base && !url.startsWith(`${base}/`)) {
        failures.push(`${file}: ${url}`);
      }
    }
  }
}

if (failures.length) {
  throw new Error(`Found URLs that escape ${base}:\n${failures.join("\n")}`);
}

const home = await readFile("dist/index.html", "utf8");
if (!home.includes(`href="${base}/work"`) || !home.includes(`${base}/img/hero-crop.jpeg`)) {
  throw new Error("The home page is missing expected base-prefixed navigation or imagery");
}

console.log(`GitHub Pages paths verified across ${files.length} generated files.`);
