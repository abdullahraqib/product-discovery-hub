import { useEffect, useState } from "react";
import { getRecentlyViewed } from "@/lib/recently-viewed";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function RecentlyViewed({ exclude }: { exclude?: string }) {
  const [skus, setSkus] = useState<string[]>([]);
  useEffect(() => {
    setSkus(getRecentlyViewed().filter((s) => s !== exclude));
  }, [exclude]);

  const items = skus
    .map((sku) => PRODUCTS.find((p) => p.sku === sku))
    .filter((p): p is (typeof PRODUCTS)[number] => Boolean(p));

  if (items.length === 0) return null;

  return (
    <section className="container-page my-12" aria-label="Recently viewed">
      <h2 className="text-xl font-black mb-4">Recently viewed</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.slice(0, 4).map((p) => (
          <ProductCard key={p.sku} product={p} />
        ))}
      </div>
    </section>
  );
}
