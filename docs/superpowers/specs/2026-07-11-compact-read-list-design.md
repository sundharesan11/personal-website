# Compact Read list design

**Date:** 2026-07-11  
**Status:** Approved for implementation planning

## Goal

Shorten the Reading page by replacing the long scattered Read presentation with a compact list that reveals the full archive only when requested.

## Design

The Read section becomes a simple editorial title-and-author list. The first five books remain visible. When more than five read books exist, the rest sit inside a native disclosure labelled **View all {count} books**. Opening it reveals every remaining read book on the same page; no pagination, new route, or client JavaScript is introduced.

Read notes, questions, and `opened` group values remain in the content collection but are not rendered on the Reading index. This preserves the material for future detail pages without making the index unusually long.

The To Read section and private recommendation form remain unchanged. The list uses existing typography, spacing, hairline, and accent tokens, with no cards, rounded containers, shadows, or new dependencies.

## Accessibility and behaviour

The disclosure uses native `details` and `summary`, so it is keyboard reachable and works without JavaScript. The first five books remain in normal document order, followed by the hidden remainder. When five or fewer books exist, no View all control is rendered.

## Testing and verification

Tests cover the five-book visible limit, the native disclosure, the full count in its label, the absence of the control at five or fewer books, and the removal of notes/questions from the Read index markup. Final verification includes the focused Reading suite, production build, and desktop/mobile browser inspection in light and dark themes.
