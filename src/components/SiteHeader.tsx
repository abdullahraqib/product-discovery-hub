import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, Menu, X } from "lucide-react";
import { SITE } from "@/lib/site";
import { track } from "@/lib/analytics";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const nav = [
    { to: "/", label: "Roll Ends" },
    { to: "/measuring-guide", label: "Measuring Guide" },
    { to: "/returns-policy", label: "Returns" },
    { to: "/contact", label: "Contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 bg-white border-b-[3px] border-brand shadow-sm">
      <div className="container-page flex items-center justify-between gap-4 h-[72px]">
        <Link to="/" className="flex items-center gap-3 shrink-0" aria-label={`${SITE.name} home`}>
          <div className="h-12 w-12 rounded-full bg-brand text-white grid place-items-center font-black text-lg">
            SR
          </div>
          <div className="leading-tight hidden sm:block">
            <strong className="block text-charcoal text-[15px] font-black tracking-wide">
              {SITE.name}
            </strong>
            <span className="text-[10px] uppercase tracking-[0.15em] text-mid font-bold">
              Bradford • Roll Ends
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 text-sm font-bold text-charcoal hover:text-brand transition-colors"
              activeProps={{ className: "px-3 py-2 text-sm font-bold text-brand" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            className="btn-brand text-sm hidden sm:inline-flex"
            href={SITE.phoneTel}
            onClick={() => track("call_click", { location: "header" })}
          >
            <Phone size={16} aria-hidden /> <span>Call Us</span>
          </a>
          <button
            className="md:hidden p-2 rounded-md text-charcoal"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-white">
          <nav className="container-page py-3 flex flex-col gap-1" aria-label="Mobile">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 text-base font-bold text-charcoal"
                activeProps={{ className: "py-2 text-base font-bold text-brand" }}
              >
                {n.label}
              </Link>
            ))}
            <a href={SITE.phoneTel} className="btn-brand mt-2">
              <Phone size={16} /> Call {SITE.phone}
            </a>
            <a href={SITE.emailMailto} className="btn-outline-charcoal mt-2">
              <Mail size={16} /> Email Us
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
