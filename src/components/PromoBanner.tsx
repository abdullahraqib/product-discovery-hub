import { Phone } from "lucide-react";
import { SITE } from "@/lib/site";

const MESSAGES = [
  "CALL NOW AND RESERVE",
  "STOCK ALWAYS CHANGING - CALL TO SECURE",
  "HUGE SALE ACTIVE",
];

function MarqueeStrip() {
  return (
    <div className="flex items-center" aria-hidden="true">
      {MESSAGES.map((m, i) => (
        <span key={i} className="flex items-center shrink-0">
          <span className="font-impact uppercase tracking-wide text-sm md:text-base text-pop-foreground whitespace-nowrap px-6 py-2">
            {m}
          </span>
          <span className="text-pop-foreground/70 text-lg">★</span>
        </span>
      ))}
    </div>
  );
}

export function PromoBanner() {
  return (
    <div className="bg-pop border-b-2 border-charcoal overflow-hidden">
      <div className="promo-marquee">
        <a href={SITE.phoneTel} className="contents" aria-label={`Call ${SITE.phone} to reserve`}>
          <MarqueeStrip />
          <MarqueeStrip />
        </a>
      </div>
    </div>
  );
}

export function PromoBannerStatic() {
  // Accessible fallback / screen-reader text
  return (
    <span className="sr-only">
      <Phone size={0} className="hidden" /> Call {SITE.phone} now to reserve — stock always changing,
      call to secure, huge sale active.
    </span>
  );
}
