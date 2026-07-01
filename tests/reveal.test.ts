import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("progressive reveal motion", () => {
  it("keeps reveal content visible until JavaScript opts into animation", () => {
    const css = read("../src/styles/global.css");
    const reveal = read("../src/scripts/reveal.ts");

    expect(css).toContain(".js-reveal [data-reveal] { opacity: 0;");
    expect(css).not.toContain("\n[data-reveal] { opacity: 0;");
    expect(reveal).toContain('document.documentElement.classList.add("js-reveal")');
  });

  it("keeps the cube drawer flat and metadata accurate", () => {
    const cube = read("../src/components/CubeMenu.astro");
    const layout = read("../src/layouts/BaseLayout.astro");

    expect(cube).not.toContain("box-shadow");
    expect(layout).toContain("AI engineer, writer, and founder-in-waiting");
    expect(layout).not.toContain("designer & builder");
  });
});
