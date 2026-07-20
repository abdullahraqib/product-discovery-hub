import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_product",
  title: "Update product",
  description: "Update fields on a product by SKU. Admin-only (enforced by database RLS).",
  inputSchema: {
    sku: z.string().min(1).describe("SKU of the product to update."),
    patch: z.record(z.string(), z.unknown()).describe("Object of columns to update (snake_case)."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  handler: async ({ sku, patch }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { data, error } = await supabaseForUser(ctx)
      .from("products")
      .update(patch as never)
      .eq("sku", sku)
      .select()
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: `Updated ${sku}` }], structuredContent: { product: data } };
  },
});
