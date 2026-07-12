import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("typography system", () => {
  it("uses Libre Bodoni for display, Source Serif 4 for prose, and Inter for UI", () => {
    const css = read("../src/styles/global.css");

    expect(css).toContain('@import "@fontsource/libre-bodoni/400.css"');
    expect(css).toContain('@import "@fontsource-variable/source-serif-4/opsz.css"');
    expect(css).toContain('--font-serif: "Libre Bodoni"');
    expect(css).toContain('--font-prose: "Source Serif 4 Variable"');
    expect(css).toContain('--font-sans: "Inter Variable"');
    expect(css).not.toContain("@fontsource/playfair-display");
  });

  it("sets reusable article prose in the dedicated prose serif", () => {
    const prose = read("../src/components/Prose.astro");

    expect(prose).toContain("font-family: var(--font-prose)");
    expect(prose).toContain('font-variation-settings: "opsz" 18');
  });
});
