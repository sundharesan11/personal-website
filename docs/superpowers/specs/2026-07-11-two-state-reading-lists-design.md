# Two-state Reading lists design

**Date:** 2026-07-11  
**Status:** Approved for implementation planning

## Goal

Make both Read and To Read quiet at first glance, then let either section expand in place into the complete, more personal list.

## Ordering and counts

The existing manual `order` field defines recency. Higher numbers are newer. No dates are introduced.

The page must not display collection totals anywhere: not in the masthead, section headings, controls, empty states, or recommendation copy. The masthead's right label becomes a non-numeric editorial phrase.

## Closed state

Read and To Read use the same visual system. Each section initially shows its five highest-order entries as a compact title-and-author list. The treatment is intentionally quiet: existing muted text and hairline tokens, no notes, questions, badges, or dates.

If a section has five or fewer entries, it renders the complete detailed list directly and does not show a View more control.

## Expanded state

When more than five entries exist, **View more** expands the section on the same canvas. The compact preview disappears rather than remaining above the archive. The full ordered list takes its place:

- Read: title, author, existing POV/lesson (`note`), and existing question when present.
- To Read: title, author, and the existing note interpreted as why the book is on the list.

The control becomes **Show less** while open and restores the five-item compact preview when closed. There is no separate archive route, pagination, modal, total count, or scrolling reset.

## Interaction architecture

Use native `details` and `summary` for disclosure semantics and keyboard support. CSS swaps the preview and full-list states based on the open state; no client JavaScript is introduced. If the browser does not support the enhancement selector used for the swap, content must remain readable and the full list must remain reachable.

Read and To Read are independent disclosures. Opening one does not change the other. The recommendation form and sunflower rail remain unchanged.

## Visual treatment

Both lists reuse existing type, muted text, accent, spacing, and hairline tokens. The closed state is lighter and greyer than the expanded prose. Expanded POV/lesson copy uses primary text for comfortable reading. No cards, rounded containers, shadows, new colours, or new design tokens are allowed.

## Content model

The `reading` schema remains unchanged. `order` is the manual recency control; `note` supplies the expanded POV/lesson or To Read rationale; `question` remains optional and appears only for expanded Read entries. The older `opened` value remains stored but is not rendered on the index.

## Testing and verification

Executable helpers must cover descending order and the 0, 5, and 6-entry boundaries. Page contracts must verify no count output, independent native disclosures, compact-preview/full-list swapping hooks, Read detail fields, To Read rationale, and unchanged recommendation behavior.

Final verification includes focused tests, production build, and desktop/mobile browser inspection in light and dark themes. Confirm the two sections expand and collapse independently, exactly five compact entries appear where applicable, the expanded list replaces rather than duplicates the preview, no totals or dates appear, the sunflower does not overlap, and there is no horizontal overflow.
