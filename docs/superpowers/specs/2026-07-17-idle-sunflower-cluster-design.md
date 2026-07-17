# Idle sunflower cluster design

**Date:** 2026-07-17  
**Status:** Approved for implementation planning

## Goal

Add a small, occasional global idle-state flourish that makes the site feel quietly alive without competing with its editorial content.

## Behaviour

After three seconds with no pointer movement, scroll, keyboard, touch, or pointer interaction, the page may show a cluster of two or three small sunflowers. Each flower uses the existing sunflower visual language at low opacity. The cluster draws into unoccupied viewport margins, not over text, inputs, links, controls, the floating masthead, or the scrollbar.

The cluster remains while the visitor is idle and clears immediately on their next interaction. It may appear again only after another complete three-second idle period. No more than one cluster exists at a time. The enhancement is global and works on every page after the document has loaded.

## Accessibility and performance

The feature is decorative and `aria-hidden`. Visitors with `prefers-reduced-motion: reduce` never receive an idle cluster. It must not take focus, change document flow, intercept pointer events, delay content, or alter the experience when JavaScript fails. The implementation uses one fixed overlay and a bounded number of small canvases or equivalent drawing surfaces; it must clean up timers and listeners when the page unloads.

## Visual constraints

Use the current blue and muted tokens via the existing sunflower rendering logic. Flowers remain small, low-contrast, and free of boxes, cards, shadows, fills, or a new accent colour. Their entry and exit use existing motion tokens and the editorial ease. They are a pause in the margin, not a screen saver.

## Reading shelf companion change

In the same delivery, the Reading page becomes a three-book current shelf: *Poor Economics*, *The Picture of Dorian Gray*, and *Thinking, Fast and Slow*, newest first. Its heading is **Last three reads** and the exact line beneath it is: “The last three reads. The rest have been returned to the void.” Older read entries are removed; the To Read list, recommendation form, sunflower rail, and onward link remain unchanged.

## Testing and verification

Unit-test the deterministic idle timing and reset behavior using fake timers, including the reduced-motion guard. Browser verification must confirm a two-or-three-flower cluster appears after three seconds of idle time, clears on each supported interaction, never overlaps protected UI, and does not appear in reduced-motion mode. Verify the Reading shelf content, then run the focused tests and production build. Inspect desktop and mobile in light, cream, and dark themes.
