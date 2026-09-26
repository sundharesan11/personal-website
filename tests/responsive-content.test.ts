import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("responsive editorial text guards", () => {
  it("defines reusable text fitting utilities and AA cream muted text", () => {
    const css = read("../src/styles/global.css");

    expect(css).toContain(".text-fit");
    expect(css).toContain(".label-fit");
    expect(css).toContain(".display-fit");
    expect(css).toContain("--color-text-muted: #685E50;");
  });

  it("applies fitting guards to Contact's first viewport copy", () => {
    const contact = read("../src/pages/contact.astro");
    const pageHeader = read("../src/components/PageHeader.astro");

    expect(pageHeader).toContain("label-fit font-sans text-xs uppercase tracking-kicker text-text-muted");
    expect(contact).toContain("display-fit font-serif text-display-hero font-semibold leading-[0.92]");
    expect(contact).toContain('class="text-fit mt-8 max-w-[42ch] text-lg leading-relaxed text-text-muted"');
  });

  it("keeps shared page headers free of top hairlines", () => {
    const pageHeader = read("../src/components/PageHeader.astro");

    expect(pageHeader).toContain('<header data-reveal class="pt-5">');
    expect(pageHeader).not.toContain("border-t border-border");
  });

  it("applies fitting guards to iyal and the To desk surfaces", () => {
    const iyal = read("../src/pages/iyal.astro");
    const futureDesk = read("../src/components/FutureDesk.astro");
    const waste = read("../src/pages/to/waste-management.astro");

    expect(iyal).toContain("label-fit font-sans text-xs uppercase");
    expect(iyal).toContain("display-fit mt-8");
    expect(futureDesk).toContain("display-fit");
    expect(waste).toContain("display-fit");
  });

  it("keeps the Home desk statement sticky with Builder first on one line", () => {
    const home = read("../src/pages/index.astro");

    expect(home).toContain("md:sticky md:top-28 md:self-start");
    expect(home).toContain('<span class="block whitespace-nowrap">Builder first.</span>');
  });
});
