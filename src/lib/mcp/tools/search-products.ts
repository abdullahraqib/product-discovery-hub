import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "search_products",
  title: "Search products",
  description: "Search products by name, colour, material, or description.",
  inputSchema: {
    query: z.string().min(1).describe("Search text."),
    limit: z.number().int().positive().optional().describe("Max results, default 25."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ query, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const q = `%${query}%`;
    const { data, error } = await supabaseForUser(ctx)
      .from("products")
      .select("*")
      .eq("is_active", true)
      .or(`name.ilike.${q},colour.ilike.${q},material.ilike.${q},description.ilike.${q},sku.ilike.${q}`)
      .limit(limit ?? 25);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { products: data } };
  },
});
