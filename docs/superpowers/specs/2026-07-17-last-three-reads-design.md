# Last three reads design

**Date:** 2026-07-17  
**Status:** Approved for implementation planning

## Goal

Make Reading a deliberately current shelf rather than a growing archive. The public Read list contains only the latest three books.

## Content and ordering

The collection retains exactly these read entries, ordered newest to oldest:

1. *Poor Economics* — Abhijit V. Banerjee and Esther Duflo
2. *The Picture of Dorian Gray* — Oscar Wilde
3. *Thinking, Fast and Slow* — Daniel Kahneman

All other `status: read` entries are removed from the collection. The existing descending manual `order` field remains the source of truth and is updated so the rendered order matches this list.

## Page treatment

The Read heading becomes **Last three reads**. Directly beneath it, a short dry note reads: “The last three reads. The rest have been returned to the void.”

The three entries use the existing full editorial list treatment: title, author, note, and question. Since there are exactly three entries, no compact-preview or disclosure control appears. The To Read list, recommendation form, sunflower rail, onward link, page masthead, and all existing accessibility behavior remain unchanged.

## Visual and technical constraints

No new components, dependencies, client JavaScript, design tokens, cards, surface fills, rounded corners, or shadows are introduced. The new line uses existing typography and colour tokens, with primary reading copy staying legible in every theme.

## Testing and verification

Update focused reading tests to assert the three-entry public shelf and its ordering if the existing suite covers the page or helper. Verify the production build and inspect `/reading` on desktop and mobile in light and dark themes. Confirm the title, exact editorial line, three entries, absence of disclosure controls, and unaffected To Read/recommendation behavior.
