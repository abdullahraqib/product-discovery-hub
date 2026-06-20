import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/roll-ends/$sku"
      params={{ sku: product.sku }}
      className="card-surface overflow-hidden flex flex-col group hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-2 left-2 bg-charcoal text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded">
          {product.sku}
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-4 w-4 rounded-full border border-border shrink-0"
            style={{ background: product.colourHex }}
          />
          <h3 className="font-black text-[15px] leading-tight">{product.name}</h3>
        </div>
        <p className="text-sm text-mid">
          {product.widthsM.join("m & ")}m widths • {product.material}
        </p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <div className="text-xl font-black text-brand">
            from £{product.fromPrice}
            <span className="text-xs font-normal text-mid"> /roll end</span>
          </div>
          <span className="enquire-btn text-xs font-black uppercase tracking-wider bg-brand text-white px-3 py-1.5 rounded">
            View
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card-surface overflow-hidden flex flex-col">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 skeleton w-3/4" />
        <div className="h-3 skeleton w-1/2" />
        <div className="h-8 skeleton w-full mt-3" />
      </div>
    </div>
  );
}
