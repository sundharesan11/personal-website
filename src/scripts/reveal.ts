export function initMotion(): void {
  document.documentElement.classList.add("js-reveal");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal], main section"));
  els.forEach((el) => el.setAttribute("data-reveal", ""));
  if (reduce.matches || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-revealed"));
  } else {
    const observe = (threshold: number) => {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { (e.target as HTMLElement).classList.add("is-revealed"); io.unobserve(e.target); }
        });
      }, { threshold, rootMargin: "0px 0px -6% 0px" });
      return io;
    };
    const io = observe(0.1);
    // A block taller than the viewport (a long story body) may never show 10%
    // of itself at once and would stay invisible; reveal it on first entry.
    const tallIo = observe(0);
    els.forEach((el) => (el.offsetHeight > window.innerHeight ? tallIo : io).observe(el));
  }

  // Scroll-aware topbar: the glass pill tightens once the page is in motion
  let stateTicking = false;
  const updateScrolled = () => {
    document.body.classList.toggle("is-scrolled", window.scrollY > 32);
    stateTicking = false;
  };
  updateScrolled();
  window.addEventListener("scroll", () => {
    if (!stateTicking) { stateTicking = true; requestAnimationFrame(updateScrolled); }
  }, { passive: true });

  const bar = document.getElementById("scroll-progress");
  if (bar && !reduce.matches) {
    let ticking = false;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
      ticking = false;
    };
    update();
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update, { passive: true });
  }
}
