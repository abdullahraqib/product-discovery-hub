import variantMap from "@/data/image-variants.json";

type VariantEntry = {
  "400"?: string;
  "800"?: string;
  w?: number;
  h?: number;
};

const VARIANTS = variantMap as unknown as Record<string, VariantEntry>;

/** Storage object key for a signed product-images URL, if it is one. */
function storageKey(url: string): string | undefined {
  const m = /\/object\/sign\/product-images\/([^?]+)/.exec(url);
  return m?.[1];
}

function entryFor(url?: string): VariantEntry | undefined {
  if (!url) return undefined;
  const key = storageKey(url);
  return key ? VARIANTS[key] : undefined;
}

/**
 * Small responsive sources for product card thumbnails.
 * Falls back to the original URL when no pre-generated variant exists.
 */
export function cardImageProps(url: string): {
  src: string;
  srcSet?: string;
  sizes?: string;
} {
  const e = entryFor(url);
  if (!e) return { src: url };
  const parts: string[] = [];
  if (e["400"]) parts.push(`${e["400"]} 400w`);
  if (e["800"]) parts.push(`${e["800"]} 800w`);
  if (!parts.length) return { src: url };
  return {
    src: e["400"] ?? e["800"] ?? url,
    srcSet: parts.join(", "),
    sizes: "(min-width: 1024px) 340px, (min-width: 640px) 33vw, 45vw",
  };
}

/** Responsive sources for the main product gallery image (keeps full-res as the top step). */
export function galleryImageProps(url: string): {
  src: string;
  srcSet?: string;
  sizes?: string;
} {
  const e = entryFor(url);
  if (!e) return { src: url };
  const parts: string[] = [];
  if (e["400"]) parts.push(`${e["400"]} 400w`);
  if (e["800"]) parts.push(`${e["800"]} 800w`);
  if (e.w) parts.push(`${url} ${e.w}w`);
  if (!parts.length) return { src: url };
  return {
    src: url,
    srcSet: parts.join(", "),
    sizes: "(min-width: 640px) 720px, 100vw",
  };
}

/** Smallest available variant, used for tiny thumbnails. */
export function thumbImage(url: string): string {
  const e = entryFor(url);
  return e?.["400"] ?? e?.["800"] ?? url;
}
