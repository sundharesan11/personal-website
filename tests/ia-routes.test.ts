import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("publication IA routes", () => {
  it("keeps Ambitions as an alias for the To desk", () => {
    const ambitionsExists = existsSync(new URL("../src/pages/ambitions.astro", import.meta.url));
    const ambitions = read("../src/pages/ambitions.astro");
    const to = read("../src/pages/to/index.astro");

    expect(ambitionsExists).toBe(true);
    expect(ambitions).toContain("FutureDesk");
    expect(to).toContain("FutureDesk");
    expect(ambitions).toContain("Ambitions / To");
  });

  it("keeps Writing lenses aligned with visible content", () => {
    const writing = read("../src/lib/writing.ts");
    const config = read("../src/content.config.ts");

    expect(writing).toContain('{ key: "theatrical", label: "Theatrical" }');
    expect(writing).toContain('{ key: "economics", label: "Economics" }');
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
});
