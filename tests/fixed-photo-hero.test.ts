import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("FixedPhotoHero", () => {
  it("keeps the portrait constrained to the hero frame", () => {
    const source = read("../src/components/FixedPhotoHero.astro");

    expect(source).toContain("md:bg-fixed");
    expect(source).toContain("background-image");
    expect(source).toContain("md:grid-cols-[38vw_62vw]");
    expect(source).toContain("md:min-h-[96vh]");
    expect(source).toContain("h-[70vh]");
    expect(source).toContain("overflow-hidden");
    expect(source).toContain("bg-bg");
    expect(source).toContain("background-size");
    expect(source).toContain("background-position");
    expect(source).toContain("data-home-photo-frame");
    expect(source).not.toContain("fixed inset-x-0 top-0");
  });

  it("is used by the home page with the portrait crop", () => {
    const home = read("../src/pages/index.astro");

    expect(home).toContain('import FixedPhotoHero from "../components/FixedPhotoHero.astro"');
    expect(home).toContain('image="/img/hero-crop.jpeg"');
    expect(home).toContain('fit="contain"');
    expect(home).toContain('backgroundSize="auto calc(100% - 28px)"');
    expect(home).toContain('objectPosition="right 18px"');
  });

  it("keeps About on the original inline portrait frame with the placeholder crop", () => {
    const about = read("../src/pages/about.astro");

    expect(about).not.toContain('import FixedPhotoHero from "../components/FixedPhotoHero.astro"');
    expect(about).toContain("md:order-first");
    expect(about).toContain("bg-contain");
    expect(about).toContain("md:max-w-[520px]");
    expect(about).toContain("aspect-[654/801]");
    expect(about).toContain("background-image:url('/img/hero-crop.jpeg')");
  });
});
