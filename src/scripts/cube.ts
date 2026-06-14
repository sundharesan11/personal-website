export function initCube(): void {
  const trigger = document.getElementById("cube-trigger");
  const menu = document.getElementById("cube-menu");
  const closeBtn = document.getElementById("cube-close");
  const cube = document.getElementById("cube");
  if (!trigger || !menu || !closeBtn || !cube) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lastFocus: HTMLElement | null = null;
  let rx = -18, ry = -28;
  let autoSpin = !reduce.matches, dragging = false, raf = 0;
  let px = 0, py = 0;

  const render = () => { cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`; };
  const loop = () => {
    if (autoSpin && !dragging) ry += 0.22;
    render();
    raf = requestAnimationFrame(loop);
  };
  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };

  function open() {
    lastFocus = document.activeElement as HTMLElement;
    menu!.classList.remove("hidden");
    menu!.classList.add("flex");
    requestAnimationFrame(() => menu!.classList.add("is-open"));
    trigger!.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    closeBtn!.focus();
    document.addEventListener("keydown", onKey);
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function close() {
    menu!.classList.remove("is-open");
    menu!.classList.add("hidden");
    menu!.classList.remove("flex");
    trigger!.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    (lastFocus ?? trigger!).focus();
  }

  trigger.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  menu.addEventListener("click", (e) => { if (e.target === menu) close(); });

  cube.addEventListener("pointerenter", () => { autoSpin = false; });
  cube.addEventListener("pointerleave", () => { if (!dragging && !reduce.matches) autoSpin = true; });
  cube.addEventListener("pointerdown", (e) => {
    dragging = true; autoSpin = false; px = e.clientX; py = e.clientY;
    try { cube.setPointerCapture(e.pointerId); } catch (_) {}
  });
  cube.addEventListener("pointermove", (e) => {
    if (!dragging) return;
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

  render();
}
