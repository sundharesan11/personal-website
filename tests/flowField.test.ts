import { describe, it, expect } from "vitest";
import { flowAngle } from "../src/scripts/flowField";
import { randFromIndex } from "../src/scripts/flowField";

describe("flowAngle", () => {
  it("is deterministic for the same inputs", () => {
    expect(flowAngle(120, 80, 0.5)).toBe(flowAngle(120, 80, 0.5));
  });
  it("returns a finite number within +/- 3*PI", () => {
    const a = flowAngle(640, 300, 2.1);
    expect(Number.isFinite(a)).toBe(true);
    expect(Math.abs(a)).toBeLessThanOrEqual(3 * Math.PI + 1e-9);
  });
  it("evolves over time", () => {
    expect(flowAngle(100, 100, 0)).not.toBe(flowAngle(100, 100, 1));
  });
});

describe("randFromIndex", () => {
  it("is deterministic for the same index", () => {
    expect(randFromIndex(7)).toBe(randFromIndex(7));
  });
  it("returns a value in [0,1)", () => {
    for (const i of [0, 1, 5, 42, 199]) {
      const v = randFromIndex(i);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
  it("varies across indices", () => {
    expect(randFromIndex(1)).not.toBe(randFromIndex(2));
  });
});
