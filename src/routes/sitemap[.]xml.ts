import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { CATEGORIES } from "@/data/products";
import { LANDING_HUBS } from "@/data/landing";
import { SITE } from "@/lib/site";

type Entry = { path: string; changefreq: string; priority: string };

async function fetchSkus(): Promise<string[]> {
  const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return [];
  try {
    const supabase = createClient(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("products")
      .select("sku")
      .eq("is_active", true)
      .order("date_added", { ascending: false });
    if (error) return [];
    return (data ?? []).map((r: { sku: string }) => r.sku).filter(Boolean);
  } catch {
    return [];
  }
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const base = SITE.url.replace(/\/$/, "");
        const skus = await fetchSkus();

        const entries: Entry[] = [
          { path: "/", changefreq: "daily", priority: "1.0" },
          ...Object.values(LANDING_HUBS).map((h) => ({
            path: h.slug.startsWith("/") ? h.slug : `/${h.slug}`,
            changefreq: "daily",
            priority: "0.9",
          })),
          { path: "/how-to-buy", changefreq: "monthly", priority: "0.7" },
          { path: "/delivery", changefreq: "monthly", priority: "0.6" },
          { path: "/contact", changefreq: "monthly", priority: "0.6" },
          { path: "/measuring-guide", changefreq: "monthly", priority: "0.5" },
          ...CATEGORIES.map((c) => ({
            path: `/carpets/${c.slug}`,
            changefreq: "weekly",
            priority: "0.7",
          })),
          ...skus.map((sku) => ({
            path: `/roll-ends/${encodeURIComponent(sku)}`,
            changefreq: "weekly",
            priority: "0.8",
          })),
        ];

        const seen = new Set<string>();
        const urls = entries
          .filter((e) => (seen.has(e.path) ? false : (seen.add(e.path), true)))
          .map(
            (e) =>
              `  <url>\n    <loc>${base}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
