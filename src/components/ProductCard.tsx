import { Link } from "@tanstack/react-router";
import { fromWasPrice, type Product } from "@/data/products";
import { firstImage, isVideo } from "@/lib/media";
import { Play } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const cover = firstImage(product.images);
  const wasPrice = fromWasPrice(product);
  const video = product.images.find(isVideo);
  const altFor = (src?: string) => {
    if (!src) return product.name;
    const i = product.images.indexOf(src);
    return product.imageAlts?.[i]?.trim() || product.name;
  };
  return (
    <Link
      to="/roll-ends/$sku"
      params={{ sku: product.sku }}
      className="card-surface overflow-hidden flex flex-col group hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
        {cover ? (
          <img
            src={cover}
            alt={altFor(cover)}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : video ? (
          <video
            src={video}
            aria-label={altFor(video)}
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        ) : null}
        {video && (
          <span className="absolute bottom-2 right-2 bg-charcoal/80 text-white rounded-full p-1.5">
            <Play size={12} />
          </span>
        )}
        <span className="absolute top-2 left-2 bg-charcoal text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded">
          {product.sku}
        </span>
      </div>
      <div className="p-3 sm:p-4 flex-1 flex flex-col gap-1.5 sm:gap-2">
        <h3 className="font-black text-sm sm:text-[15px] leading-tight">{product.name}</h3>
        <p className="text-xs sm:text-sm text-mid leading-snug">
          {product.widthsM.join("m & ")}m widths • {product.material}
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-auto pt-2.5 sm:pt-3 border-t border-border">
          <div className="min-w-0 text-[15px] sm:text-xl font-black text-brand leading-tight">
            from{" "}
            {wasPrice !== null && (
              <span className="text-[11px] sm:text-sm font-bold text-mid line-through mr-1">
                £{wasPrice}
              </span>
            )}
            £{product.fromPrice}
            <span className="text-[10px] sm:text-xs font-normal text-mid"> /roll end</span>
          </div>
          <span className="enquire-btn text-[10px] sm:text-xs font-black uppercase tracking-wider bg-brand text-white px-2.5 sm:px-3 py-1.5 rounded shrink-0 text-center">
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
