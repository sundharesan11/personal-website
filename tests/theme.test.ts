import { describe, it, expect } from "vitest";
import { resolveTheme } from "../src/scripts/theme";

describe("resolveTheme", () => {
  it("uses stored preference when present", () => {
    expect(resolveTheme("dark", true)).toBe("dark");
    expect(resolveTheme("light", false)).toBe("light");
  });

  it("falls back to system when no stored preference", () => {
    expect(resolveTheme(null, true)).toBe("dark");   // system prefers dark
    expect(resolveTheme(null, false)).toBe("light"); // system prefers light
  });

  it("ignores invalid stored values and uses system", () => {
    expect(resolveTheme("purple", true)).toBe("dark");
  });
});
