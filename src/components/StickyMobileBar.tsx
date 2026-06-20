import { Phone, Mail } from "lucide-react";
import { SITE } from "@/lib/site";
import { track } from "@/lib/analytics";

export function StickyMobileBar() {
  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t-2 border-brand shadow-[0_-4px_16px_rgba(0,0,0,0.08)] grid grid-cols-2 no-print"
      role="region"
      aria-label="Quick contact"
    >
      <a
        href={SITE.phoneTel}
        onClick={() => track("call_click", { location: "sticky_mobile" })}
        className="flex items-center justify-center gap-2 py-3 font-black text-brand"
      >
        <Phone size={18} /> Call
      </a>
      <a
        href={SITE.emailMailto}
        onClick={() => track("email_click", { location: "sticky_mobile" })}
        className="flex items-center justify-center gap-2 py-3 font-black text-white bg-brand"
      >
        <Mail size={18} /> Email
      </a>
    </div>
  );
}
