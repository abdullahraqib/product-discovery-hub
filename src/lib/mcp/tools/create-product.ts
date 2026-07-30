import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

const size = z.object({
  label: z.string(),
  widthM: z.number(),
  lengthM: z.number(),
  price: z.number(),
});

export default defineTool({
  name: "create_product",
  title: "Create product",
  description: "Create a new product. Admin-only (enforced by database RLS).",
  inputSchema: {
    sku: z.string().min(1),
    slug: z.string().min(1),
    name: z.string().min(1),
    colour: z.string(),
    colour_hex: z.string(),
    widths_m: z.array(z.number()),
    material: z.string(),
    pile: z.string(),
    category: z.string(),
    popularity: z.number().optional(),
    from_price: z.number(),
    images: z.array(z.string()).optional(),
    image_alts: z.array(z.string()).optional().describe("Alt text per image, same order as images."),
    description: z.string(),
    features: z.array(z.string()).optional(),
    sizes: z.array(size).optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { data, error } = await supabaseForUser(ctx).from("products").insert(input).select().maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: `Created ${data?.sku}` }], structuredContent: { product: data } };
  },
});
