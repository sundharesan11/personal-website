import { describe, it, expect } from "vitest";
import { phyllotaxis } from "../src/scripts/sunflower";

describe("phyllotaxis", () => {
  it("places the first seed at the centre", () => {
    const p = phyllotaxis(0, 10, 0);
    expect(p.x).toBeCloseTo(0); expect(p.y).toBeCloseTo(0); expect(p.r).toBe(0);
  });
  it("radius grows with sqrt(i)", () => {
    expect(phyllotaxis(4, 1, 0).r).toBeCloseTo(2);
    expect(phyllotaxis(9, 1, 0).r).toBeCloseTo(3);
  });
  it("is deterministic for the same inputs", () => {
    const a = phyllotaxis(7, 5, 0.3); const b = phyllotaxis(7, 5, 0.3);
    expect(a.x).toBe(b.x); expect(a.y).toBe(b.y);
  });
});
