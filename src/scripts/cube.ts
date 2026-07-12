export function initCube(): void {
  const trigger = document.getElementById("cube-trigger");
  const menu = document.getElementById("cube-menu");
  const closeBtn = document.getElementById("cube-close");
  const cube = document.getElementById("cube");
  const backdrop = document.getElementById("cube-backdrop");
  if (!trigger || !menu || !closeBtn || !cube) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lastFocus: HTMLElement | null = null;
  let rx = -18, ry = -28;
  let autoSpin = !reduce.matches, dragging = false, moved = false, raf = 0;
  let px = 0, py = 0, downX = 0, downY = 0;
  let hideTimer = 0;

  const render = () => { cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`; };
  const loop = () => { if (autoSpin && !dragging) ry += 0.22; render(); raf = requestAnimationFrame(loop); };

  // The dialog promises aria-modal: keep Tab inside it while open.
  const focusables = (): HTMLElement[] =>
    Array.from(menu!.querySelectorAll<HTMLElement>("a[href]:not([tabindex='-1']), button")).filter((el) => el.offsetParent !== null);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") { close(); return; }
    if (e.key !== "Tab") return;
    const els = focusables();
    if (!els.length) return;
    const first = els[0], last = els[els.length - 1];
    const active = document.activeElement as HTMLElement;
    if (e.shiftKey && (active === first || !menu!.contains(active))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (active === last || !menu!.contains(active))) { e.preventDefault(); first.focus(); }
  };

  function open() {
    lastFocus = document.activeElement as HTMLElement;
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = 0; }
    menu!.classList.remove("hidden");
    menu!.classList.add("block");
    requestAnimationFrame(() => menu!.classList.add("is-open"));
    trigger!.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    closeBtn!.focus();
    document.addEventListener("keydown", onKey);
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function close() {
    menu!.classList.remove("is-open");
    trigger!.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    // Let the panel slide out before hiding it (instant under reduced motion)
    const finish = () => { menu!.classList.add("hidden"); menu!.classList.remove("block"); hideTimer = 0; };
    if (reduce.matches) finish();
    else hideTimer = window.setTimeout(finish, 440);
    (lastFocus ?? trigger!).focus();
  }

  trigger.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  if (backdrop) backdrop.addEventListener("click", close);

  cube.addEventListener("pointerenter", () => { autoSpin = false; });
  cube.addEventListener("pointerleave", () => { if (!dragging && !reduce.matches) autoSpin = true; });
  cube.addEventListener("pointerdown", (e) => {
    dragging = true; moved = false; autoSpin = false;
    px = downX = e.clientX; py = downY = e.clientY;
    try { cube.setPointerCapture(e.pointerId); } catch (_) {}
  });
  cube.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 6) moved = true;
    ry += (e.clientX - px) * 0.5;
    rx = Math.max(-80, Math.min(80, rx - (e.clientY - py) * 0.5));
    px = e.clientX; py = e.clientY;
    render();
  });
  const endDrag = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    try { cube.releasePointerCapture(e.pointerId); } catch (_) {}
  };
  cube.addEventListener("pointerup", endDrag);
  cube.addEventListener("pointercancel", endDrag);
  cube.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

  render();
}
