import { Phone, Mail } from "lucide-react";
import { SITE, emailEnquiryLink } from "@/lib/site";
import { track } from "@/lib/analytics";

export function EnquireButtons({
  productName,
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
      <a
        href={emailEnquiryLink(productName, sku)}
        onClick={() => track("enquiry_click", { method: "email", sku })}
        className={`btn-outline-charcoal ${padding}`}
      >
        <Mail size={size === "lg" ? 18 : 16} /> Email enquiry
      </a>
    </div>
  );
}
