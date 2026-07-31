import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, Menu, X } from "lucide-react";
import { SITE } from "@/lib/site";
import { track } from "@/lib/analytics";
import logoAsset from "@/assets/rollendshop-logo-v2.png.asset.json";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";

  const nav = [
    { to: "/how-to-buy", label: "How to Buy\n" },
    { to: "/delivery", label: "Delivery" },
    { to: "/measuring-guide", label: "Measuring Guide" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b-[3px] border-brand shadow-sm">
      <div className="container-page flex items-center justify-between gap-4 h-[72px]">
        <Link to="/" className="flex items-center shrink-0 min-w-0" aria-label={`${SITE.name} home`}>
          <img
            src={logoAsset.url}
            alt={`${SITE.name} logo`}
            className="h-5 sm:h-6 md:h-7 w-auto block max-w-[210px] sm:max-w-[280px] object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          <a
            href="/#listing-heading"
            className={
              isHome
                ? "px-3 py-2 text-sm font-bold text-brand transition-colors"
                : "px-3 py-2 text-sm font-bold text-charcoal hover:text-brand transition-colors"
            }
          >
            Roll Ends
          </a>
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 text-sm font-bold text-charcoal hover:text-brand transition-colors"
              activeProps={{ className: "px-3 py-2 text-sm font-bold text-brand" }}
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
            className="md:hidden p-2.5 rounded-md text-charcoal"
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
            <a
              href="/#listing-heading"
              onClick={() => setOpen(false)}
              className="py-3 text-base font-bold text-charcoal"
            >
              Roll Ends
            </a>
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-bold text-charcoal"
                activeProps={{ className: "py-3 text-base font-bold text-brand" }}
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
