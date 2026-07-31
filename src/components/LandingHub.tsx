import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/products";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EnquireButtons } from "@/components/EnquireButtons";
import type { LandingHub as Hub } from "@/data/landing";
import { LANDING_HUBS } from "@/data/landing";
import { SITE } from "@/lib/site";

export function LandingHub({ hub }: { hub: Hub }) {
  const { data: products = [], isLoading } = useQuery(productsQuery());
  const items = [...products]
    .sort((a, b) => a.fromPrice - b.fromPrice)
    .slice(0, 12);

  const others = Object.values(LANDING_HUBS).filter((h) => h.slug !== hub.slug);

  return (
    <div className="container-page py-6 md:py-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: hub.breadcrumb }]} />

      <header className="mt-6 mb-8 max-w-3xl">
        <h1 className="font-impact uppercase italic text-3xl md:text-5xl leading-[0.95]">
          {hub.h1}
        </h1>
        <p className="text-mid mt-4 leading-relaxed">{hub.intro}</p>
        <div className="mt-5">
          <EnquireButtons />
        </div>
      </header>

      <section aria-labelledby="stock-heading">
        <h2 id="stock-heading" className="text-2xl font-black mb-4">
          In stock now
        </h2>
        {isLoading ? (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="card-surface p-10 text-center text-mid">
            Nothing listed online right now — call {SITE.phone} for today's stock.
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        )}
        <div className="mt-6">
          <Link to="/" className="btn-brand inline-flex">
            See all roll ends
          </Link>
        </div>
      </section>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-8 max-w-3xl">
          {hub.sections.map((s) => (
            <section key={s.h2}>
              <h2 className="text-xl md:text-2xl font-black">{s.h2}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="text-mid mt-3 leading-relaxed">
                  {p}
                </p>
              ))}
            </section>
          ))}

          <section aria-labelledby="hub-faqs">
            <h2 id="hub-faqs" className="text-xl md:text-2xl font-black">
              Frequently asked questions
            </h2>
            <dl className="mt-4 space-y-4">
              {hub.faqs.map((f) => (
                <div key={f.q} className="card-surface p-4">
                  <dt className="font-black">{f.q}</dt>
                  <dd className="text-mid mt-2 leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="card-surface p-5">
            <h2 className="text-lg font-black">Visit the outlet</h2>
            <p className="text-mid mt-2 text-sm leading-relaxed">
              {SITE.address.full}
              <br />
              Mon–Fri 10–6, Sat 9–6, Sun 11–5
            </p>
            <a href={SITE.phoneTel} className="btn-brand mt-4 inline-flex">
              Call {SITE.phone}
            </a>
          </div>
          <nav className="card-surface p-5" aria-label="Related pages">
            <h2 className="text-lg font-black">Related</h2>
            <ul className="mt-3 space-y-2 text-sm font-bold">
              {others.map((h) => (
                <li key={h.slug}>
                  <a href={h.slug} className="hover:text-brand">
                    {h.h1}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/measuring-guide" className="hover:text-brand">
                  Free measuring guide
                </Link>
              </li>
              <li>
                <Link to="/how-to-buy" className="hover:text-brand">
                  How to buy
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}

export function hubHead(hub: Hub) {
  return {
    meta: [
      { title: hub.title },
      { name: "description", content: hub.description },
      { property: "og:title", content: hub.title },
      { property: "og:description", content: hub.description },
      { property: "og:url", content: hub.slug },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: hub.slug }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: hub.breadcrumb, item: hub.slug },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: hub.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]),
      },
    ],
  };
}
