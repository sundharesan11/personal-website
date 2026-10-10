import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("publication IA routes", () => {
  it("redirects Ambitions to the To desk instead of duplicating it", () => {
    const ambitionsExists = existsSync(new URL("../src/pages/ambitions.astro", import.meta.url));
    const config = read("../astro.config.mjs");
    const to = read("../src/pages/to/index.astro");

    expect(ambitionsExists).toBe(false);
    expect(config).toContain("'/ambitions': routeWithBase('/to')");
    expect(to).toContain("FutureDesk");
  });

  it("keeps Writing lenses aligned with visible content", () => {
    const writing = read("../src/lib/writing.ts");
    const config = read("../src/content.config.ts");

    expect(writing).toContain('export const lenses = [\n  { key: "technical", label: "Technical / AI" },\n  { key: "economics", label: "Economics / Politics" },\n  { key: "theatrical", label: "Theatrical" },\n]');
    expect(writing).toContain('{ key: "theatrical", label: "Theatrical" }');
    expect(writing).toContain('{ key: "economics", label: "Economics / Politics" }');
    expect(writing).toContain('{ key: "technical", label: "Technical / AI" }');
    expect(writing).not.toContain('{ key: "philosophy"');
    expect(config).not.toContain('"philosophy"');
  });

  it("documents the To desk and keeps modelling out of content collections until real content exists", () => {
    const architecture = read("../docs/ARCHITECTURE.md");
    const config = read("../src/content.config.ts");

    expect(architecture).toContain("/ambitions` (alias to `/to`");
    expect(architecture).toContain("/to/waste-management");
    expect(architecture).toContain("not a content collection");
    expect(config).not.toContain("modelling");
  });

  it("keeps perspective prompts inside To detail pages, not the To index", () => {
    const futureDesk = read("../src/components/FutureDesk.astro");
    const agri = read("../src/pages/to/agri-fintech.astro");
    const sports = read("../src/pages/to/sports-development.astro");
    const waste = read("../src/pages/to/waste-management.astro");

    expect(futureDesk).not.toContain('href="/contact"');
    expect(futureDesk).not.toContain("Share your perspective");
    expect(futureDesk).toContain('<article class="group border-t border-border py-10">');
    expect(futureDesk).not.toContain('<a href={a.href} class="group block border-t border-border py-10">');
    for (const page of [agri, sports, waste]) {
      expect(page).toContain('href={withBase("/contact")}');
      expect(page).toContain("Share your perspective");
      expect(page).not.toContain("mailto:sundharesansk11@gmail.com?subject=Farmer%20Capital%20Network");
    }
  });

  it("uses the selected To desk names and parks Season Trust with one clear bridge to iyal", () => {
    const futureDesk = read("../src/components/FutureDesk.astro");
    const agri = read("../src/pages/to/agri-fintech.astro");
    const sports = read("../src/pages/to/sports-development.astro");
    const waste = read("../src/pages/to/waste-management.astro");

    expect(futureDesk).toContain('title: "Season Trust"');
    expect(futureDesk).toContain('title: "The Long Game"');
    expect(futureDesk).toContain('title: "The Civic Loop"');
    expect(agri).toContain("Season Trust · Sundharesan Kumaresan");
    expect(sports).toContain("The Long Game · Sundharesan Kumaresan");
    expect(waste).toContain("The Civic Loop · Sundharesan Kumaresan");
    expect(agri).not.toContain("Farmer Capital Network</h1>");
    expect(futureDesk).toContain('tag: "A parked bet"');
    expect(futureDesk).toContain("Parked while iyal works out whether the margin can carry it.");
    expect(agri).toContain("Outside money into farm seasons. Parked, on purpose.");
    expect(agri).toContain('href={withBase("/iyal")}');
    expect(agri).toContain("The work continues in");
    expect(agri).toContain("I'm not taking money for this.");
    expect(agri).not.toContain("the investor can see what their money is actually doing");
    expect(agri).not.toContain("A handful of investors and backers");
  });

  it("uses the compact right-aligned next-page pattern", () => {
    const next = read("../src/components/NextPageLink.astro");
    const agri = read("../src/pages/to/agri-fintech.astro");
    const sports = read("../src/pages/to/sports-development.astro");
    const waste = read("../src/pages/to/waste-management.astro");
    const writingLens = read("../src/pages/writing/[lens].astro");
    const writingPost = read("../src/pages/writing/[lens]/[slug].astro");
    const reading = read("../src/pages/reading/index.astro");

    expect(next).toContain("ml-auto");
    expect(next).toContain("text-right");
    expect(next).toContain("text-list-title");
    expect(next).not.toContain("text-statement");
    for (const page of [agri, sports, waste, writingLens, writingPost, reading]) {
      expect(page).toContain("NextPageLink");
      expect(page).not.toContain("Next on the desk</p>");
      expect(page).not.toContain("Next lens</p>");
    }
  });
});
