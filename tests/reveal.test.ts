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
    expect(layout).toContain("Forward Deployed Engineer at Oogway Labs. One question from two sides");
    expect(layout).not.toContain("AI engineer and writer. One question from two sides");
    expect(layout).not.toContain("founder-in-waiting");
    expect(layout).not.toContain("designer & builder");
  });

  it("keeps the cube size while making the drawer list quieter with iyal first", () => {
    const cube = read("../src/components/CubeMenu.astro");

    expect(cube).toContain('.cube-scene { perspective: 900px; width: 180px; height: 180px; cursor: grab; }');
    expect(cube).toContain('.cube { position: relative; width: 180px; height: 180px;');
    expect(cube).toContain('{ href: "/iyal", label: "iyal", script: true },\n  { href: "/", label: "Home" }');
    expect(cube).toContain('{!l.script && <span class="cube-no');
    expect(cube).toContain('l.script ? "font-script text-2xl leading-none" : "font-serif text-xl"');
    expect(cube).not.toContain('l.script ? "font-script text-3xl leading-none" : "font-serif text-2xl"');
  });
});
