import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { rowToProduct, type Product, type ProductRow } from "@/data/products";

export async function fetchProducts(includeInactive = false): Promise<Product[]> {
  let q = supabase.from("products").select("*").order("date_added", { ascending: false });
  if (!includeInactive) q = q.eq("is_active", true);
  const { data, error } = await q;
  if (error) throw error;
  return ((data ?? []) as unknown as ProductRow[]).map(rowToProduct);
}

export async function fetchProductBySku(sku: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("sku", sku)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToProduct(data as unknown as ProductRow) : null;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToProduct(data as unknown as ProductRow) : null;
}

export const productsQuery = (includeInactive = false) =>
  queryOptions({
    queryKey: ["products", { includeInactive }],
    queryFn: () => fetchProducts(includeInactive),
    staleTime: 30_000,
  });

export const productQuery = (sku: string) =>
  queryOptions({
    queryKey: ["product", sku],
    queryFn: () => fetchProductBySku(sku),
    staleTime: 30_000,
  });
