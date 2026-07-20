import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "delete_product",
  title: "Delete product",
  description: "Delete a product by SKU. Admin-only (enforced by database RLS).",
  inputSchema: { sku: z.string().min(1) },
  annotations: { readOnlyHint: false, destructiveHint: true },
  handler: async ({ sku }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { error } = await supabaseForUser(ctx).from("products").delete().eq("sku", sku);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: `Deleted ${sku}` }] };
  },
});
