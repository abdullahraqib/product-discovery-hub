import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { CATEGORIES } from "@/data/products";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const supabase = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_PUBLISHABLE_KEY!,
          { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
        );
        const { data } = await supabase.from("products").select("sku").eq("is_active", true);
        const skus = (data ?? []).map((r) => r.sku);

        const entries: { path: string; changefreq?: string; priority?: string }[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/contact", changefreq: "monthly", priority: "0.6" },
          { path: "/measuring-guide", changefreq: "monthly", priority: "0.5" },
          { path: "/returns-policy", changefreq: "yearly", priority: "0.3" },
          ...CATEGORIES.map((c) => ({
            path: `/carpets/${c.slug}`,
            changefreq: "weekly",
            priority: "0.7",
          })),
          ...skus.map((sku) => ({
            path: `/roll-ends/${sku}`,
            changefreq: "weekly",
            priority: "0.8",
          })),
        ];

        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
