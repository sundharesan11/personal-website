import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { legacyProjectTarget, withBase, withoutBase } from "../src/lib/paths";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("deployment paths", () => {
  it("adds a normalized repository base to internal routes and assets", () => {
    expect(withBase("/work", "/personal-website/")).toBe("/personal-website/work");
    expect(withBase("/img/work.jpg", "personal-website")).toBe("/personal-website/img/work.jpg");
    expect(withBase("/", "/personal-website/")).toBe("/personal-website/");
  });

  it("leaves external, mail, hash, and scheme-relative links alone", () => {
    expect(withBase("https://example.com", "/personal-website/")).toBe("https://example.com");
    expect(withBase("mailto:hello@example.com", "/personal-website/")).toBe("mailto:hello@example.com");
    expect(withBase("#main-content", "/personal-website/")).toBe("#main-content");
    expect(withBase("//cdn.example.com/file.jpg", "/personal-website/")).toBe("//cdn.example.com/file.jpg");
  });

  it("removes the repository base before active-route comparisons", () => {
    expect(withoutBase("/personal-website/work", "/personal-website/")).toBe("/work");
    expect(withoutBase("/personal-website", "/personal-website/")).toBe("/");
    expect(withoutBase("/work", "/personal-website/")).toBe("/work");
  });

  it("deploys the user site at root and migrates the old project path", () => {
    const workflow = read("../.github/workflows/deploy.yml");
    const notFound = read("../src/pages/404.astro");

    expect(workflow).not.toContain("SITE_BASE:");
    expect(notFound).toContain('import { legacyProjectTarget } from "../lib/paths"');
    expect(notFound).toContain("location.replace");
  });

  it("keeps legacy project redirects on the same origin", () => {
    expect(legacyProjectTarget("/personal-website")).toBe("/");
    expect(legacyProjectTarget("/personal-website/work")).toBe("/work");
    expect(legacyProjectTarget("/personal-website//evil.example/path")).toBe("/evil.example/path");
    expect(legacyProjectTarget("/work")).toBeNull();
  });
});
