import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/products";
import { colourOptionsFrom, type Product } from "@/data/products";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Filters, type FilterState } from "@/components/Filters";

import { ReviewCarousel } from "@/components/ReviewCarousel";
import { FAQ } from "@/components/FAQ";
import { OpeningHours } from "@/components/OpeningHours";
import { LocationMap } from "@/components/LocationMap";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { EnquireButtons } from "@/components/EnquireButtons";
import { PromoBanner } from "@/components/PromoBanner";
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
  const navigate = useNavigate();
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

        <div className="relative container-page py-8 md:py-14 text-center flex flex-col items-center">
          <h1 className="font-impact uppercase italic leading-[0.9] text-[2.1rem] sm:text-5xl md:text-7xl z-10 drop-shadow-[3px_3px_0_rgba(0,0,0,0.45)]">
            Yorkshire's No1
            <br />
            <span className="text-pop">carpet outlet</span>
          </h1>

          <p className="mt-4 md:mt-5 max-w-2xl text-signal font-black text-base sm:text-lg md:text-2xl uppercase tracking-tight z-10 text-balance">
            End of line and carpet roll end specialists
          </p>

          <div className="mt-5 md:mt-6 z-10 w-screen">
            <PromoBanner />
          </div>

          <div className="mt-7 md:mt-8 z-10 w-full max-w-4xl">
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate({ to: "/how-to-buy" })}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate({ to: "/how-to-buy" }); } }}
              className="bg-bolt border-[3px] md:border-4 border-charcoal shadow-[5px_5px_0_0_rgba(0,0,0,0.55)] md:shadow-[6px_6px_0_0_rgba(0,0,0,0.55)] p-4 md:p-7 cursor-pointer transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-pop"
            >
              <h2 className="font-impact uppercase italic text-bolt-foreground text-2xl md:text-4xl mb-5 md:mb-6 tracking-wide drop-shadow-[2px_2px_0_rgba(0,0,0,0.6)]">
                How to <span className="text-pop">order</span>
              </h2>
              <ol className="grid gap-4 md:gap-3 md:grid-cols-3 text-left">
                <li className="bg-white text-charcoal p-4 border-[3px] border-charcoal shadow-[4px_4px_0_0_rgba(0,0,0,0.55)] relative">
                  <span className="absolute -top-4 -left-3 bg-pop text-pop-foreground font-impact text-2xl leading-none px-2.5 py-1 border-[3px] border-charcoal shadow-[3px_3px_0_0_rgba(0,0,0,0.55)]">1</span>
                  <div className="font-black uppercase text-sm md:text-base leading-tight mt-3 mb-1.5">Choose your roll end</div>
                  <p className="text-xs md:text-sm font-bold leading-snug text-mid">Browse our stock and pick the carpet that suits your room.</p>
                </li>
                <li className="bg-white text-charcoal p-4 border-[3px] border-charcoal shadow-[4px_4px_0_0_rgba(0,0,0,0.55)] relative">
                  <span className="absolute -top-4 -left-3 bg-pop text-pop-foreground font-impact text-2xl leading-none px-2.5 py-1 border-[3px] border-charcoal shadow-[3px_3px_0_0_rgba(0,0,0,0.55)]">2</span>
                  <div className="font-black uppercase text-sm md:text-base leading-tight mt-3 mb-1.5">Note the reference number</div>
                  <p className="text-xs md:text-sm font-bold leading-snug text-mid">Each roll has a unique reference number next to the price — note it down for when you call.</p>
                </li>
                <li className="bg-pop text-pop-foreground p-4 border-[3px] border-charcoal shadow-[4px_4px_0_0_rgba(0,0,0,0.55)] relative">
                  <span className="absolute -top-4 -left-3 bg-white text-charcoal font-impact text-2xl leading-none px-2.5 py-1 border-[3px] border-charcoal shadow-[3px_3px_0_0_rgba(0,0,0,0.55)]">3</span>
                  <div className="font-black uppercase text-sm md:text-base leading-tight mt-3 mb-1.5">CALL US TO BUY</div>
                  <p className="text-xs md:text-sm font-bold leading-snug">
                    Call{" "}
                    <a href="tel:01274057433" onClick={(e) => e.stopPropagation()} className="underline decoration-2 underline-offset-2 decoration-charcoal">01274 057433</a>{" "}
                    to confirm availability and arrange pickup or delivery.
                  </p>
                </li>
              </ol>
            </div>
          </div>

          <a href="#listing-heading" className="btn-pop mt-7 md:mt-8 w-full sm:w-auto text-center text-lg md:text-2xl">
            Shop the deals
          </a>
        </div>

      </section>

      

      <section className="container-page" aria-labelledby="listing-heading">
        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
          <h2 id="listing-heading" className="text-xl md:text-2xl font-black whitespace-pre-line">
            {"\n\n"}Current Roll Ends
          </h2>
          <span className="text-sm text-mid font-bold whitespace-pre-line text-right">
            {"\n"}{isLoading ? "Loading…" : `${filtered.length} available`}
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
        <div className="card-surface p-8 md:p-12 text-center bg-charcoal text-white border-y-8 border-pop">
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
