import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { CATEGORIES, PRODUCTS, categoryToFilter } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TrustBadges } from "@/components/TrustBadges";
import { EnquireButtons } from "@/components/EnquireButtons";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/carpets/$category")({
  loader: ({ params }) => {
    const cat = CATEGORIES.find((c) => c.slug === params.category);
    if (!cat) throw notFound();
    const cats = categoryToFilter(cat.slug);
    const items = PRODUCTS.filter((p) => cats.includes(p.category));
    return { cat, items };
  },
  head: ({ loaderData }) => {
    const cat = loaderData?.cat;
    if (!cat) return {};
    const url = `/carpets/${cat.slug}`;
    return {
      meta: [
        { title: `${cat.name} — ${SITE.shortName}` },
        { name: "description", content: cat.description },
        { property: "og:title", content: `${cat.name} — ${SITE.shortName}` },
        { property: "og:description", content: cat.description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="text-2xl font-black">Category not found</h1>
      <Link to="/" className="btn-brand mt-6 inline-flex">Back to roll ends</Link>
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { cat, items } = Route.useLoaderData();
  return (
    <div className="container-page py-6 md:py-10">
      <Breadcrumbs items={[{ label: "Roll Ends", to: "/" }, { label: cat.name }]} />
      <header className="mt-6 mb-8 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-black">{cat.name}</h1>
        <p className="text-mid mt-3 leading-relaxed">{cat.description}</p>
      </header>

      {items.length === 0 ? (
        <div className="card-surface p-10 text-center">
          <p className="font-black mb-2">No stock in this category right now</p>
          <p className="text-sm text-mid mb-4">
            New roll ends come in weekly — call us and we'll let you know.
          </p>
          <EnquireButtons size="md" />
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.sku} product={p} />
          ))}
        </div>
      )}

      <TrustBadges />
    </div>
  );
}
