# Reading Recommendations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separate finished and planned books on Reading and let visitors privately submit a minimal book recommendation.

**Architecture:** Keep the existing Astro `reading` collection and interpret `read` and `on-deck` as two presentation groups. Render a build-time Web3Forms recommendation form when configured and an email fallback otherwise, reusing the existing `EditorialField` component and introducing no client state or backend.

**Tech Stack:** Astro 6, TypeScript, Astro Content Collections, Tailwind CSS 4, Web3Forms, Vitest 4

## Global Constraints

- Preserve the Vogue editorial system: no cards, rounded containers, shadows, second accent colour, or new design tokens.
- Keep site copy first-person, concrete, crisp, and free of em dashes.
- Use the existing `read | on-deck` schema; do not add a collection, dependency, database, public feed, or moderation interface.
- Recommendations stay private and require only book title and reason.
- Name and email are optional and hidden inside a native disclosure labelled `Want a reply?`.
- Render an email fallback instead of an unusable form when `PUBLIC_WEB3FORMS_ACCESS_KEY` is absent.
- Preserve the sunflower and readable mobile source order.

## File Structure

- Create `tests/reading-recommendations.test.ts`: source-level regression coverage for the collection split, form contract, privacy disclosure, and fallback.
- Modify `src/pages/reading/index.astro`: split collection data, render Read and To Read, and add configured/unconfigured recommendation states.
- Modify `docs/ARCHITECTURE.md`: document Reading semantics and the private submission flow.
- Modify `docs/DECISIONS.md`: record why recommendations are curated privately and why Web3Forms is reused.

---

### Task 1: Read and To Read sections

**Files:**
- Create: `tests/reading-recommendations.test.ts`
- Modify: `src/pages/reading/index.astro`

**Interfaces:**
- Consumes: Astro content entries whose `data.status` is `read | on-deck`.
- Produces: `readBooks`, `toReadBooks`, and `readGroups` arrays used only by the Reading template.

