import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { PRODUCTS, CATEGORIES } from "@/data/products";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
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
          ...PRODUCTS.map((p) => ({
            path: `/roll-ends/${p.sku}`,
            changefreq: "weekly",
            priority: "0.8",
          })),
        ];

        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
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
