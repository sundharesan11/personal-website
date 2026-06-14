export function initEdition(button: HTMLElement): void {
  const get = () => (document.documentElement.getAttribute("data-edition") === "evening" ? "evening" : "modern");
  const sync = () => {
    const cur = get();
    button.setAttribute("aria-pressed", cur === "evening" ? "true" : "false");
    button.setAttribute("data-edition", cur);
  };
  sync();
  button.addEventListener("click", () => {
    const next = get() === "evening" ? "modern" : "evening";
    document.documentElement.setAttribute("data-edition", next);
    try { localStorage.setItem("edition", next); } catch (_) {}
    sync();
  });
}
