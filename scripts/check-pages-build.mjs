#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const configuredBase = (process.env.SITE_BASE ?? "").replace(/^\/+|\/+$/g, "");
const base = configuredBase ? `/${configuredBase}` : "";

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
const staleReferences = [];
let hasLegacyRedirect = false;
const attributePattern = /(?:href|src)=["'](\/[^"']*)["']/g;
const cssUrlPattern = /url\((?:["']?)(\/[^)"']*)/g;
const legacyProjectPath = "/personal-website";

for (const file of files) {
  const source = await readFile(file, "utf8");
  if (!base) {
    const containsLegacyPath = source.includes(legacyProjectPath)
      || source.includes("github.io/personal-website");
    const isMigrationRedirect = source.includes(legacyProjectPath)
      && source.includes("location.replace");
    if (isMigrationRedirect) hasLegacyRedirect = true;
    else if (containsLegacyPath) staleReferences.push(file);
  }

  if (!base) continue;

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

if (failures.length || staleReferences.length) {
  const messages = [];
  if (failures.length) messages.push(`Found URLs that escape ${base}:\n${failures.join("\n")}`);
  if (staleReferences.length) {
    messages.push(`Found stale ${legacyProjectPath} references:\n${staleReferences.join("\n")}`);
  }
  throw new Error(messages.join("\n\n"));
}

const home = await readFile("dist/index.html", "utf8");
if (!home.includes(`href="${base}/work"`) || !home.includes(`${base}/img/hero-crop.jpeg`)) {
  throw new Error("The home page is missing expected base-prefixed navigation or imagery");
}

const canonical = `https://sundharesan11.github.io${base}/`;
const ogImage = `https://sundharesan11.github.io${base}/og-default.png`;
if (!home.includes(`<link rel="canonical" href="${canonical}"`)
  || !home.includes(`<meta property="og:image" content="${ogImage}"`)) {
  throw new Error("The home page has incorrect canonical or Open Graph metadata");
}

if (!base) {
  if (!hasLegacyRedirect) {
    throw new Error("The 404 page is missing the legacy project-path redirect");
  }
}

console.log(`GitHub Pages paths verified for ${base || "/"} across ${files.length} generated files.`);
