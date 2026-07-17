# Reading shelf and idle sunflower cluster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Reading archive with the chosen three-book shelf and add a reduced-motion-safe global idle sunflower cluster.

**Architecture:** Keep reading curation in the Astro content collection and reuse `ReadingListSection.astro` for the full-detail three-item state. Add a dedicated idle-controller module that owns interaction/timer lifecycle, plus an `IdleSunflowers.astro` global overlay mounted by `BaseLayout.astro`; it reuses the existing sunflower canvas renderer at a bounded small size.

**Tech Stack:** Astro, TypeScript, Tailwind v4 tokens, native DOM APIs, Vitest.

## Global Constraints

- Keep the exact Reading line: “The last three reads. The rest have been returned to the void.”
- Keep only Poor Economics, The Picture of Dorian Gray, and Thinking, Fast and Slow as `status: read`, in that rendered order.
- Use existing colour and motion tokens; add no dependencies, cards, shadows, or new accent colours.
- The idle cluster is decorative, non-interactive, global, and absent for `prefers-reduced-motion: reduce`.
- A cluster contains two or three small flowers, is shown after 3000ms idle, and clears on pointer, scroll, key, touch, or pointer interaction.

---

### Task 1: Curate the Reading shelf

**Files:**
- Modify: `src/pages/reading/index.astro`
- Modify: `src/content/reading/poor-economics.md`
- Modify: `src/content/reading/the-picture-of-dorian-gray.md`
- Modify: `src/content/reading/thinking-fast-and-slow.md`
- Delete: `src/content/reading/everything-is-fcked.md`, `ishmaels-oranges.md`, `the-brothers-karamazov.md`, `the-kite-runner.md`, `the-metamorphosis.md`, `the-stranger.md`, `the-subtle-art.md`, and `white-nights.md`
- Modify: `tests/reading-recommendations.test.ts`

**Interfaces:**
- Consumes: the existing descending `order` sort in `src/pages/reading/index.astro`.
- Produces: exactly three read collection entries in the requested newest-first order.

- [ ] **Step 1: Write the failing Reading contract test**

Add expectations that `src/pages/reading/index.astro` contains `title="Last three reads"` and the exact void line, and uses no reading disclosure for the three-entry shelf. Read the content directory and assert its three filenames are the only remaining read entries, with orders 3, 2, and 1.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- tests/reading-recommendations.test.ts`  
Expected: FAIL because the page still says `Read` and old read entries remain.

- [ ] **Step 3: Apply the smallest content and template change**

Set Poor Economics, The Picture of Dorian Gray, and Thinking, Fast and Slow to orders 3, 2, and 1 respectively. Delete the eight retired read files. In `src/pages/reading/index.astro`, pass `title="Last three reads"` and place this paragraph before the section:

```astro
<p class="mt-6 max-w-[52ch] text-text-muted">The last three reads. The rest have been returned to the void.</p>
```

Keep all To Read, recommendation, and rail markup unchanged.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm test -- tests/reading-recommendations.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/reading/index.astro src/content/reading tests/reading-recommendations.test.ts
git commit -m "feat(reading): curate last three reads"
```

### Task 2: Implement and test global idle-cluster state

**Files:**
- Create: `src/scripts/idleSunflowers.ts`
- Modify: `tests/sunflower.test.ts`

**Interfaces:**
- Produces: `createIdleSunflowerController({ onShow, onClear, idleMs, reducedMotion })`.
- `onShow(count)` receives either 2 or 3; `onClear()` runs before every newly scheduled idle period and whenever activity resumes.
- `controller.activity()` resets the timeout; `controller.destroy()` clears the timeout and makes later activity inert.

- [ ] **Step 1: Write failing controller tests**

