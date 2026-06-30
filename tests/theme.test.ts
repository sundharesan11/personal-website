import { describe, it, expect } from "vitest";
import { resolveTheme, nextTheme } from "../src/scripts/theme";

describe("resolveTheme", () => {
  it("uses stored preference when present", () => {
    expect(resolveTheme("dark", true)).toBe("dark");
    expect(resolveTheme("light", false)).toBe("light");
    expect(resolveTheme("cream", true)).toBe("cream");
  });
  it("uses light as the default when no stored preference exists", () => {
    expect(resolveTheme(null, true)).toBe("light");
    expect(resolveTheme(null, false)).toBe("light");
  });
  it("ignores invalid stored values and uses light", () => {
    expect(resolveTheme("purple", true)).toBe("light");
  });
});

describe("nextTheme", () => {
  it("cycles light -> cream -> dark -> light", () => {
    expect(nextTheme("light")).toBe("cream");
    expect(nextTheme("cream")).toBe("dark");
    expect(nextTheme("dark")).toBe("light");
  });
});
