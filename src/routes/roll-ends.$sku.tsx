import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PRODUCTS, type Product } from "@/data/products";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ImageZoom } from "@/components/ImageZoom";
import { ShareButtons } from "@/components/ShareButtons";
import { EnquireButtons } from "@/components/EnquireButtons";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { addRecentlyViewed } from "@/lib/recently-viewed";
import { track } from "@/lib/analytics";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/roll-ends/$sku")({
  loader: ({ params }) => {
    const product = PRODUCTS.find((p) => p.sku === params.sku);
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
        { property: "og:image", content: p.images[0] },
        { name: "twitter:image", content: p.images[0] },
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
            image: p.images,
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
  const { product } = Route.useLoaderData() as { product: Product };
  const [imageIdx, setImageIdx] = useState(0);
  const [sizeIdx, setSizeIdx] = useState<number | "">("");
  const [customW, setCustomW] = useState("");
  const [customL, setCustomL] = useState("");

  useEffect(() => {
    addRecentlyViewed(product.sku);
    track("product_view", { sku: product.sku, name: product.name });
  }, [product.sku, product.name]);

  const url = `/roll-ends/${product.sku}`;
  const selected = sizeIdx === "" ? null : product.sizes[sizeIdx];

  const customArea = Number(customW) * Number(customL);
  const pricePerSqm = product.fromPrice / (product.sizes[0]?.widthM * product.sizes[0]?.lengthM);
  const customPrice = customArea > 0 ? Math.round(customArea * pricePerSqm) : 0;

  return (
    <article className="container-page py-6 md:py-8">
      <Breadcrumbs
        items={[
          { label: "Roll Ends", to: "/" },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <ImageZoom src={product.images[imageIdx]} alt={product.name} />
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImageIdx(i)}
                  aria-label={`Show image ${i + 1}`}
                  className={`w-20 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                    i === imageIdx ? "border-brand" : "border-transparent"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="text-xs font-black uppercase tracking-[0.2em] text-mid">
            Ref {product.sku}
          </div>
          <h1 className="text-2xl md:text-3xl font-black mt-1">{product.name}</h1>

          <div className="flex items-center gap-3 mt-3">
            <span
              className="h-7 w-7 rounded-full border border-border"
              style={{ background: product.colourHex }}
              aria-hidden
            />
            <span className="text-sm font-bold">{product.colour}</span>
          </div>

          <p className="text-mid mt-4 leading-relaxed">{product.description}</p>

          <dl className="grid grid-cols-2 gap-3 mt-6 text-sm">
            <Detail label="Material" value={product.material} />
            <Detail label="Pile" value={product.pile} />
            <Detail label="Widths" value={`${product.widthsM.join("m, ")}m`} />
            <Detail label="From" value={`£${product.fromPrice}`} />
          </dl>

          {product.features.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {product.features.map((f) => (
                <li
                  key={f}
                  className="text-xs font-bold bg-secondary px-2.5 py-1 rounded-full text-charcoal"
                >
                  ✓ {f}
                </li>
              ))}
            </ul>
          )}

          {/* Size selector */}
          <div className="mt-6 card-surface p-5">
            <div className="text-xs font-black uppercase tracking-wider text-mid mb-2">
              Choose a size
            </div>
            <select
              value={sizeIdx}
              onChange={(e) => setSizeIdx(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full px-3 py-2.5 text-sm font-bold border-2 border-border rounded-md focus:border-brand outline-none bg-white"
            >
              <option value="">— Select a size —</option>
              {product.sizes.map((s, i) => (
                <option key={s.label} value={i}>
                  {s.label} — £{s.price}
                </option>
              ))}
              <option value="custom">Custom size…</option>
            </select>

            {selected && (
              <div className="mt-3 flex items-center justify-between border-l-4 border-brand bg-secondary px-4 py-3 rounded-r-md">
                <span className="text-sm font-bold text-mid">{selected.label}</span>
                <span className="text-xl font-black text-brand">£{selected.price}</span>
              </div>
            )}

            {sizeIdx === ("custom" as unknown as number) && (
              <div className="mt-3 bg-secondary border border-border rounded-md p-4">
                <p className="text-sm text-mid mb-3">
                  Measure the <strong className="text-charcoal">widest point</strong> of your room
                  (include doorways and bays) and add 10cm.
                </p>
                <div className="flex gap-2 items-end flex-wrap">
                  <Field label="Width (m)" value={customW} onChange={setCustomW} />
                  <Field label="Length (m)" value={customL} onChange={setCustomL} />
                </div>
                {customPrice > 0 && (
                  <div className="mt-3 bg-white border-2 border-brand rounded-md p-3 text-sm">
                    Estimate for {customW}m × {customL}m:
                    <span className="block text-2xl font-black text-brand mt-1">
                      ~£{customPrice}
                    </span>
                    <span className="text-xs text-mid block mt-1">
                      Indicative only — call us to confirm and reserve.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6">
            <EnquireButtons productName={product.name} sku={product.sku} />
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <ShareButtons url={url} title={product.name} />
          </div>
        </div>
      </div>

      <RecentlyViewed exclude={product.sku} />
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

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 flex-1 min-w-[110px]">
      <span className="text-[10px] font-black uppercase tracking-wider text-mid">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        min="0"
        step="0.1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 text-sm font-bold border-2 border-border rounded-md focus:border-brand outline-none bg-white"
      />
    </label>
  );
}
