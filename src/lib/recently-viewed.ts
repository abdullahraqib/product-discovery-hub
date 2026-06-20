const KEY = "sr-recently-viewed";
const MAX = 6;

export function addRecentlyViewed(sku: string) {
  if (typeof window === "undefined") return;
  try {
    const list = getRecentlyViewed().filter((s) => s !== sku);
    list.unshift(sku);
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    // ignore
  }
}

export function getRecentlyViewed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
