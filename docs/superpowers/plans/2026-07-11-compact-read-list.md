# Compact Read List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the long Read scatter with a five-item compact list and a native View all disclosure.

**Architecture:** Derive `visibleReadBooks` and `remainingReadBooks` from the existing sorted `readBooks` array. Render the same compact row treatment before and inside `details`; keep the collection schema, To Read, and recommendation form unchanged.

**Tech Stack:** Astro 6, TypeScript, Tailwind CSS 4, Vitest 4

## Global Constraints

- Show exactly the first five read books before expansion.
- Render the remainder on the same page inside native `details` and `summary` labelled `View all {count} books`.
- Do not render Read notes, questions, or `opened` group headings on the index.
- Do not render the disclosure when five or fewer read books exist.
- Preserve To Read, recommendations, sunflower, themes, and mobile source order.
- Add no JavaScript, dependency, route, card, rounded container, shadow, colour, or design token.
- Preserve all existing uncommitted user changes and do not stage or commit implementation files.

---

### Task 1: Compact Read list

**Files:**
- Modify: `tests/reading-recommendations.test.ts`
- Modify: `src/pages/reading/index.astro`

**Interfaces:**
- Consumes: sorted `readBooks` content entries.
- Produces: `visibleReadBooks = readBooks.slice(0, 5)` and `remainingReadBooks = readBooks.slice(5)`.

- [ ] **Step 1: Write failing tests**

Add tests that assert:

```ts
it("shows five read books before a native View all disclosure", () => {
  const page = read("../src/pages/reading/index.astro");

  expect(page).toContain("const visibleReadBooks = readBooks.slice(0, 5)");
  expect(page).toContain("const remainingReadBooks = readBooks.slice(5)");
  expect(page).toContain("visibleReadBooks.map");
  expect(page).toContain("remainingReadBooks.length > 0");
  expect(page).toContain("<details");
  expect(page).toContain("View all {readBooks.length} books");
  expect(page).toContain("remainingReadBooks.map");
});

it("keeps Read notes, questions, and opened groups off the index", () => {
  const page = read("../src/pages/reading/index.astro");

  expect(page).not.toContain("readGroups");
  expect(page).not.toContain("book.data.note");
  expect(page).not.toContain("book.data.question");
  expect(page).not.toContain("book.data.opened");
});
```

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/reading-recommendations.test.ts`

Expected: the two new tests fail because the scatter/group presentation still exists.

- [ ] **Step 3: Implement the compact list**

Replace `readGroups` with the two slices. In the Read section, render `visibleReadBooks` as title-and-author rows separated by hairlines. If `remainingReadBooks.length > 0`, render a native disclosure whose summary is `View all {readBooks.length} books` and whose body maps the remaining rows. Use `h3` for book titles, preserve optional outbound links, and do not output notes, questions, or group headings.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- tests/reading-recommendations.test.ts`

Expected: all focused Reading tests pass.

- [ ] **Step 5: Verify integration**

Run: `npm run build`

Expected: Astro builds `/reading/index.html` successfully.

Run: `git diff --check`

Expected: exit 0.

- [ ] **Step 6: Inspect visually**

Inspect `/reading` at desktop and 390px mobile widths in light and dark themes. Confirm five rows appear before View all, opening the native disclosure reveals six remaining rows with current content, no note/question prose remains in Read, the sunflower does not overlap, and document width equals viewport width.

- [ ] **Step 7: Review without committing**

Self-review the focused diff and report changed files, red/green evidence, build result, and visual evidence. Do not stage or commit.
