import { describe, it, expect } from "vitest";
import { resolveTheme, nextTheme } from "../src/scripts/theme";

describe("resolveTheme", () => {
  it("uses stored preference when present", () => {
    expect(resolveTheme("dark", true)).toBe("dark");
    expect(resolveTheme("light", false)).toBe("light");
    expect(resolveTheme("cream", true)).toBe("cream");
  });
  it("falls back to system when no stored preference", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
  });
  it("ignores invalid stored values and uses system", () => {
    expect(resolveTheme("purple", true)).toBe("dark");
  });
});

describe("nextTheme", () => {
  it("cycles light -> dark -> cream -> light", () => {
    expect(nextTheme("light")).toBe("dark");
    expect(nextTheme("dark")).toBe("cream");
    expect(nextTheme("cream")).toBe("light");
  });
});
