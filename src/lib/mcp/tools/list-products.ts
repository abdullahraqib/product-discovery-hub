import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_products",
  title: "List products",
  description: "List carpet roll-end products. Returns active products by default.",
  inputSchema: {
    include_inactive: z.boolean().optional().describe("Include inactive products (admins only)."),
    category: z.string().optional().describe("Filter by category slug (e.g. saxony, berber, twist)."),
    limit: z.number().int().positive().optional().describe("Max results, default 50."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ include_inactive, category, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const sb = supabaseForUser(ctx);
    let q = sb.from("products").select("*").order("date_added", { ascending: false }).limit(limit ?? 50);
    if (!include_inactive) q = q.eq("is_active", true);
    if (category) q = q.eq("category", category);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { products: data },
    };
  },
});