- [ ] **Step 1: Write the failing section tests**

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("Reading curation", () => {
  it("separates read and on-deck entries into named sections", () => {
    const page = read("../src/pages/reading/index.astro");

    expect(page).toContain('const readBooks = books.filter((book) => book.data.status === "read")');
    expect(page).toContain('const toReadBooks = books.filter((book) => book.data.status === "on-deck")');
    expect(page).toContain('>Read</h2>');
    expect(page).toContain('>To Read</h2>');
  });

  it("groups only read books by what each book opened", () => {
    const page = read("../src/pages/reading/index.astro");

    expect(page).toContain("const readGroups = [...new Set(readBooks.map((book) => book.data.opened))]");
    expect(page).toContain("readBooks.filter((book) => book.data.opened === group)");
  });
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `npm test -- tests/reading-recommendations.test.ts`

Expected: FAIL because `readBooks`, `toReadBooks`, `readGroups`, and the two explicit headings do not exist.

- [ ] **Step 3: Split collection entries in the frontmatter**

Replace the existing `groups` declaration with:

```ts
const readBooks = books.filter((book) => book.data.status === "read");
const toReadBooks = books.filter((book) => book.data.status === "on-deck");
const readGroups = [...new Set(readBooks.map((book) => book.data.opened))];
```

- [ ] **Step 4: Render the two editorial sections**

Keep the current Read entry article markup and sunflower column, but wrap its group loop with:

```astro
<section aria-labelledby="read-heading">
  <div class="flex items-end justify-between gap-6 border-b border-border pb-4">
    <h2 id="read-heading" class="font-serif text-entry font-semibold leading-none">Read</h2>
    <p class="font-sans text-xs uppercase tracking-kicker text-text-muted">{readBooks.length} finished</p>
  </div>
  {readGroups.map((group) => (
    <section class="mt-16">
      <h3 class="font-sans text-sm uppercase tracking-kicker text-text-muted">{group}</h3>
      <div class="mt-8 flex flex-col gap-12">
        {readBooks.filter((book) => book.data.opened === group).map((book) => {
          const layout = scatter[readBooks.findIndex((entry) => entry.id === book.id) % scatter.length];
          return (
            <article class:list={["max-w-[58ch] transition-transform duration-300 hover:-translate-y-1", layout.ml, layout.w]}>
              <div class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h4 class="font-serif text-list-title font-semibold leading-[1.05]">
                  {book.data.link ? <a href={book.data.link} class="u-draw u-draw--display">{book.data.title}</a> : book.data.title}
                </h4>
              </div>
              <p class="mt-1 text-sm uppercase tracking-dateline text-text-muted">{book.data.author}</p>
              <p class="mt-3 text-text">{book.data.note}</p>
              {book.data.question && <p class="mt-3 font-serif text-dek italic leading-snug text-text">{book.data.question}</p>}
            </article>
          );
        })}
      </div>
    </section>
  ))}
</section>

<section class="mt-24 border-t border-border pt-8" aria-labelledby="to-read-heading">
  <div class="flex items-end justify-between gap-6">
    <h2 id="to-read-heading" class="font-serif text-entry font-semibold leading-none">To Read</h2>
    <p class="font-sans text-xs uppercase tracking-kicker text-accent">{toReadBooks.length} waiting</p>
  </div>
  {toReadBooks.length > 0 ? (
    <div class="mt-10 flex flex-col gap-8">
      {toReadBooks.map((book) => (
        <article class="border-t border-border pt-5">
          <h3 class="font-serif text-list-title font-semibold leading-tight">
            {book.data.link ? <a href={book.data.link} class="u-draw u-draw--display">{book.data.title}</a> : book.data.title}
          </h3>
          <p class="mt-1 text-sm uppercase tracking-dateline text-text-muted">{book.data.author}</p>
        </article>
      ))}
    </div>
  ) : (
    <p class="mt-8 max-w-[52ch] text-text-muted">The next pile is suspiciously tidy. Recommendations are welcome below.</p>
  )}
</section>
```

- [ ] **Step 5: Run the focused test and confirm GREEN**

Run: `npm test -- tests/reading-recommendations.test.ts`

Expected: 2 tests pass.

- [ ] **Step 6: Commit the section split**

```bash
git add tests/reading-recommendations.test.ts src/pages/reading/index.astro
git commit -m "feat: separate read and to-read books"
```

---

### Task 2: Private recommendation form and fallback

**Files:**
- Modify: `tests/reading-recommendations.test.ts`
- Modify: `src/pages/reading/index.astro`

**Interfaces:**
- Consumes: `import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY`, `EditorialField.astro`, and the public email address `sundharesansk11@gmail.com`.
- Produces: a configured `POST` form or an unconfigured mail fallback, never both at runtime.

- [ ] **Step 1: Add failing form-contract tests**

Append inside the existing `describe` block:

```ts
it("submits private recommendations through Web3Forms when configured", () => {
  const page = read("../src/pages/reading/index.astro");

  expect(page).toContain('import EditorialField from "../../components/EditorialField.astro"');
  expect(page).toContain('action="https://api.web3forms.com/submit"');
  expect(page).toContain('method="POST"');
  expect(page).toContain('name="subject" value="Private book recommendation"');
  expect(page).toContain('name="book_title"');
  expect(page).toContain('name="reason"');
  expect(page).toContain('name="botcheck"');
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
  expect(page).toContain("mailto:sundharesansk11@gmail.com?subject=Book%20recommendation");
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `npm test -- tests/reading-recommendations.test.ts`

Expected: 3 new tests fail because the recommendation integration is absent.

- [ ] **Step 3: Add form configuration and component import**

Add to the Astro frontmatter:

```ts
import EditorialField from "../../components/EditorialField.astro";

const web3formsAccessKey = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";
const hasWeb3FormsKey = web3formsAccessKey.trim().length > 0;
```

- [ ] **Step 4: Render the recommendation section after To Read**

```astro
<section class="mt-24 border-t border-border pt-8" aria-labelledby="recommend-heading">
  <p class="font-sans text-xs uppercase tracking-kicker text-accent">Reader's margin</p>
  <h2 id="recommend-heading" class="mt-4 font-serif text-entry font-semibold leading-none">Recommend a book</h2>
  <p class="mt-5 max-w-[56ch] text-text-muted">Give me the title and the reason it earned the interruption. Recommendations arrive privately and nothing appears here automatically.</p>

  {hasWeb3FormsKey ? (
    <form action="https://api.web3forms.com/submit" method="POST" class="mt-10 max-w-[58ch]" data-reveal>
      <input type="hidden" name="access_key" value={web3formsAccessKey} />
      <input type="hidden" name="subject" value="Private book recommendation" />
      <input type="hidden" name="from_name" value="Sundharesan website reading room" />
      <input type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off" />

      <EditorialField required label="Book title" name="book_title" placeholder="The book I should lose a weekend to" />
      <div class="mt-8">
        <EditorialField required type="textarea" label="Why this one?" name="reason" rows={6} placeholder="What stayed with you, changed your mind, or refused to leave?" />
      </div>

      <details class="mt-8 border-t border-border pt-5">
        <summary class="cursor-pointer font-sans text-xs uppercase tracking-kicker text-text-muted transition-colors hover:text-accent">Want a reply?</summary>
        <div class="mt-6 grid gap-8 sm:grid-cols-2">
          <EditorialField label="Name (optional)" name="name" autocomplete="name" placeholder="Who sent me down this path?" />
          <EditorialField type="email" label="Email (optional)" name="email" autocomplete="email" placeholder="Only if you want a reply" />
        </div>
      </details>

      <button type="submit" class="group mt-8 font-serif text-statement font-semibold leading-none text-text transition-colors hover:text-accent">Send recommendation <span class="adv-arrow text-accent">&rarr;</span></button>
    </form>
  ) : (
    <div class="mt-10 max-w-[58ch] border-t border-border pt-6" data-reveal>
      <p class="font-sans text-xs uppercase tracking-kicker text-accent">Recommendation form offline</p>
      <p class="mt-5 text-text-muted">Send the title and why it deserves the next empty margin. Your name is optional.</p>
      <a href="mailto:sundharesansk11@gmail.com?subject=Book%20recommendation" class="group mt-7 inline-block font-serif text-statement font-semibold leading-none text-text transition-colors hover:text-accent">Recommend by email <span class="adv-arrow text-accent">&rarr;</span></a>
    </div>
  )}
</section>
```

- [ ] **Step 5: Run the focused test and confirm GREEN**

Run: `npm test -- tests/reading-recommendations.test.ts`

Expected: 5 tests pass.

- [ ] **Step 6: Commit the private form**

```bash
git add tests/reading-recommendations.test.ts src/pages/reading/index.astro
git commit -m "feat: accept private book recommendations"
```

---

### Task 3: Documentation and full verification

**Files:**
- Modify: `tests/reading-recommendations.test.ts`
- Modify: `docs/ARCHITECTURE.md`
- Modify: `docs/DECISIONS.md`

**Interfaces:**
- Consumes: the final Reading content and submission behaviour from Tasks 1 and 2.
- Produces: durable project documentation and regression checks that keep docs aligned with code.

- [ ] **Step 1: Add a failing documentation test**

Append inside the existing `describe` block:

```ts
it("documents the curated private recommendation workflow", () => {
  const architecture = read("../docs/ARCHITECTURE.md");
  const decisions = read("../docs/DECISIONS.md");

  expect(architecture).toContain("`read` entries appear under Read");
  expect(architecture).toContain("`on-deck` entries appear under To Read");
  expect(architecture).toContain("Recommendations submit privately through Web3Forms");
  expect(decisions).toContain("Reading recommendations stay private and curated");
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `npm test -- tests/reading-recommendations.test.ts`

Expected: 1 documentation test fails because the exact workflow is not recorded.

- [ ] **Step 3: Update Architecture**

Replace the Reading content-model sentence with:

```md
`reading` frontmatter: `title`, `author`, `note`, `question?`, `status` (`read | on-deck`), `opened`, `cover?`, `link?`, `order`. `read` entries appear under Read and remain grouped by `opened`; `on-deck` entries appear under To Read without notes that imply completion. Recommendations submit privately through Web3Forms, fall back to email when unconfigured, and become content only after manual curation.
```

- [ ] **Step 4: Record the decision**

Add under the Decided section in `docs/DECISIONS.md`:

```md
### Reading recommendations stay private and curated — 2026-07-11

The Reading page separates `read` books from `on-deck` books and accepts private reader recommendations through the existing Web3Forms integration. A recommendation asks only for title and reason; optional name and email stay inside “Want a reply?”. Submissions never publish automatically. Accepted titles are added manually as `on-deck`. **Why:** the page should become conversational without turning a personal reading map into an unmoderated public feed or requiring a database. **Rejected:** instant public submissions, mandatory identity fields, and a custom backend.
```

- [ ] **Step 5: Run the focused and full automated checks**

Run: `npm test -- tests/reading-recommendations.test.ts`

Expected: 6 tests pass.

Run: `npm test`

Expected: all test files pass with 0 failures.

Run: `npm run build`

Expected: Astro exits 0 and generates `/reading/index.html`.

- [ ] **Step 6: Inspect the rendered page**

Run: `npm run dev -- --host 127.0.0.1`

Inspect `/reading` at desktop and mobile widths in light and dark themes. Confirm headings and counts are legible, the empty To Read state is intentional when no `on-deck` content exists, disclosure fields work by keyboard, the form/fallback follows environment configuration, the sunflower does not overlap content, and there is no horizontal scroll.

- [ ] **Step 7: Commit documentation and any verified polish**

```bash
git add docs/ARCHITECTURE.md docs/DECISIONS.md tests/reading-recommendations.test.ts src/pages/reading/index.astro
git commit -m "docs: record curated reading workflow"
```
