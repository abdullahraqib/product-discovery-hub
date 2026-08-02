import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { type Product, type Size } from "@/data/products";
import { Trash2, Plus, Upload, Crop } from "lucide-react";
import { isVideo } from "@/lib/media";
import ImageCropper from "@/components/ImageCropper";

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
  pricePerSqm: 0,
  images: [],
  imageAlts: [],
  description: "",
  features: [],
  sizes: [],
  isActive: true,
};

function calcPrice(w: number, l: number, rate: number) {
  return Math.round((Number(w) || 0) * (Number(l) || 0) * (Number(rate) || 0) * 100) / 100;
}

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
  const [cropSource, setCropSource] = useState<
    { file?: File; url?: string; replaceIndex?: number } | null
  >(null);
  const [featuresText, setFeaturesText] = useState((product ?? blank).features.join(", "));
  const [widthsText, setWidthsText] = useState((product ?? blank).widthsM.join(", "));
  const [manualPrices, setManualPrices] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Product>(key: K, value: Product[K]) {
    setP((prev) => ({ ...prev, [key]: value }));
  }

  function updateSize(i: number, patch: Partial<Size>) {
    const next = [...p.sizes];
    next[i] = { ...next[i], ...patch };
    if (patch.widthM !== undefined || patch.lengthM !== undefined) {
      next[i].label = `${next[i].lengthM}m × ${next[i].widthM}m`;
      if (!manualPrices.has(i)) {
        next[i].price = calcPrice(next[i].widthM, next[i].lengthM, p.pricePerSqm);
      }
    }
    set("sizes", next);
  }

  function setPricePerSqm(v: number) {
    setP((prev) => ({
      ...prev,
      pricePerSqm: v,
      sizes: prev.sizes.map((s, i) =>
        manualPrices.has(i) ? s : { ...s, price: calcPrice(s.widthM, s.lengthM, v) },
      ),
    }));
  }

  function setSizePrice(i: number, price: number) {
    setManualPrices((prev) => new Set(prev).add(i));
    const next = [...p.sizes];
    next[i] = { ...next[i], price };
    set("sizes", next);
  }

  function resetSizePrice(i: number) {
    setManualPrices((prev) => {
      const n = new Set(prev);
      n.delete(i);
      return n;
    });
    const next = [...p.sizes];
    next[i] = { ...next[i], price: calcPrice(next[i].widthM, next[i].lengthM, p.pricePerSqm) };
    set("sizes", next);
  }

  function addSize() {
    set("sizes", [
      ...p.sizes,
      { label: "4m × 4m", widthM: 4, lengthM: 4, price: calcPrice(4, 4, p.pricePerSqm) },
    ]);
  }

  function removeSize(i: number) {
    set("sizes", p.sizes.filter((_, idx) => idx !== i));
    setManualPrices(new Set());
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
      if (data?.signedUrl) {
        setP((prev) => ({
          ...prev,
          images: [...prev.images, data.signedUrl],
          imageAlts: [...prev.imageAlts, ""],
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  function addImageUrl() {
    const u = imageUrl.trim();
    if (!u) return;
    setP((prev) => ({ ...prev, images: [...prev.images, u], imageAlts: [...prev.imageAlts, ""] }));
    setImageUrl("");
  }

  function removeImage(i: number) {
    setP((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== i),
      imageAlts: prev.imageAlts.filter((_, idx) => idx !== i),
    }));
  }

  function setImageAlt(i: number, value: string) {
    setP((prev) => {
      const next = [...prev.imageAlts];
      while (next.length < prev.images.length) next.push("");
      next[i] = value;
      return { ...prev, imageAlts: next };
    });
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
        widths_m: p.widthsM,
        material: p.material,
        price_per_sqm: Number(p.pricePerSqm) || 0,
        from_price: p.sizes.length
          ? Math.min(...p.sizes.map((s) => Number(s.price) || 0))
          : Number(p.pricePerSqm) || 0,
        images: p.images,
        image_alts: p.images.map((_, i) => p.imageAlts[i] ?? ""),
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
        </Grid>
        <Textarea label="Description" value={p.description} onChange={(v) => set("description", v)} rows={4} />
      </Section>

      <Section title="Colour & spec">
        <Grid>
          <Input label="Colour name" value={p.colour} onChange={(v) => set("colour", v)} />
          <Input label="Material" value={p.material} onChange={(v) => set("material", v)} />
          <Input
            label="Widths (m, comma-separated)"
            value={widthsText}
            onChange={(v) => {
              setWidthsText(v);
              set(
                "widthsM",
                v
                  .split(",")
                  .map((s) => Number(s.trim()))
                  .filter((n) => !isNaN(n) && n > 0),
              );
            }}
          />
          <Input
            label="Price per m² (£)"
            type="number"
            value={String(p.pricePerSqm)}
            onChange={(v) => setPricePerSqm(Number(v) || 0)}
          />
          <Input
            label="Features (comma-separated)"
            value={featuresText}
            onChange={(v) => {
              setFeaturesText(v);
              set("features", v.split(",").map((s) => s.trim()).filter(Boolean));
            }}
          />
        </Grid>
      </Section>

      <Section title="Photos & videos">
        <div className="space-y-3">
          {p.images.map((src, i) => (
            <div key={src + i} className="flex items-start gap-3 bg-secondary rounded-md p-2">
              {isVideo(src) ? (
                <video src={src} muted playsInline preload="metadata" className="w-20 h-16 object-cover rounded bg-black" />
              ) : (
                <img src={src} alt="" className="w-20 h-16 object-cover rounded" />
              )}
              <div className="flex-1 space-y-2 min-w-0">
                <div className="text-xs break-all">
                  <span className="font-black uppercase tracking-wider text-mid mr-2">
                    {isVideo(src) ? "Video" : "Image"}
                  </span>
                  {src}
                </div>
                <input
                  type="text"
                  value={p.imageAlts[i] ?? ""}
                  onChange={(e) => setImageAlt(i, e.target.value)}
                  maxLength={200}
                  placeholder={`Alt text (describe this ${isVideo(src) ? "video" : "image"}) — defaults to product name`}
                  className="w-full px-3 py-2 text-sm font-bold border-2 border-border rounded-md focus:border-brand outline-none bg-white"
                  aria-label={`Alt text for ${isVideo(src) ? "video" : "image"} ${i + 1}`}
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="text-brand mt-1"
                aria-label="Remove media"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="card-surface p-4 cursor-pointer flex items-center gap-3 text-sm font-bold">
            <Upload size={18} className="text-brand" />
            <span>{busy ? "Uploading…" : "Upload photo or video"}</span>
            <input
              type="file"
              accept="image/*,video/*"
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
              placeholder="Paste image or video URL"
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
        <p className="text-xs font-bold text-mid">
          Sizes are shown as length × width. Prices are calculated from length × width × price per m². Edit any price to override it.
        </p>
        <div className="space-y-3">
          {p.sizes.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-2 items-end">
              <Input
                label="Length (m)"
                type="number"
                value={String(s.lengthM)}
                onChange={(v) => updateSize(i, { lengthM: Number(v) || 0 })}
              />
              <Input
                label="Width (m)"
                type="number"
                value={String(s.widthM)}
                onChange={(v) => updateSize(i, { widthM: Number(v) || 0 })}
              />

              <Input
                label={manualPrices.has(i) ? "Price (£) · manual" : "Price (£) · auto"}
                type="number"
                value={String(s.price)}
                onChange={(v) => setSizePrice(i, Number(v) || 0)}
              />
              {manualPrices.has(i) && (
                <button
                  type="button"
                  onClick={() => resetSizePrice(i)}
                  className="h-10 px-3 rounded-md border-2 border-border text-xs font-black uppercase"
                >
                  Auto
                </button>
              )}
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
