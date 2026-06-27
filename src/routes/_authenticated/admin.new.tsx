import { createFileRoute } from "@tanstack/react-router";
import { ProductForm } from "@/components/ProductForm";

export const Route = createFileRoute("/_authenticated/admin/new")({
  component: () => <ProductForm mode="create" />,
});
