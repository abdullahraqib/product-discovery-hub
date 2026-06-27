import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "@/lib/products";
import { ProductForm } from "@/components/ProductForm";

export const Route = createFileRoute("/_authenticated/admin/$id")({
  component: EditProductPage,
});

function EditProductPage() {
  const { id } = Route.useParams();
  const { data: product, isLoading } = useQuery({
    queryKey: ["product-by-id", id],
    queryFn: () => fetchProductById(id),
  });

  if (isLoading) return <p className="text-mid">Loading…</p>;
  if (!product) return <p className="text-mid">Product not found.</p>;

  return <ProductForm mode="edit" product={product} />;
}
