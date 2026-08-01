import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productQuery } from "@/lib/products";
import type { Product } from "@/data/products";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MediaGallery } from "@/components/MediaGallery";
import { ShareButtons } from "@/components/ShareButtons";
import { EnquireButtons } from "@/components/EnquireButtons";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { SizeDropdown } from "@/components/SizeDropdown";
import { addRecentlyViewed } from "@/lib/recently-viewed";
import { track } from "@/lib/analytics";
import { SITE } from "@/lib/site";
import { isVideo, firstImage } from "@/lib/media";
import { Phone } from "lucide-react";


export const Route = createFileRoute("/roll-ends/$sku")({
  loader: async ({ params, context }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.sku));
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return {};
    const url = `/roll-ends/${p.sku}`;
    return {
      meta: [
        { title: `${p.name} — Roll End (${p.sku}) — ${SITE.shortName}` },
        { name: "description", content: `${p.description} From £${p.fromPrice}.` },
        { property: "og:title", content: `${p.name} — ${SITE.shortName}` },
        { property: "og:description", content: p.description },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
        { property: "og:image", content: firstImage(p.images) ?? "" },
        { name: "twitter:image", content: firstImage(p.images) ?? "" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            sku: p.sku,
            name: p.name,
            description: p.description,
            image: p.images.filter((m) => !isVideo(m)),
            color: p.colour,
            material: p.material,
            brand: { "@type": "Brand", name: SITE.name },
            offers: {
              "@type": "Offer",
              priceCurrency: "GBP",
              price: p.fromPrice,
              availability: "https://schema.org/InStock",
              url,
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Roll Ends", item: "/" },
              { "@type": "ListItem", position: 2, name: p.name, item: url },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="text-2xl font-black">Roll end not found</h1>
      <p className="text-mid mt-2">It may have sold — call us for the latest stock.</p>
      <a href="/" className="btn-brand mt-6 inline-flex">Back to roll ends</a>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { sku } = Route.useParams();
  const { data: product } = useQuery({ ...productQuery(sku) });
  const initial = (Route.useLoaderData() as { product: Product }).product;
  const p = product ?? initial;

  
  const [sizeChoice, setSizeChoice] = useState<string>("");

  useEffect(() => {
    addRecentlyViewed(p.sku);
    track("product_view", { sku: p.sku, name: p.name });
  }, [p.sku, p.name]);

  const url = `/roll-ends/${p.sku}`;
  const selectedIdx = /^\d+$/.test(sizeChoice) ? Number(sizeChoice) : -1;
  const selected = selectedIdx >= 0 ? p.sizes[selectedIdx] : null;
  const sizeRef = (s: { widthM: number; lengthM: number }) =>
    `${p.sku}${Number(s.widthM)}${Number(s.lengthM)}`;
  const sizeLabel = (s: { widthM: number; lengthM: number }) =>
    `${Number(s.lengthM)}m × ${Number(s.widthM)}m`;


  return (
    <article className="container-page py-6 md:py-8">
      <Breadcrumbs items={[{ label: "Roll Ends", to: "/" }, { label: p.name }]} />

      <div className="mt-6 grid gap-5 md:gap-8 lg:grid-cols-2">
        <div>
          <MediaGallery media={p.images} alt={p.name} alts={p.imageAlts} />
        </div>



        <div>
          <div className="text-xs font-black uppercase tracking-[0.2em] text-brand">Ref {p.sku}</div>
          <h1 className="text-2xl md:text-3xl font-black mt-1">{p.name}</h1>

          <div className="flex items-center gap-3 mt-3">
            <span className="text-sm font-bold">{p.colour}</span>
          </div>

          <p className="text-mid mt-4 leading-relaxed">{p.description}</p>

          <dl className="grid grid-cols-2 gap-3 mt-6 text-sm">
            <Detail label="Material" value={p.material} />
            <Detail label="Pile" value={p.pile} />
            <Detail label="Widths" value={p.widthsM.length ? `${p.widthsM.join("m, ")}m` : "—"} />
            <Detail label="From" value={`£${p.fromPrice}`} />
          </dl>

          {p.features.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.features.map((f) => (
                <li key={f} className="text-xs font-bold bg-secondary px-2.5 py-1 rounded-full text-charcoal">
                  ✓ {f}
                </li>
              ))}
            </ul>
          )}

          {p.sizes.length > 0 && (
            <div className="mt-6 card-surface p-5">
              <div className="text-xs font-black uppercase tracking-wider text-mid mb-2">
                Choose a size
              </div>
              <SizeDropdown
                value={sizeChoice}
                onChange={setSizeChoice}
                options={p.sizes.map((s) => ({
                  label: sizeLabel(s),
                  price: s.price,
                  ref: sizeRef(s),
                }))}
              />

              {selected && (
                <div className="mt-3 flex items-center justify-between border-l-4 border-brand bg-secondary px-4 py-3 rounded-r-md">
                  <span className="text-sm font-bold text-mid">
                    {sizeLabel(selected)}
                    <span className="block text-xs font-black uppercase tracking-wider text-brand mt-0.5">
                      Reference number: {sizeRef(selected)}
                    </span>
                  </span>
                  <span className="text-xl font-black text-brand">£{selected.price}</span>
                </div>
              )}

            </div>
          )}

          <div className="mt-4 flex items-center gap-2 text-sm font-bold text-mid bg-secondary rounded-md px-4 py-3 border-l-4 border-[#dc2626]">
            <Phone size={18} className="shrink-0 text-[#dc2626]" aria-hidden />
            <span>
              Note down your <span className="text-[#dc2626] font-black">reference number</span> and call us using the number below to buy.
            </span>
          </div>

          <div className="mt-3">
            <EnquireButtons productName={p.name} sku={p.sku} />
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <ShareButtons url={url} title={p.name} />
          </div>
        </div>
      </div>

      <RecentlyViewed exclude={p.sku} />
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-mid font-black">{label}</dt>
      <dd className="text-sm font-bold mt-0.5">{value}</dd>
    </div>
  );
}
