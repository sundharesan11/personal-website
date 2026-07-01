import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const contactLinks = (source: string) =>
  Array.from(source.matchAll(/<a href="([^"]+)"[^>]*>(Email|X|LinkedIn|GitHub|Medium|Instagram)<\/a>/g), (match) => ({
    href: match[1],
    label: match[2],
  }));

describe("contact link sets", () => {
  it("keeps Contact reachable from the global cube menu", () => {
    const cube = read("../src/components/CubeMenu.astro");

    expect(cube).toContain('{ href: "/contact", label: "Contact" }');
  });

  it("keeps the shared footer to Email, X, LinkedIn", () => {
    const footer = read("../src/components/Footer.astro");

    expect(contactLinks(footer)).toEqual([
      { href: "mailto:sundharesansk11@gmail.com", label: "Email" },
      { href: "https://x.com/sundharesansk11", label: "X" },
      { href: "https://www.linkedin.com/in/sundharesan-kumaresan-iyal11", label: "LinkedIn" },
    ]);
  });

  it("keeps About's expanded social row in the requested order", () => {
    const about = read("../src/pages/about.astro");

    expect(contactLinks(about)).toEqual([
      { href: "mailto:sundharesansk11@gmail.com", label: "Email" },
      { href: "https://x.com/sundharesansk11", label: "X" },
      { href: "https://www.linkedin.com/in/sundharesan-kumaresan-iyal11", label: "LinkedIn" },
      { href: "https://github.com/sundharesan11", label: "GitHub" },
      { href: "https://medium.com/@sundharesansk11", label: "Medium" },
      { href: "https://www.instagram.com/sundharesan_11/", label: "Instagram" },
    ]);
  });
});
