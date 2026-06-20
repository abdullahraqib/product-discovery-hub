export type Size = { label: string; widthM: number; lengthM: number; price: number };

export type Product = {
  sku: string;
  slug: string;
  name: string;
  colour: string;
  colourHex: string;
  widthsM: number[];
  material: string;
  pile: string;
  category: "saxony" | "berber" | "twist" | "loop" | "velvet" | "flatweave";
  popularity: number; // 0–100
  dateAdded: string; // ISO
  fromPrice: number;
  images: string[];
  description: string;
  features: string[];
  sizes: Size[];
};

const img = (seed: string, w = 900) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=${w}&q=70`;

export const PRODUCTS: Product[] = [
  {
    sku: "SRC-001",
    slug: "saxony-plush-charcoal-grey",
    name: "Saxony Plush — Charcoal Grey",
    colour: "Charcoal Grey",
    colourHex: "#3a3a3a",
    widthsM: [4, 5],
    material: "80% Wool Blend",
    pile: "Saxony",
    category: "saxony",
    popularity: 92,
    dateAdded: "2026-06-15",
    fromPrice: 65,
    images: [
      img("photo-1493663284031-b7e3aefcae8e"),
      img("photo-1555041469-a586c61ea9bc"),
      img("photo-1600585154340-be6161a56a0c"),
    ],
    description:
      "A luxuriously dense saxony pile in deep charcoal grey. Soft underfoot with a refined, modern finish — perfect for living rooms and bedrooms.",
    features: ["80% wool blend", "Heavy domestic rating", "Stain resistant"],
    sizes: [
      { label: "4m × 3m", widthM: 4, lengthM: 3, price: 65 },
      { label: "4m × 4m", widthM: 4, lengthM: 4, price: 85 },
      { label: "5m × 4m", widthM: 5, lengthM: 4, price: 110 },
      { label: "5m × 5m", widthM: 5, lengthM: 5, price: 135 },
    ],
  },
  {
    sku: "SRC-002",
    slug: "berber-loop-natural-beige",
    name: "Berber Loop — Natural Beige",
    colour: "Natural Beige",
    colourHex: "#cdb999",
    widthsM: [4, 5],
    material: "100% Polypropylene",
    pile: "Berber Loop",
    category: "berber",
    popularity: 78,
    dateAdded: "2026-05-28",
    fromPrice: 85,
    images: [
      img("photo-1493663284031-b7e3aefcae8e"),
      img("photo-1505691938895-1758d7feb511"),
    ],
    description:
      "Hard-wearing berber loop in a warm natural beige. Ideal for hallways, stairs and high-traffic rooms.",
    features: ["100% polypropylene", "Bleach cleanable", "Hard-wearing"],
    sizes: [
      { label: "4m × 3m", widthM: 4, lengthM: 3, price: 85 },
      { label: "4m × 4m", widthM: 4, lengthM: 4, price: 105 },
      { label: "5m × 4m", widthM: 5, lengthM: 4, price: 135 },
    ],
  },
  {
    sku: "SRC-003",
    slug: "twist-pile-warm-cream",
    name: "Twist Pile — Warm Cream",
    colour: "Warm Cream",
    colourHex: "#e7d9c4",
    widthsM: [4, 5],
    material: "50% Wool Blend",
    pile: "Twist",
    category: "twist",
    popularity: 64,
    dateAdded: "2026-04-10",
    fromPrice: 50,
    images: [
      img("photo-1505691938895-1758d7feb511"),
      img("photo-1493663284031-b7e3aefcae8e"),
    ],
    description:
      "Classic twist pile in a soft warm cream. A versatile carpet that suits any room in the home.",
    features: ["50% wool blend", "Twist pile", "Stain resistant"],
    sizes: [
      { label: "4m × 3m", widthM: 4, lengthM: 3, price: 50 },
      { label: "4m × 4m", widthM: 4, lengthM: 4, price: 70 },
      { label: "5m × 4m", widthM: 5, lengthM: 4, price: 95 },
    ],
  },
  {
    sku: "SRC-004",
    slug: "loop-pile-dark-navy",
    name: "Loop Pile — Dark Navy",
    colour: "Dark Navy",
    colourHex: "#1a2a48",
    widthsM: [4, 5],
    material: "100% Nylon",
    pile: "Loop",
    category: "loop",
    popularity: 55,
    dateAdded: "2026-06-01",
    fromPrice: 110,
    images: [
      img("photo-1600585154340-be6161a56a0c"),
      img("photo-1493663284031-b7e3aefcae8e"),
    ],
    description:
      "Deep navy loop pile with a tight, contract-grade construction. Tough enough for offices, smart enough for studies.",
    features: ["100% nylon", "Contract rated", "Colour-fast"],
    sizes: [
      { label: "4m × 4m", widthM: 4, lengthM: 4, price: 110 },
      { label: "5m × 4m", widthM: 5, lengthM: 4, price: 140 },
      { label: "5m × 5m", widthM: 5, lengthM: 5, price: 170 },
    ],
  },
  {
    sku: "SRC-005",
    slug: "velvet-pile-ivory-white",
    name: "Velvet Pile — Ivory White",
    colour: "Ivory White",
    colourHex: "#f3ecdd",
    widthsM: [4, 5],
    material: "80% Wool Blend",
    pile: "Velvet",
    category: "velvet",
    popularity: 88,
    dateAdded: "2026-06-18",
    fromPrice: 55,
    images: [
      img("photo-1505691938895-1758d7feb511"),
      img("photo-1600585154340-be6161a56a0c"),
    ],
    description:
      "Sumptuous velvet pile in clean ivory white — adds instant warmth and elegance to any room.",
    features: ["80% wool blend", "Velvet pile", "Luxury finish"],
    sizes: [
      { label: "4m × 3m", widthM: 4, lengthM: 3, price: 55 },
      { label: "4m × 4m", widthM: 4, lengthM: 4, price: 75 },
      { label: "5m × 4m", widthM: 5, lengthM: 4, price: 100 },
    ],
  },
  {
    sku: "SRC-006",
    slug: "flatweave-herringbone-grey",
    name: "Flatweave — Herringbone Grey",
    colour: "Herringbone Grey",
    colourHex: "#7a7a7a",
    widthsM: [4],
    material: "100% Polypropylene",
    pile: "Flatweave",
    category: "flatweave",
    popularity: 72,
    dateAdded: "2026-05-05",
    fromPrice: 95,
    images: [
      img("photo-1493663284031-b7e3aefcae8e"),
      img("photo-1555041469-a586c61ea9bc"),
    ],
    description:
      "Modern herringbone flatweave in cool grey. Easy to vacuum and looks fantastic in kitchens and conservatories.",
    features: ["100% polypropylene", "Flatweave", "Easy care"],
    sizes: [
      { label: "4m × 3m", widthM: 4, lengthM: 3, price: 95 },
      { label: "4m × 4m", widthM: 4, lengthM: 4, price: 120 },
      { label: "4m × 5m", widthM: 4, lengthM: 5, price: 150 },
    ],
  },
];

export const COLOUR_OPTIONS = Array.from(
  new Map(PRODUCTS.map((p) => [p.colour, p.colourHex])).entries(),
).map(([colour, hex]) => ({ colour, hex }));

export const WIDTH_OPTIONS = Array.from(new Set(PRODUCTS.flatMap((p) => p.widthsM))).sort();

export const CATEGORIES: { slug: string; name: string; description: string }[] = [
  {
    slug: "saxony-carpets-bradford",
    name: "Saxony Carpets in Bradford",
    description:
      "Discover luxurious saxony carpet roll ends in Bradford. Deep, soft pile with massive discounts on premium wool blends.",
  },
  {
    slug: "berber-loop-carpets-bradford",
    name: "Berber Loop Carpets in Bradford",
    description:
      "Hard-wearing berber loop carpet roll ends. Perfect for hallways, stairs and high-traffic rooms across Bradford.",
  },
  {
    slug: "twist-pile-carpets-bradford",
    name: "Twist Pile Carpets in Bradford",
    description:
      "Classic twist pile carpet roll ends in Bradford — versatile, durable and competitively priced.",
  },
  {
    slug: "wool-carpet-remnants-bradford",
    name: "Wool Carpet Remnants in Bradford",
    description:
      "Premium wool blend carpet remnants and off-cuts. Half a century of carpet expertise behind every roll.",
  },
];

export function categoryToFilter(slug: string): string[] {
  switch (slug) {
    case "saxony-carpets-bradford":
      return ["saxony"];
    case "berber-loop-carpets-bradford":
      return ["berber", "loop"];
    case "twist-pile-carpets-bradford":
      return ["twist"];
    case "wool-carpet-remnants-bradford":
      return ["saxony", "twist", "velvet"];
    default:
      return [];
  }
}
