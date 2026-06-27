import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/products";
import { colourOptionsFrom, widthOptionsFrom, type Product } from "@/data/products";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Filters, type FilterState } from "@/components/Filters";
import { TrustBadges } from "@/components/TrustBadges";
import { ReviewCarousel } from "@/components/ReviewCarousel";
import { FAQ } from "@/components/FAQ";
import { OpeningHours } from "@/components/OpeningHours";
import { LocationMap } from "@/components/LocationMap";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { EnquireButtons } from "@/components/EnquireButtons";
import { SITE } from "@/lib/site";
import { FAQS } from "@/data/faqs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.name} — Quality Carpet Roll Ends in Bradford` },
      { name: "description", content: SITE.description },
      { property: "og:title", content: `${SITE.name} — Carpet Roll Ends in Bradford` },
      { property: "og:description", content: SITE.description },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: HomePage,
});

function sortProducts(items: Product[], sort: FilterState["sort"]): Product[] {
  const arr = [...items];
  switch (sort) {
    case "popularity":
      return arr.sort((a, b) => b.popularity - a.popularity);
    case "newest":
      return arr.sort((a, b) => +new Date(b.dateAdded) - +new Date(a.dateAdded));
    case "price-asc":
      return arr.sort((a, b) => a.fromPrice - b.fromPrice);
    case "price-desc":
      return arr.sort((a, b) => b.fromPrice - a.fromPrice);
    case "size":
      return arr.sort(
        (a, b) =>
          Math.max(0, ...b.sizes.map((s) => s.widthM * s.lengthM)) -
          Math.max(0, ...a.sizes.map((s) => s.widthM * s.lengthM)),
      );
  }
}

function HomePage() {
  const { data: products = [], isLoading } = useQuery(productsQuery());
  const [state, setState] = useState<FilterState>({
    search: "",
    colour: "",
    width: "",
    sort: "popularity",
  });

  const colourOptions = useMemo(() => colourOptionsFrom(products), [products]);
  const widthOptions = useMemo(() => widthOptionsFrom(products), [products]);

  const filtered = useMemo(() => {
    const q = state.search.trim().toLowerCase();
    let items = products.filter((p) => {
      if (state.colour && p.colour !== state.colour) return false;
      if (state.width && !p.widthsM.includes(Number(state.width))) return false;
      if (q) {
        const blob = `${p.name} ${p.colour} ${p.material} ${p.pile} ${p.sku}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
    items = sortProducts(items, state.sort);
    return items;
  }, [products, state]);

  return (
    <>
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-dark" aria-hidden />
        <div
          className="absolute inset-0 opacity-[0.07]"
          aria-hidden
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, transparent 0 38px, rgba(255,255,255,0.5) 38px 40px)",
          }}
        />
        <div className="relative container-page py-14 md:py-20 text-center">
          <span className="inline-block bg-white/15 border border-white/30 text-[11px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded mb-4">
            {SITE.tagline}
          </span>
          <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
            Quality Carpet Roll Ends
            <br />
            <span className="text-white/80">at Unbeatable Prices</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-white/85 text-base md:text-lg">
            Off-cuts and roll ends in all sizes and styles — direct from {SITE.name}. First come,
            first served.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm">
            {["Massive Discounts", "4m & 5m Widths", "Bradford Based", "Click & Collect"].map((t) => (
              <span key={t} className="bg-white/10 border border-white/15 px-3 py-1 rounded-full font-bold">
                ✓ {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <TrustBadges />

      <section className="container-page" aria-labelledby="listing-heading">
        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
          <h2 id="listing-heading" className="text-xl md:text-2xl font-black">
            Current Roll Ends
          </h2>
          <span className="text-sm text-mid font-bold">
            {isLoading ? "Loading…" : `${filtered.length} available`}
          </span>
        </div>

        <Filters
          state={state}
          onChange={setState}
          colourOptions={colourOptions}
          widthOptions={widthOptions}
        />

        <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : filtered.length === 0
              ? (
                <div className="col-span-full card-surface p-10 text-center">
                  <p className="font-black mb-2">No roll ends match your filters</p>
                  <p className="text-sm text-mid mb-4">
                    Try clearing search or filters — or call us, we may have new stock in.
                  </p>
                  <EnquireButtons size="md" />
                </div>
              )
              : filtered.map((p) => <ProductCard key={p.sku} product={p} />)}
        </div>
      </section>

      <RecentlyViewed />

      <ReviewCarousel />

      <section className="container-page my-16 grid gap-6 lg:grid-cols-[1.4fr_1fr]" aria-label="Visit us">
        <LocationMap />
        <OpeningHours />
      </section>

      <FAQ />

      <section className="container-page my-16">
        <div className="card-surface p-8 md:p-12 text-center bg-charcoal text-white">
          <h2 className="text-2xl md:text-3xl font-black">Found one you like?</h2>
          <p className="text-neutral-300 mt-2 mb-6">
            Roll ends sell fast. Give us a call or email and we'll hold it for you.
          </p>
          <div className="flex justify-center">
            <EnquireButtons />
          </div>
        </div>
      </section>
    </>
  );
}