Use Vitest fake timers to assert:
1. `onShow` is not called at 2999ms and is called once at 3000ms with count 2 or 3.
2. activity calls `onClear` and postpones the next show for a complete new 3000ms interval.
3. `reducedMotion: true` never calls `onShow`.
4. `destroy()` cancels the pending timeout.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- tests/sunflower.test.ts`  
Expected: FAIL because `createIdleSunflowerController` is not exported.

- [ ] **Step 3: Implement the pure controller**

Create `src/scripts/idleSunflowers.ts` with this public shape:

```ts
export interface IdleSunflowerController {
  activity(): void;
  destroy(): void;
}

export function createIdleSunflowerController(options: {
  onShow: (count: 2 | 3) => void;
  onClear: () => void;
  idleMs?: number;
  reducedMotion?: boolean;
  random?: () => number;
}): IdleSunflowerController
```

Default `idleMs` to 3000. Schedule exactly one timeout. Use `random` to select 2 or 3 deterministically in tests. Do not access `window` in this module.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm test -- tests/sunflower.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/idleSunflowers.ts tests/sunflower.test.ts
git commit -m "feat(motion): add idle sunflower controller"
```

### Task 3: Mount the decorative global overlay

**Files:**
- Create: `src/components/IdleSunflowers.astro`
- Modify: `src/scripts/sunflower.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`
- Modify: `tests/sunflower.test.ts`

**Interfaces:**
- Consumes: `createIdleSunflowerController` and `initSunflower(canvas, { count })`.
- Produces: a fixed, pointer-transparent, aria-hidden overlay with two or three small canvases, all removed on activity.

- [ ] **Step 1: Write failing static integration expectations**

Assert that `IdleSunflowers.astro` is mounted by `BaseLayout.astro`, has `aria-hidden="true"`, listens for `pointermove`, `pointerdown`, `scroll`, `keydown`, and `touchstart`, and checks `prefers-reduced-motion: reduce`. Assert the CSS includes a fixed `.idle-sunflowers` overlay with `pointer-events: none` and uses `var(--motion-base)` and `var(--ease-editorial)`.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- tests/sunflower.test.ts`  
Expected: FAIL because the global overlay files and mount do not exist.

- [ ] **Step 3: Implement the overlay and small-canvas renderer option**

Extend `initSunflower` options with `count?: number; static?: boolean`, where `static: true` draws one frame without creating an animation loop or observers. `IdleSunflowers.astro` renders an empty fixed overlay and, on controller `onShow`, creates 2 or 3 72px canvases at safe corner positions below the masthead. Remove them on `onClear`. Register activity listeners with `{ passive: true }` where allowed and return cleanup on `pagehide`. Add only token-based fade CSS; no document-flow layout is changed.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm test -- tests/sunflower.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/IdleSunflowers.astro src/scripts/sunflower.ts src/layouts/BaseLayout.astro src/styles/global.css tests/sunflower.test.ts
git commit -m "feat(motion): show idle sunflower clusters"
```

### Task 4: Verify the integrated site

**Files:**
- Modify: none unless verification reveals a scoped defect.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: verified Reading and idle-cluster behaviour in production output.

- [ ] **Step 1: Run focused automated tests**

Run: `npm test -- tests/reading-recommendations.test.ts tests/sunflower.test.ts`  
Expected: PASS.

- [ ] **Step 2: Run the full test suite and production build**

Run: `npm test && npm run build`  
Expected: all tests pass and Astro exits with code 0.

- [ ] **Step 3: Inspect the live site**

Use the existing dev server at `http://localhost:4321/`. Verify Reading at desktop and mobile widths in light, cream, and dark themes. Confirm the three-book order, exact line, no disclosure, and unchanged To Read/recommendation area. On a non-reduced-motion session, wait three seconds, confirm a two-or-three-flower cluster in page margins, then scroll and confirm it clears. Enable reduced motion and confirm no cluster appears.

- [ ] **Step 4: Commit any scoped verification fix**

If a defect is found and fixed, run its focused test, then:

```bash
git add <scoped-files>
git commit -m "fix(motion): refine idle sunflower placement"
```

