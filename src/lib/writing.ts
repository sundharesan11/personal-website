export const lenses = [
  { key: "theatrical", label: "Theatrical" },
  { key: "economics", label: "Economics" },
  { key: "technical", label: "Technical / AI" },
];

export const lensIntro: Record<string, string> = {
  theatrical: "The fiction is where I get to cheat. When an argument can't hold something true, I hand it to a character and let them carry it. I'm a sucker for structure as meaning: stories told out of order, lives that read differently depending on which way you go.",
  economics: "I keep circling the unglamorous machinery: how food, money, and goods actually move, and who gets quietly priced out while they do. Macroeconomics, agronomics, logistics. Not the theory, the seams where it grinds.",
  technical: "The day job, thinking out loud. Mostly AI and data systems, written the way I wish someone had written them for me: less hand-waving, more here's-how-it-actually-works-and-where-it-breaks.",
};

export const scatter = [
  { ml: "", w: "md:max-w-[52ch]" },
  { ml: "md:ml-[22%]", w: "md:max-w-[42ch]" },
  { ml: "md:ml-[8%]", w: "md:max-w-[50ch]" },
  { ml: "md:ml-[28%]", w: "md:max-w-[40ch]" },
  { ml: "md:ml-[13%]", w: "md:max-w-[48ch]" },
  { ml: "md:ml-[4%]", w: "md:max-w-[52ch]" },
  { ml: "md:ml-[18%]", w: "md:max-w-[44ch]" },
];

export function metaOf(entry: any): string {
  const d = entry.data;
  return d.link ? "Read on Medium ↗" : d.status === "writing" ? "Being written" : d.date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function linkOf(entry: any): string | null {
  const d = entry.data;
  return d.link ?? (d.status === "published" ? `/writing/${d.lens}/${entry.id}` : null);
}
