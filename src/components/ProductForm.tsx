import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORY_VALUES, type Product, type Size } from "@/data/products";
import { Trash2, Plus, Upload } from "lucide-react";

type Mode = "create" | "edit";

const blank: Product = {
  sku: "",
  slug: "",
  name: "",
  colour: "",
  colourHex: "#cccccc",
  widthsM: [4],
  material: "",
  pile: "",
  category: "saxony",
  popularity: 50,
  dateAdded: new Date().toISOString(),
  fromPrice: 0,
  images: [],
  description: "",
  features: [],
  sizes: [],
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export function ProductForm({ mode, product }: { mode: Mode; product?: Product }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [p, setP] = useState<Product>(product ?? blank);
  const [imageUrl, setImageUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Product>(key: K, value: Product[K]) {
    setP((prev) => ({ ...prev, [key]: value }));
  }

  function updateSize(i: number, patch: Partial<Size>) {
    const next = [...p.sizes];
    next[i] = { ...next[i], ...patch };
    if (patch.widthM !== undefined || patch.lengthM !== undefined) {
      next[i].label = `${next[i].widthM}m × ${next[i].lengthM}m`;
    }
    set("sizes", next);
  }

  function addSize() {
    set("sizes", [...p.sizes, { label: "4m × 4m", widthM: 4, lengthM: 4, price: 0 }]);
  }

  function removeSize(i: number) {
    set("sizes", p.sizes.filter((_, idx) => idx !== i));
  }

  async function uploadFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("product-images").upload(path, file);
      if (upErr) throw upErr;
      const { data, error: signErr } = await supabase.storage
        .from("product-images")
        .createSignedUrl(path, TEN_YEARS);
      if (signErr) throw signErr;
      if (data?.signedUrl) set("images", [...p.images, data.signedUrl]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  function addImageUrl() {
    const u = imageUrl.trim();
    if (!u) return;
    set("images", [...p.images, u]);
    setImageUrl("");
  }

  function removeImage(i: number) {
    set("images", p.images.filter((_, idx) => idx !== i));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const slug = p.slug || slugify(p.name);
      const row = {
        sku: p.sku.trim(),
        slug,
        name: p.name.trim(),
        colour: p.colour.trim(),
        colour_hex: p.colourHex,
        widths_m: p.widthsM,
        material: p.material,
        pile: p.pile,
        category: p.category,
        popularity: Number(p.popularity) || 0,
        from_price: Number(p.fromPrice) || 0,
        images: p.images,
        description: p.description,
        features: p.features,
        sizes: p.sizes,
      };
      if (mode === "create") {
        const { error } = await supabase.from("products").insert(row);
        if (error) throw error;
      } else if (product?.id) {
        const { error } = await supabase.from("products").update(row).eq("id", product.id);
        if (error) throw error;
      }
      qc.invalidateQueries({ queryKey: ["products"] });
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6 max-w-3xl">
      {error && (
        <div className="text-sm font-bold text-brand bg-brand/10 border border-brand/30 rounded-md p-3">
          {error}
        </div>
      )}

      <Section title="Basics">
        <Grid>
          <Input label="SKU (unique ref)" value={p.sku} onChange={(v) => set("sku", v)} required />
          <Input label="Name" value={p.name} onChange={(v) => set("name", v)} required />
          <Input
            label="Slug (URL-friendly)"
            value={p.slug}
            onChange={(v) => set("slug", v)}
            placeholder="auto from name"
          />
          <Select
            label="Category"
            value={p.category}
            onChange={(v) => set("category", v)}
            options={CATEGORY_VALUES.map((c) => ({ value: c, label: c }))}
          />
        </Grid>
        <Textarea label="Description" value={p.description} onChange={(v) => set("description", v)} rows={4} />
      </Section>

      <Section title="Colour & spec">
        <Grid>
          <Input label="Colour name" value={p.colour} onChange={(v) => set("colour", v)} />
          <label className="block">
            <span className="text-xs font-black uppercase tracking-wider text-mid block mb-1">Colour swatch</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={p.colourHex}
                onChange={(e) => set("colourHex", e.target.value)}
                className="h-10 w-14 rounded border-2 border-border"
              />
              <input
                type="text"
                value={p.colourHex}
                onChange={(e) => set("colourHex", e.target.value)}
                className="flex-1 px-3 py-2 text-sm font-bold border-2 border-border rounded-md bg-white"
              />
            </div>
          </label>
          <Input label="Material" value={p.material} onChange={(v) => set("material", v)} />
          <Input label="Pile" value={p.pile} onChange={(v) => set("pile", v)} />
          <Input
            label="Widths (m, comma-separated)"
            value={p.widthsM.join(", ")}
            onChange={(v) =>
              set(
                "widthsM",
                v
                  .split(",")
                  .map((s) => Number(s.trim()))
                  .filter((n) => !isNaN(n) && n > 0),
              )
            }
          />
          <Input
            label="From price (£)"
            type="number"
            value={String(p.fromPrice)}
            onChange={(v) => set("fromPrice", Number(v) || 0)}
          />
          <Input
            label="Popularity (0–100)"
            type="number"
            value={String(p.popularity)}
            onChange={(v) => set("popularity", Math.max(0, Math.min(100, Number(v) || 0)))}
          />
          <Input
            label="Features (comma-separated)"
            value={p.features.join(", ")}
            onChange={(v) =>
              set("features", v.split(",").map((s) => s.trim()).filter(Boolean))
            }
          />
        </Grid>
      </Section>

      <Section title="Images">
        <div className="space-y-3">
          {p.images.map((src, i) => (
            <div key={src + i} className="flex items-center gap-3 bg-secondary rounded-md p-2">
              <img src={src} alt="" className="w-20 h-16 object-cover rounded" />
              <div className="flex-1 text-xs break-all">{src}</div>
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="text-brand"
                aria-label="Remove image"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="card-surface p-4 cursor-pointer flex items-center gap-3 text-sm font-bold">
            <Upload size={18} className="text-brand" />
            <span>{busy ? "Uploading…" : "Upload from device"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadFile(file);
                e.target.value = "";
              }}
            />
          </label>
          <div className="card-surface p-4 flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL"
              className="flex-1 px-3 py-2 text-sm font-bold border-2 border-border rounded-md bg-white"
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="btn-outline-charcoal text-sm whitespace-nowrap"
            >
              Add
            </button>
          </div>
        </div>
      </Section>

      <Section title="Available sizes & pricing">
        <div className="space-y-3">
          {p.sizes.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
              <Input
                label="Width (m)"
                type="number"
                value={String(s.widthM)}
                onChange={(v) => updateSize(i, { widthM: Number(v) || 0 })}
              />
              <Input
                label="Length (m)"
                type="number"
                value={String(s.lengthM)}
                onChange={(v) => updateSize(i, { lengthM: Number(v) || 0 })}
              />
              <Input
                label="Price (£)"
                type="number"
                value={String(s.price)}
                onChange={(v) => updateSize(i, { price: Number(v) || 0 })}
              />
              <button
                type="button"
                onClick={() => removeSize(i)}
                className="h-10 px-3 rounded-md border-2 border-brand text-brand"
                aria-label="Remove size"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSize}
          className="mt-3 inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-brand"
        >
          <Plus size={14} /> Add size
        </button>
      </Section>

      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={busy} className="btn-brand">
          {busy ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/admin" })}
          className="btn-outline-charcoal"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="card-surface p-5">
      <legend className="px-2 text-xs font-black uppercase tracking-wider text-mid">{title}</legend>
      <div className="mt-2 space-y-4">{children}</div>
    </fieldset>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wider text-mid block mb-1">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm font-bold border-2 border-border rounded-md focus:border-brand outline-none bg-white"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wider text-mid block mb-1">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm font-bold border-2 border-border rounded-md focus:border-brand outline-none bg-white"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wider text-mid block mb-1">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm font-bold border-2 border-border rounded-md focus:border-brand outline-none bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
