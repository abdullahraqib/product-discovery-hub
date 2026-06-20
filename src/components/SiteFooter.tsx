import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Phone, Mail, MapPin } from "lucide-react";
import { SITE } from "@/lib/site";

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.83a8.16 8.16 0 0 0 4.77 1.52V6.9a4.85 4.85 0 0 1-1.84-.21Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-neutral-300 border-t-4 border-brand mt-16">
      <div className="container-page py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-brand text-white grid place-items-center font-black">
              SR
            </div>
            <span className="text-white font-black">{SITE.name}</span>
          </div>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Family-run carpet specialists with over half a century of experience. Quality roll ends
            at unbeatable prices.
          </p>
          <div className="flex gap-3 mt-4">
            <a
              href={SITE.socials.instagram}
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-brand grid place-items-center text-white transition-colors"
            >
              <Instagram size={18} />
            </a>
            <a
              href={SITE.socials.facebook}
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-brand grid place-items-center text-white transition-colors"
            >
              <Facebook size={18} />
            </a>
            <a
              href={SITE.socials.tiktok}
              aria-label="TikTok"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-brand grid place-items-center text-white transition-colors"
            >
              <TikTokIcon />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-black mb-3 text-sm uppercase tracking-wider">Visit</h3>
          <p className="text-sm flex items-start gap-2">
            <MapPin size={16} className="mt-0.5 text-brand shrink-0" />
            <span>
              {SITE.address.street}
              <br />
              {SITE.address.locality}, {SITE.address.postcode}
            </span>
          </p>
          <a
            href={SITE.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand hover:underline mt-2 inline-block"
          >
            Get directions →
          </a>
        </div>

        <div>
          <h3 className="text-white font-black mb-3 text-sm uppercase tracking-wider">Contact</h3>
          <a href={SITE.phoneTel} className="text-sm flex items-center gap-2 hover:text-white">
            <Phone size={16} className="text-brand" /> {SITE.phone}
          </a>
          <a
            href={SITE.emailMailto}
            className="text-sm flex items-center gap-2 hover:text-white mt-2 break-all"
          >
            <Mail size={16} className="text-brand shrink-0" /> {SITE.email}
          </a>
        </div>

        <div>
          <h3 className="text-white font-black mb-3 text-sm uppercase tracking-wider">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white">
                Roll Ends
              </Link>
            </li>
            <li>
              <Link to="/measuring-guide" className="hover:text-white">
                Measuring Guide
              </Link>
            </li>
            <li>
              <Link to="/returns-policy" className="hover:text-white">
                Returns & Reservations
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-5 text-xs text-neutral-500 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <span>Bradford • West Yorkshire</span>
        </div>
      </div>
    </footer>
  );
}
