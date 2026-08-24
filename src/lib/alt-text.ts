import type { Product } from "@/data/products";

/**
 * Build SEO-friendly alt text for a product image/video.
 * Keeps it descriptive, keyword-rich and under ~125 characters.
 */
export function generateAltText(
  p: Pick<Product, "name" | "colour" | "colour2" | "material" | "pile" | "widthsM">,
  index: number,
  isVideoMedia = false,
): string {
  const colours = [p.colour, p.colour2].map((c) => (c ?? "").trim()).filter(Boolean);
  const colour = colours.join(" and ");
  const bits: string[] = [];

  const noun = p.material?.trim()
    ? `${p.material.trim()} carpet roll end`
    : "carpet roll end";

  bits.push([colour, noun].filter(Boolean).join(" "));
  if (p.name?.trim()) bits.push(p.name.trim());
  if (p.pile?.trim()) bits.push(`${p.pile.trim()} pile`);
  const widths = (p.widthsM ?? []).filter((w) => Number(w) > 0);
  if (widths.length) bits.push(`${widths.join("m & ")}m width`);

  const label = isVideoMedia ? "video" : index === 0 ? "main photo" : `photo ${index + 1}`;
  bits.push(label);

  const alt = bits.join(", ").replace(/\s+/g, " ").trim();
  const cap = alt.charAt(0).toUpperCase() + alt.slice(1);
  return cap.length > 125 ? cap.slice(0, 122).trimEnd() + "..." : cap;
}
