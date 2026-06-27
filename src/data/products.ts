export type Size = { label: string; widthM: number; lengthM: number; price: number };

export type Product = {
  id?: string;
  sku: string;
  slug: string;
  name: string;
  colour: string;
  colourHex: string;
  widthsM: number[];
  material: string;
  pile: string;
  category: string;
  popularity: number;
  dateAdded: string;
  fromPrice: number;
  images: string[];
  description: string;
  features: string[];
  sizes: Size[];
};

export type ProductRow = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  colour: string;
  colour_hex: string;
  widths_m: number[] | null;
  material: string;
  pile: string;
  category: string;
  popularity: number;
  date_added: string;
  from_price: number;
  images: string[] | null;
  description: string;
  features: string[] | null;
  sizes: unknown;
  is_active: boolean;
};

export function rowToProduct(r: ProductRow): Product {
  return {
    id: r.id,
    sku: r.sku,
    slug: r.slug,
    name: r.name,
    colour: r.colour,
    colourHex: r.colour_hex,
    widthsM: (r.widths_m ?? []).map(Number),
    material: r.material,
    pile: r.pile,
    category: r.category,
    popularity: r.popularity,
    dateAdded: r.date_added,
    fromPrice: Number(r.from_price),
    images: r.images ?? [],
    description: r.description,
    features: r.features ?? [],
    sizes: Array.isArray(r.sizes) ? (r.sizes as Size[]) : [],
  };
}

export function colourOptionsFrom(products: Product[]) {
  return Array.from(new Map(products.map((p) => [p.colour, p.colourHex])).entries()).map(
    ([colour, hex]) => ({ colour, hex }),
  );
}

export function widthOptionsFrom(products: Product[]) {
  return Array.from(new Set(products.flatMap((p) => p.widthsM))).sort((a, b) => a - b);
}

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

export const CATEGORY_VALUES = [
  "saxony",
  "berber",
  "twist",
  "loop",
  "velvet",
  "flatweave",
] as const;
