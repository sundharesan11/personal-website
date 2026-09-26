const normalizeBase = (base: string) => {
  const trimmed = base.trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "";
};

export function withBase(path: string, base = import.meta.env.BASE_URL): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${normalizeBase(base)}${path}`;
}

export function withoutBase(pathname: string, base = import.meta.env.BASE_URL): string {
  const normalizedBase = normalizeBase(base);
  if (!normalizedBase) return pathname;
  if (pathname === normalizedBase) return "/";
  return pathname.startsWith(`${normalizedBase}/`)
    ? pathname.slice(normalizedBase.length)
    : pathname;
}
