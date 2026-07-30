import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/products";
import { colourOptionsFrom, type Product } from "@/data/products";
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
      { title: `Yorkshire's No1 Offcut Outlet — Clearance Carpet Roll Ends | ${SITE.name}` },
      { name: "description", content: "Heavily discounted carpet roll ends and offcuts at clearance prices. Grab a bargain — first come, first served at our Bradford outlet." },
      { property: "og:title", content: `Yorkshire's No1 Offcut Outlet — ${SITE.name}` },
      { property: "og:description", content: "Heavily discounted carpet roll ends and offcuts at clearance prices. Grab a bargain — first come, first served." },
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
    case "name":
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
      return arr.sort((a, b) => +new Date(b.dateAdded) - +new Date(a.dateAdded));
    case "price-asc":
      return arr.sort((a, b) => a.fromPrice - b.fromPrice);
    case "price-desc":
      return arr.sort((a, b) => b.fromPrice - a.fromPrice);
  }
}

function HomePage() {
  const { data: products = [], isLoading } = useQuery(productsQuery());
  const [state, setState] = useState<FilterState>({
    search: "",
    colour: "",
    roomLength: "",
    roomWidth: "",
    sort: "name",
  });

  const colourOptions = useMemo(() => colourOptionsFrom(products), [products]);

  const filtered = useMemo(() => {
    const q = state.search.trim().toLowerCase();
    const needL = Number(state.roomLength) || 0;
    const needW = Number(state.roomWidth) || 0;
    let items = products.filter((p) => {
      if (state.colour && p.colour !== state.colour) return false;
      if (needL > 0 || needW > 0) {
        const fits = p.sizes.some(
          (s) =>
            (Number(s.lengthM) >= needL && Number(s.widthM) >= needW) ||
            (Number(s.lengthM) >= needW && Number(s.widthM) >= needL),
        );
        if (!fits) return false;
      }
      if (q) {
        const blob = `${p.name} ${p.colour} ${p.material} ${p.pile} ${p.sku}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
    items = sortProducts(items, state.sort);
    return items;
  }, [products, state]);


  const minPrice = products.length
    ? Math.min(...products.map((p) => p.fromPrice))
    : null;

  return (
    <>
      <section className="relative overflow-hidden text-white border-y-8 md:border-y-[10px] border-pop">
        <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-dark" aria-hidden />
        {/* Clearance SALE watermark */}
        <div
          className="absolute inset-0 hidden md:flex items-center justify-center select-none pointer-events-none"
          aria-hidden
        >
          <span className="font-impact text-[20rem] text-white opacity-10 leading-none">SALE</span>
        </div>

        {/* Clearance! badge */}
        <div className="absolute top-5 right-4 md:right-8 rotate-12 bg-pop text-pop-foreground font-black py-2.5 px-5 md:px-8 text-lg md:text-2xl border-4 border-charcoal shadow-[5px_5px_0_0_rgba(0,0,0,1)] uppercase z-10">
          Clearance!
        </div>
        {/* Bradford Based badge */}
        <div className="absolute bottom-5 left-4 md:left-8 -rotate-6 bg-pop text-pop-foreground font-black py-1.5 px-4 md:px-6 text-base md:text-xl border-2 border-charcoal uppercase tracking-tight z-10">
          Bradford Based
        </div>

        <div className="relative container-page py-12 md:py-20 text-center flex flex-col items-center">
          <div className="inline-block bg-charcoal text-white px-4 py-1 mb-4 font-black uppercase tracking-widest text-xs md:text-sm z-10">
            Everything must go
          </div>

          <h1 className="font-impact uppercase italic leading-[0.9] text-4xl md:text-8xl z-10 drop-shadow-[3px_3px_0_rgba(0,0,0,0.45)]">
            Yorkshire's No1
            <br />
            <span className="text-pop">offcut outlet</span>
          </h1>

          <p className="mt-5 max-w-2xl text-white font-black text-lg md:text-2xl uppercase tracking-tight z-10">
            Massive savings on{" "}
            <span className="bg-pop text-pop-foreground px-2">carpet roll ends</span> & clearance stock
          </p>

          <a href="#listing-heading" className="btn-pop mt-7 text-xl md:text-2xl">
            Shop the deals
          </a>
        </div>

        {/* From £ price tag */}
        {minPrice != null && (
          <div className="absolute bottom-5 right-4 md:right-10 flex flex-col items-center z-10">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-pop rounded-full flex flex-col items-center justify-center border-4 border-charcoal -rotate-12 shadow-xl">
              <span className="text-pop-foreground font-black text-[10px] uppercase leading-none">From</span>
              <span className="text-pop-foreground font-impact text-2xl md:text-3xl leading-none">£{minPrice}</span>
            </div>
          </div>
        )}
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

      <section className="container-page my-10 md:my-16 grid gap-5 md:gap-6 lg:grid-cols-[1.4fr_1fr]" aria-label="Visit us">
        <LocationMap />
        <OpeningHours />
      </section>

      <FAQ />

      <section className="container-page my-10 md:my-16">
        <div className="card-surface p-8 md:p-12 text-center bg-charcoal text-white">
          <h2 className="text-2xl md:text-3xl font-black">See something you like?</h2>
          <p className="text-neutral-300 mt-2 mb-6">
            Roll ends sell fast. Give us a call and we'll hold it for you.
          </p>
          <div className="flex justify-center">
            <EnquireButtons />
          </div>
        </div>
      </section>
    </>
  );
}
