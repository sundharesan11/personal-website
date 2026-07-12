# Two-State Reading Lists Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Read and To Read matching five-item previews that replace themselves with complete detailed lists on expansion, without dates or counts.

**Architecture:** Sort reading entries by descending manual `order`, then partition each status with the existing pure `splitAtLimit` helper. A reusable Astro section component renders compact preview, native disclosure, and full detail states; a small global CSS state rule hides the preview when its disclosure is open without client JavaScript.

**Tech Stack:** Astro 6, TypeScript, Tailwind CSS 4, native HTML details/summary, Vitest 4

## Global Constraints

- Higher `order` means newer; show the highest five first.
- Display no dates or total counts anywhere on Reading.
- Closed state: title and author only, quiet muted/hairline treatment.
- Expanded Read: full ordered list with title, author, note, and optional question.
- Expanded To Read: full ordered list with title, author, and note as rationale.
- Expanded state replaces the compact preview on the same canvas; View more becomes Show less.
- Sections expand independently using native details/summary and CSS, with no client JavaScript.
- At five or fewer entries, render the complete detailed list with no disclosure.
- Preserve recommendation behavior, sunflower rail, themes, mobile source order, and empty To Read handling.
- No schema change, dependency, route, card, rounded container, shadow, new colour, or design token.
- Preserve all existing user changes; do not stage or commit implementation files.

---

### Task 1: Reusable two-state reading section

**Files:**
- Create: `src/components/ReadingListSection.astro`
- Modify: `src/pages/reading/index.astro`
- Modify: `src/styles/global.css`
- Modify: `tests/reading-recommendations.test.ts`
- Modify: `docs/ARCHITECTURE.md`
- Modify: `docs/DECISIONS.md`

**Interfaces:**
- `ReadingListSection.astro` consumes `title: string`, `entries: CollectionEntry<"reading">[]`, and `kind: "read" | "on-deck"`.
- It uses `splitAtLimit(entries, 5)` and renders one independent section.
- Reading page supplies status-filtered arrays already sorted by descending `data.order`.

- [ ] **Step 1: Write failing helper and page-contract tests**

Add executable coverage proving descending order is used before partitioning. Add source contracts verifying:

```ts
expect(page).toContain("b.data.order - a.data.order");
expect(page).not.toContain("${books.length} books");
expect(page).not.toContain("finished");
expect(page).not.toContain("waiting");
expect(section).toContain('kind: "read" | "on-deck"');
expect(section).toContain("View more");
expect(section).toContain("Show less");
expect(section).toContain("entry.data.note");
expect(section).toContain('kind === "read" && entry.data.question');
expect(section).toContain("remaining.length > 0");
expect(css).toContain(".reading-list-shell:has(> .reading-disclosure[open]) > .reading-compact-preview");
```

Also assert the page renders two independent `ReadingListSection` instances with `kind="read"` and `kind="on-deck"`, and that the recommendation form contracts remain present.

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/reading-recommendations.test.ts`

Expected: new component, descending order, count removal, state labels, and CSS swap contracts are absent.

- [ ] **Step 3: Create `ReadingListSection.astro`**

Implement the typed props and split. For more than five entries:

```astro
<section class="reading-list-shell" aria-labelledby={`${kind}-heading`}>
  <h2 id={`${kind}-heading`}>{title}</h2>
  <div class="reading-compact-preview">{visible compact rows}</div>
  <details class="reading-disclosure">
    <summary>
      <span class="reading-more-label">View more</span>
      <span class="reading-less-label">Show less</span>
    </summary>
    <div class="reading-full-list">{all detailed rows}</div>
  </details>
</section>
```

For five or fewer entries, omit `details` and render the full detailed list directly. Preserve the current To Read empty copy for zero entries without a numeric label. Read detailed rows render `note` and optional `question`; To Read detailed rows render `note` only. Compact rows render title and author only.

- [ ] **Step 4: Add CSS-only state swapping**

Use component classes in `global.css`:

```css
.reading-less-label { display: none; }
.reading-disclosure[open] .reading-more-label { display: none; }
.reading-disclosure[open] .reading-less-label { display: inline; }
.reading-list-shell:has(> .reading-disclosure[open]) > .reading-compact-preview { display: none; }
```

Use existing tokens/classes for every visual value. Do not animate height or add JavaScript. Without `:has`, the compact preview may remain above the reachable full list as a readable fallback.

- [ ] **Step 5: Integrate both sections**

Sort all entries descending by `order`, filter Read and To Read, replace the inline list markup with two `ReadingListSection` calls, and replace the numeric masthead label with `A working shelf`. Keep recommendation form, sunflower column, and progression link unchanged.

- [ ] **Step 6: Update durable documentation**

Architecture must describe descending manual order, independent five-item previews, full detail expansion, no counts/dates, and Read versus To Read detail fields. Add a Decisions entry titled `### Reading lists expand from quiet previews — 2026-07-11` recording the same-canvas replacement, native disclosure/CSS approach, and rejection of pagination and client JavaScript.

- [ ] **Step 7: Verify GREEN and integration**

Run: `npm test -- tests/reading-recommendations.test.ts`

Expected: all focused tests pass.

Run: `npm run build`

Expected: `/reading/index.html` builds successfully.

Run: `git diff --check`

Expected: exit 0.

- [ ] **Step 8: Browser verification**

At desktop and 390px mobile widths in light and dark themes, verify: no numeric totals/dates; Read shows the five highest-order compact rows; View more replaces them with all detailed rows; Show less restores the preview; To Read follows the same contract when populated and its empty state remains calm when empty; sections are independent; sunflower does not overlap; no horizontal overflow or console errors.

- [ ] **Step 9: Self-review without committing**

Report RED/GREEN evidence, focused tests, build, diff check, browser evidence or explicit browser handoff, changed files, and any concerns. Do not stage or commit.
