import { describe, it, expect } from "vitest";
import { vi } from "vitest";
import { readFileSync } from "node:fs";
import { createIdleSunflowerController } from "../src/scripts/idleSunflowers";
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

describe("idle sunflower controller", () => {
  it("shows a two-or-three-flower cluster after three seconds of inactivity", () => {
    vi.useFakeTimers();
    const onShow = vi.fn();
    const controller = createIdleSunflowerController({ onShow, onClear: vi.fn(), random: () => 0 });

    vi.advanceTimersByTime(2999);
    expect(onShow).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onShow).toHaveBeenCalledWith(2);
    controller.destroy();
    vi.useRealTimers();
  });

  it("clears and restarts the idle period after activity", () => {
    vi.useFakeTimers();
    const onShow = vi.fn();
    const onClear = vi.fn();
    const controller = createIdleSunflowerController({ onShow, onClear, random: () => 0.9 });

    controller.activity();
    expect(onClear).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(2999);
    expect(onShow).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onShow).toHaveBeenCalledWith(3);
    controller.destroy();
    vi.useRealTimers();
  });

  it("does nothing for reduced-motion visitors and cancels on destroy", () => {
    vi.useFakeTimers();
    const onShow = vi.fn();
    const controller = createIdleSunflowerController({ onShow, onClear: vi.fn(), reducedMotion: true });

    vi.advanceTimersByTime(3000);
    expect(onShow).not.toHaveBeenCalled();
    controller.destroy();
    controller.activity();
    vi.advanceTimersByTime(3000);
    expect(onShow).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});

describe("idle sunflower overlay", () => {
  const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

  it("mounts a decorative reduced-motion-safe global overlay", () => {
    const overlay = read("../src/components/IdleSunflowers.astro");
    const layout = read("../src/layouts/BaseLayout.astro");
    const renderer = read("../src/scripts/sunflower.ts");
    const styles = read("../src/styles/global.css");

    expect(layout).toContain('import IdleSunflowers from "../components/IdleSunflowers.astro"');
    expect(layout).toContain("<IdleSunflowers />");
    expect(overlay).toContain('aria-hidden="true"');
    expect(overlay).toContain("prefers-reduced-motion: reduce");
    expect(overlay).toContain("Math.random");
    expect(overlay).toContain("initialRotation: Math.random()");
    expect(overlay).toContain("rotationSpeed });");
    expect(overlay).toContain("img, [role=img], [data-home-photo-frame], [style*=background-image]");
    expect(renderer).toContain("rotationSpeed?: number");
    expect(renderer).toContain("rot += opts.rotationSpeed");
    for (const event of ["pointermove", "pointerdown", "scroll", "keydown", "touchstart"]) {
      expect(overlay).toContain(`["${event}"`);
    }
    expect(styles).toContain(".idle-sunflowers");
    expect(styles).toContain("pointer-events: none");
    expect(styles).toContain("var(--motion-base)");
    expect(styles).toContain("var(--ease-editorial)");
  });
});
