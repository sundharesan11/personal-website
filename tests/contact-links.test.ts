import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
// Socials are data now (rendered via .map), so parse the object literals.
const socialEntries = (source: string) =>
  Array.from(source.matchAll(/\{ href: "([^"]+)", label: "(Email|X|LinkedIn|GitHub|Medium|Instagram)" \}/g), (match) => ({
    href: match[1],
    label: match[2],
  }));

const fullSet = [
  { href: "mailto:sundharesansk11@gmail.com", label: "Email" },
  { href: "https://x.com/sundharesansk11", label: "X" },
  { href: "https://www.linkedin.com/in/sundharesan-kumaresan-iyal11", label: "LinkedIn" },
  { href: "https://github.com/sundharesan11", label: "GitHub" },
  { href: "https://medium.com/@sundharesansk11", label: "Medium" },
  { href: "https://www.instagram.com/sundharesan_11/", label: "Instagram" },
];

describe("contact link sets", () => {
  it("keeps Contact reachable from the global cube menu", () => {
    const cube = read("../src/components/CubeMenu.astro");

    expect(cube).toContain('{ href: "/contact", label: "Contact" }');
  });

  it("keeps the footer and About on the same full social set, same order", () => {
    const footer = read("../src/components/Footer.astro");
    const about = read("../src/pages/about.astro");

    expect(socialEntries(footer)).toEqual(fullSet);
    expect(socialEntries(about)).toEqual(fullSet);
  });
});
