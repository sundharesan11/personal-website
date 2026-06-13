import { describe, it, expect } from "vitest";
import { dotIntensity } from "../src/scripts/dotField";

describe("dotIntensity", () => {
  it("is 0 at or beyond the influence radius", () => {
    expect(dotIntensity(120, 120)).toBe(0);
    expect(dotIntensity(200, 120)).toBe(0);
  });

  it("is 1 directly under the cursor", () => {
    expect(dotIntensity(0, 120)).toBeCloseTo(1);
  });

  it("uses a smoothstep falloff (0.5 at half radius)", () => {
    expect(dotIntensity(60, 120)).toBeCloseTo(0.5);
  });

  it("decreases monotonically as distance grows", () => {
    expect(dotIntensity(30, 120)).toBeGreaterThan(dotIntensity(90, 120));
  });
});
