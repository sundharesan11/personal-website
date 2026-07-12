export const lenses = [
  { key: "technical", label: "Technical / AI" },
  { key: "economics", label: "Economics / Politics" },
  { key: "theatrical", label: "Theatrical" },
];

export const lensIntro: Record<string, string> = {
  theatrical: "The fiction is where I get to cheat. When an argument can't hold something true, I hand it to a character and let them carry it. I'm a sucker for structure as meaning: stories told out of order, lives that read differently depending on which way you go.",
  economics: "I keep circling the unglamorous machinery: how food, money, and goods actually move, and who gets quietly priced out while they do. Macroeconomics, agronomics, logistics. Not the theory, the seams where it grinds.",
  technical: "The day job, thinking out loud. Mostly AI and data systems, written the way I wish someone had written them for me: less hand-waving, more here's-how-it-actually-works-and-where-it-breaks.",
};

export { scatter } from "./scatter";

const fmtDate = (d: Date) => d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

// Dateline first, always: a publication keeps its chronology even when the
// piece lives on Medium.
export function metaOf(entry: any): string {
  const d = entry.data;
  if (d.status === "writing") return "Being written";
  return d.link ? `${fmtDate(d.date)} · On Medium ↗` : fmtDate(d.date);
}

export function linkOf(entry: any): string | null {
  const d = entry.data;
  return d.link ?? (d.status === "published" ? `/writing/${d.lens}/${entry.id}` : null);
}

export function nextLens(key: string) {
  const i = lenses.findIndex((l) => l.key === key);
  return lenses[(i + 1) % lenses.length];
}
