import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const work = readFileSync(new URL("../src/pages/work/index.astro", import.meta.url), "utf8");
const home = readFileSync(new URL("../src/pages/index.astro", import.meta.url), "utf8");
const factsRail = readFileSync(new URL("../src/components/FactsRail.astro", import.meta.url), "utf8");

describe("Now / Work copy", () => {
  it("keeps the photo header shorter and the intro content compact", () => {
    expect(work).toContain("min-height:46vh");
    expect(work).toContain('class="mx-auto max-w-page px-6 py-12 md:py-14"');
    expect(work).toContain('class="mt-10 grid gap-10 md:grid-cols-[1.3fr_0.7fr]"');
  });

  it("frames the current Oogway Labs role without model-release claims", () => {
    expect(work).toContain("I stay close to the problem");
    expect(work).toContain("Small team, real customers");
    expect(work).toContain("how to drive AI properly");
    expect(work).toContain("I put AI to work where it has to behave");
    expect(work).not.toContain("I&rsquo;m learning AI");
    expect(work).not.toContain("shiny new model");
    expect(work).not.toContain("benchmarks lie");
    expect(work).not.toContain("The third act continues");
    expect(work).not.toContain("The day job, thinking out loud");
  });

  it("uses Forward Deployed Engineer as the role across Home and Now / Work", () => {
    expect(home).toContain("I'm a forward-deployed engineer");
    expect(home).not.toContain("AI engineer");
    expect(work).toContain("Forward-deployed engineer at Oogway Labs");
    expect(work).toContain('value: "Forward-deployed engineer", detail: "Oogway Labs"');
    expect(work).not.toContain("AI engineer");
  });

  it("sets the employer below the role in stellar blue", () => {
    expect(factsRail).toContain("detail?: string");
    expect(factsRail).toContain("{it.detail &&");
    expect(factsRail).toContain("text-accent");
  });
});
