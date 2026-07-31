import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProducts from "./tools/list-products";
import getProduct from "./tools/get-product";
import searchProducts from "./tools/search-products";
import createProduct from "./tools/create-product";
import updateProduct from "./tools/update-product";
import deleteProduct from "./tools/delete-product";

// Direct Supabase host — the .lovable.cloud proxy fails RFC 8414 issuer match.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "rollendshop-mcp",
  title: "Rollendshop",
  version: "0.1.0",
  instructions:
    "Tools for the Rollendshop roll-ends catalogue. Read tools return active product data; write tools (create/update/delete) are restricted to admin users by database policies.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProducts, getProduct, searchProducts, createProduct, updateProduct, deleteProduct],
});
