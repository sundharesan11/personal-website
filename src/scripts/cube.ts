export function initCube(): void {
  const trigger = document.getElementById("cube-trigger");
  const menu = document.getElementById("cube-menu");
  const closeBtn = document.getElementById("cube-close");
  if (!trigger || !menu || !closeBtn) return;
  let lastFocus: HTMLElement | null = null;
  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
  function open() {
    lastFocus = document.activeElement as HTMLElement;
    menu!.classList.remove("hidden");
    menu!.classList.add("flex");
    trigger!.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    closeBtn!.focus();
    document.addEventListener("keydown", onKey);
  }
  function close() {
    menu!.classList.add("hidden");
    menu!.classList.remove("flex");
    trigger!.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
    (lastFocus ?? trigger!).focus();
  }
  trigger.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  menu.addEventListener("click", (e) => { if (e.target === menu) close(); });
}
