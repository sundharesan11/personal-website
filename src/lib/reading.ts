export function splitAtLimit<T>(items: readonly T[], limit: number) {
  return {
    visibleItems: items.slice(0, limit),
    remainingItems: items.slice(limit),
  };
}
