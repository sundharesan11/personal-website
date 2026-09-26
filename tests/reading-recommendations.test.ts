import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { splitAtLimit } from "../src/lib/reading";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("Reading curation", () => {
  it.each([
    { count: 0, visible: 0, remaining: 0 },
    { count: 5, visible: 5, remaining: 0 },
    { count: 6, visible: 5, remaining: 1 },
  ])("splits $count read books at the five-book disclosure boundary", ({ count, visible, remaining }) => {
    const books = Array.from({ length: count }, (_, index) => `book-${index + 1}`);

    expect(splitAtLimit(books, 5)).toEqual({
      visibleItems: books.slice(0, visible),
      remainingItems: books.slice(visible, visible + remaining),
    });
  });

  it("partitions entries after descending manual order", () => {
    const books = [{ order: 2 }, { order: 5 }, { order: 1 }, { order: 4 }, { order: 3 }, { order: 6 }]
      .sort((a, b) => b.order - a.order);

    expect(splitAtLimit(books, 5)).toEqual({
      visibleItems: [{ order: 6 }, { order: 5 }, { order: 4 }, { order: 3 }, { order: 2 }],
      remainingItems: [{ order: 1 }],
    });
  });

  it("separates the last three reads and on-deck entries into named sections", () => {
    const page = read("../src/pages/reading/index.astro");

    expect(page).toContain('const readBooks = books.filter((book) => book.data.status === "read")');
    expect(page).toContain('const toReadBooks = books.filter((book) => book.data.status === "on-deck")');
    expect(page).toContain('title="Last three reads" entries={readBooks} kind="read"');
    expect(page).toContain("The last three reads. The rest have been returned to the void.");
    expect(page).toContain('title="To Read" entries={toReadBooks} kind="on-deck"');
  });

  it("keeps exactly the three current reads in the requested order", () => {
    const currentReads = [
      ["poor-economics.md", 3],
      ["the-picture-of-dorian-gray.md", 2],
      ["thinking-fast-and-slow.md", 1],
    ] as const;

    for (const [filename, order] of currentReads) {
      const entry = read(`../src/content/reading/${filename}`);
      expect(entry).toContain("status: read");
      expect(entry).toContain(`order: ${order}`);
    }

    const page = read("../src/pages/reading/index.astro");
    expect(page).not.toContain('title="Read" entries={readBooks} kind="read"');
  });

  it("uses descending manual order and removes counts and state totals", () => {
    const page = read("../src/pages/reading/index.astro");

    expect(page).toContain("b.data.order - a.data.order");
    expect(page).not.toContain("${books.length} books");
    expect(page).not.toContain("finished");
    expect(page).not.toContain("waiting");
    expect(page).toContain('right="A working shelf"');
  });

  it("keeps counts and dates out of both Reading templates", () => {
    const templates = [
      ["page", read("../src/pages/reading/index.astro")],
      ["section", read("../src/components/ReadingListSection.astro")],
    ] as const;

    for (const [name, template] of templates) {
      expect(template, name).not.toMatch(/\{[^}\n]*\.length[^}\n]*\}/);
      expect(template, name).not.toMatch(/\b\d+\s+(?:books?|titles?|finished|waiting|read|on[ -]deck)\b/i);
      expect(template, name).not.toMatch(/\b(?:finished|waiting|on deck|books? (?:read|total)|total books?)\b/i);
      expect(template, name).not.toContain("entry.data.opened");
      expect(template, name).not.toMatch(/\.data\.(?:date|publishedAt|updatedAt|opened)\b/);
      expect(template, name).not.toMatch(/(?:toLocaleDateString|Intl\.DateTimeFormat|formatDate)\s*\(/);
    }

    const section = templates[1][1];
    const lengthUses = section.match(/[^\n]*\.length[^\n]*/g) ?? [];
    expect(lengthUses).toEqual([
      '  {entries.length === 0 && kind === "on-deck" ? (',
      "  ) : remaining.length > 0 ? (",
    ]);
  });

  it("defines independent compact previews and full-detail disclosures", () => {
    const section = read("../src/components/ReadingListSection.astro");
    const css = read("../src/styles/global.css");

    expect(section).toContain('kind: "read" | "on-deck"');
    expect(section).toContain("splitAtLimit(entries, 5)");
    expect(section).toContain("View more");
    expect(section).toContain("Show less");
    expect(section).toContain("entry.data.note");
    expect(section).toContain('kind === "read" && entry.data.question');
    expect(section).toContain("remaining.length > 0");
    expect(css).toContain(".reading-list-shell:has(> .reading-disclosure[open]) > .reading-compact-preview");
    expect(section).toContain('<ul class="reading-compact-preview mt-8">');
    expect(section).toContain('<ul class="reading-full-list">');
    expect(section).toContain('<ul class="reading-full-list mt-8">');
    expect(section.match(/<li(?:\s|>)/g)).toHaveLength(3);
    expect(css).toContain(":where(a, button, input, textarea, select, summary, [tabindex]):focus-visible");
  });

  it("submits private recommendations through Web3Forms when configured", () => {
    const page = read("../src/pages/reading/index.astro");

    expect(page).toContain('import EditorialField from "../../components/EditorialField.astro"');
    expect(page).toContain('action="https://api.web3forms.com/submit"');
    expect(page).toContain('method="POST"');
    expect(page).toContain('subject="Private book recommendation"');
    expect(page).toContain('name="book_title"');
    expect(page).toContain('required label="Book title" name="book_title"');
    expect(page).toContain('name="reason"');
    expect(page).toContain('required type="textarea" label="Why this one?" name="reason"');
    expect(page).toContain('type="email" label="Email (optional)" name="email"');
    expect(page).toContain('fromName="Sundharesan website reading room"');
    expect(page).toContain("<Web3FormFields");
    expect(page).toContain("If the form misbehaves");
  });

  it("keeps optional identity fields inside a reply disclosure", () => {
    const page = read("../src/pages/reading/index.astro");

    expect(page).toContain("<details");
    expect(page).toContain("<summary");
    expect(page).toContain("Want a reply?");
    expect(page).toContain('name="name"');
    expect(page).toContain('name="email"');
  });

  it("falls back to a recommendation email when Web3Forms is unconfigured", () => {
    const page = read("../src/pages/reading/index.astro");

    expect(page).toContain("hasWeb3FormsKey ? (");
    expect(page).toContain('data-recommendation-state="configured"');
    expect(page).toContain('data-recommendation-state="fallback"');
    expect(page).toContain("mailto:sundharesansk11@gmail.com?subject=Book%20recommendation");
    expect(page.match(/<form /g)).toHaveLength(1);
    const recommendationBranch = page.slice(page.indexOf("{hasWeb3FormsKey ? ("));
    const branchBoundary = recommendationBranch.indexOf(") : (");
    expect(recommendationBranch.indexOf('data-recommendation-state="configured"')).toBeLessThan(branchBoundary);
    expect(recommendationBranch.indexOf('data-recommendation-state="fallback"')).toBeGreaterThan(branchBoundary);
  });

  it("renders an explicit empty state when there are no on-deck books", () => {
    const page = read("../src/pages/reading/index.astro");

    const section = read("../src/components/ReadingListSection.astro");

    expect(section).toContain("entries.length === 0");
    expect(section).toContain('data-to-read-state="empty"');
    expect(section).toContain("The next pile is suspiciously tidy. Recommendations are welcome below.");
  });

  it("documents the curated private recommendation workflow", () => {
    const architecture = read("../docs/ARCHITECTURE.md");
    const decisions = read("../docs/DECISIONS.md");

    expect(architecture).toContain("shown under “Last three reads”");
    expect(architecture).toContain("`on-deck` entries appear under To Read");
    expect(architecture).toContain("Recommendations submit privately through Web3Forms");
    expect(decisions).toContain("Reading recommendations stay private and curated");
  });

  it("documents the current three-read shelf instead of the retired scatter grouping", () => {
    const architecture = read("../docs/ARCHITECTURE.md");
    const decisions = read("../docs/DECISIONS.md");

    expect(architecture).toContain("descending manual `order`");
    expect(architecture).toContain("three current entries");
    expect(architecture).toContain("no counts or dates");
    expect(architecture).not.toContain("Reading — scatter gallery grouped");
    expect(architecture).not.toContain("`/reading` (scatter gallery)");
    expect(architecture).not.toContain("remain grouped by `opened`");
    expect(decisions).toContain("Reading lists expand from quiet previews — 2026-07-11");
  });
});
