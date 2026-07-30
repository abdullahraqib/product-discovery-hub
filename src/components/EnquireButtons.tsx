import { Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { track } from "@/lib/analytics";

export function EnquireButtons({
  sku,
  size = "lg",
}: {
  productName?: string;
  sku?: string;
  size?: "lg" | "md";
}) {
  const padding = size === "lg" ? "py-3 px-5 text-base" : "py-2 px-4 text-sm";
  return (
    <div className="flex gap-2 flex-wrap">
      <a
        href={SITE.phoneTel}
        onClick={() => track("enquiry_click", { method: "phone", sku })}
        className={`btn-brand ${padding}`}
      >
        <Phone size={size === "lg" ? 18 : 16} /> Call {SITE.phone}
      </a>
    </div>
  );
}
