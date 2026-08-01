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
      { title: "Carpet Roll Ends & Remnants | Cheap Carpets Bradford" },
      { name: "description", content: "Carpet roll ends, remnants, offcuts and end of line carpets at clearance prices. 4m & 5m widths, up to 70% off, new stock weekly at our Bradford outlet." },
      { property: "og:title", content: `Carpet Roll Ends, Remnants & Offcuts — ${SITE.name}` },
      { property: "og:description", content: "Cheap carpet roll ends, remnants and end of line carpets at clearance prices. First come, first served at our Bradford outlet." },
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
      <section className="relative overflow-hidden text-white border-y-4 md:border-y-[10px] border-pop">
        <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-dark" aria-hidden />
        {/* Clearance SALE watermark */}
        <div
          className="absolute inset-0 hidden md:flex items-center justify-center select-none pointer-events-none"
          aria-hidden
        >
          <span className="font-impact text-[20rem] text-white opacity-10 leading-none">SALE</span>
        </div>

        <div className="relative container-page py-3 md:py-14 text-center flex flex-col items-center">
          <h1 className="font-impact uppercase italic leading-[0.9] text-[1.9rem] sm:text-5xl md:text-7xl z-10 drop-shadow-[3px_3px_0_rgba(0,0,0,0.45)]">
            Yorkshire's No1
            <br />
            <span className="text-pop">carpet outlet</span>
          </h1>

          <p className="mt-2 md:mt-5 max-w-2xl text-white font-black text-sm sm:text-lg md:text-2xl uppercase tracking-tight z-10 text-balance">
            END OF LINE CARPET AND ROLL END SPECIALISTS
          </p>

          <div className="mt-3 md:mt-6 z-10 w-screen">
            <PromoBanner />
          </div>

          <div className="mt-4 md:mt-8 z-10 w-full max-w-4xl">
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate({ to: "/how-to-buy" })}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate({ to: "/how-to-buy" }); } }}
              className="bg-bolt border-[3px] md:border-4 border-charcoal shadow-[5px_5px_0_0_rgba(0,0,0,0.55)] md:shadow-[6px_6px_0_0_rgba(0,0,0,0.55)] p-3 md:p-7 cursor-pointer transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-pop"
            >
              <h2 className="font-impact uppercase italic text-bolt-foreground text-xl md:text-4xl mb-3 md:mb-6 tracking-wide drop-shadow-[2px_2px_0_rgba(0,0,0,0.6)]">
                How to <span className="text-pop">order</span>
              </h2>
              <ol className="grid gap-2.5 md:gap-3 md:grid-cols-3 text-left">
                <li className="bg-white text-charcoal p-3 md:p-4 border-[3px] border-charcoal shadow-[4px_4px_0_0_rgba(0,0,0,0.55)] relative">
                  <span className="absolute -top-3.5 -left-2.5 bg-pop text-pop-foreground font-impact text-lg md:text-2xl leading-none px-2 py-0.5 md:px-2.5 md:py-1 border-[3px] border-charcoal shadow-[3px_3px_0_0_rgba(0,0,0,0.55)]">1</span>
                  <div className="font-black uppercase text-xs md:text-base leading-tight mt-2 mb-1 md:mt-3 md:mb-1.5">Choose your roll end</div>
                  <p className="text-[0.7rem] md:text-sm font-bold leading-snug text-mid">Browse our stock and pick the carpet that suits your room.</p>
                </li>
                <li className="bg-white text-charcoal p-3 md:p-4 border-[3px] border-charcoal shadow-[4px_4px_0_0_rgba(0,0,0,0.55)] relative">
                  <span className="absolute -top-3.5 -left-2.5 bg-pop text-pop-foreground font-impact text-lg md:text-2xl leading-none px-2 py-0.5 md:px-2.5 md:py-1 border-[3px] border-charcoal shadow-[3px_3px_0_0_rgba(0,0,0,0.55)]">2</span>
                  <div className="font-black uppercase text-xs md:text-base leading-tight mt-2 mb-1 md:mt-3 md:mb-1.5">Note the reference number</div>
                  <p className="text-[0.7rem] md:text-sm font-bold leading-snug text-mid">Each roll has a <span className="text-[#dc2626] font-black">red reference number</span> located next to the price — note it down for when you call.</p>
                </li>
                <li className="bg-pop text-pop-foreground p-3 md:p-4 border-[3px] border-charcoal shadow-[4px_4px_0_0_rgba(0,0,0,0.55)] relative">
                  <span className="absolute -top-3.5 -left-2.5 bg-white text-charcoal font-impact text-lg md:text-2xl leading-none px-2 py-0.5 md:px-2.5 md:py-1 border-[3px] border-charcoal shadow-[3px_3px_0_0_rgba(0,0,0,0.55)]">3</span>
                  <div className="font-black uppercase text-xs md:text-base leading-tight mt-2 mb-1 md:mt-3 md:mb-1.5">CALL US TO BUY</div>
                  <p className="text-[0.7rem] md:text-sm font-bold leading-snug">
                    Call{" "}
                    <a href="tel:01274057433" onClick={(e) => e.stopPropagation()} className="underline decoration-2 underline-offset-2 decoration-charcoal">01274 057433</a>{" "}
                    to speak to a <strong className="font-black">real human being</strong> who can confirm availability and arrange pickup or delivery.
                  </p>
                </li>
              </ol>
            </div>
          </div>

          <a href="#listing-heading" className="btn-pop mt-3 md:mt-8 w-full sm:w-auto text-center text-base md:text-2xl">
            Shop the deals
          </a>
        </div>

      </section>

      

      <section className="container-page" aria-labelledby="listing-heading">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h2 id="listing-heading" className="text-xl md:text-2xl font-black whitespace-pre-line">
            {"\n\n"}Current Roll Ends
          </h2>
          <div className="flex items-center gap-6">
            <span className="text-sm text-mid font-bold">
              {isLoading ? "Loading…" : `${filtered.length} available`}
            </span>
            <label className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-mid hidden sm:inline">Sort by</span>
              <select
                value={state.sort}
                onChange={(e) => setState({ ...state, sort: e.target.value as FilterState["sort"] })}
                className="px-2.5 py-1.5 text-sm font-bold border-2 border-border rounded-md focus:border-brand outline-none bg-white"
                aria-label="Sort by"
              >
                <option value="name">Name: A–Z</option>
                <option value="newest">Recently added</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </label>
          </div>
        </div>

        <Filters
          state={state}
          onChange={setState}
          colourOptions={colourOptions}
        />

        <div className="mt-5 grid gap-3 grid-cols-2 sm:gap-5 lg:grid-cols-3">
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
            Roll ends sell fast. Give us a call and we'll hold it for you after payment.
          </p>
          <div className="flex justify-center">
            <EnquireButtons />
          </div>
        </div>
      </section>
    </>
  );
}
