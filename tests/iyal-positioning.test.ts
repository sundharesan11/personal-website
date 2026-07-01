import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("iyal sister masthead", () => {
  it("labels iyal as masthead-level research in the header", () => {
    const header = read("../src/components/Header.astro");

    expect(header).toContain('aria-label="iyal, Sundharesan\'s farmer capital network research"');
    expect(header).toContain('title="iyal, farmer capital network research"');
  });

  it("defers the home header until the hero photo is hidden", () => {
    const header = read("../src/components/Header.astro");

    expect(header).toContain('const deferUntilHomeImageHidden = path === "/"');
    expect(header).toContain("data-deferred-header");
    expect(header).toContain("[data-home-photo-frame]");
    expect(header).toContain("photo.getBoundingClientRect().bottom <= 0");
  });

  it("grounds the iyal page in field-note language", () => {
    const iyal = read("../src/pages/iyal.astro");

    expect(iyal).toContain("Following the money, trust, and timing of a farming season.");
    expect(iyal).toContain("The week before sowing");
    expect(iyal).toContain("which truck can actually show up");
    expect(iyal).toContain("I am intentionally not building a large platform yet.");
    expect(iyal).not.toContain("stakeholders");
    expect(iyal).not.toContain("ecosystem_role");
  });
});
