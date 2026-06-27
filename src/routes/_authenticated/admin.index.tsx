import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { productsQuery } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminList,
});

function AdminList() {
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useQuery(productsQuery(true));

  async function remove(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  async function toggleActive(id: string, current: boolean) {
    const { error } = await supabase.from("products").update({ is_active: !current }).eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  if (isLoading) return <p className="text-mid">Loading…</p>;

  return (
    <div className="card-surface overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-secondary text-left">
          <tr>
            <th className="p-3 font-black">SKU</th>
            <th className="p-3 font-black">Name</th>
            <th className="p-3 font-black">Colour</th>
            <th className="p-3 font-black">From £</th>
            <th className="p-3 font-black">Active</th>
            <th className="p-3 font-black"></th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan={6} className="p-6 text-center text-mid">
                No products yet. <Link to="/admin/new" className="text-brand font-bold">Add one</Link>.
              </td>
            </tr>
          )}
          {products.map((p) => (
            <tr key={p.id} className="border-t border-border">
              <td className="p-3 font-bold">{p.sku}</td>
              <td className="p-3">
                <div className="font-bold">{p.name}</div>
                <div className="text-xs text-mid">{p.material} • {p.pile}</div>
              </td>
              <td className="p-3">
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full border border-border" style={{ background: p.colourHex }} />
                  {p.colour}
                </span>
              </td>
              <td className="p-3 font-black">£{p.fromPrice}</td>
              <td className="p-3">
                <button
                  onClick={() => p.id && toggleActive(p.id, true)}
                  className="text-xs font-black uppercase tracking-wider px-2 py-1 rounded bg-secondary"
                  title="Toggle visibility"
                >
                  Toggle
                </button>
              </td>
              <td className="p-3">
                <div className="flex gap-2 justify-end">
                  <Link
                    to="/admin/$id"
                    params={{ id: p.id! }}
                    className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider px-2 py-1 rounded border-2 border-border"
                  >
                    <Pencil size={12} /> Edit
                  </Link>
                  <button
                    onClick={() => p.id && remove(p.id, p.name)}
                    className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider px-2 py-1 rounded border-2 border-brand text-brand"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
