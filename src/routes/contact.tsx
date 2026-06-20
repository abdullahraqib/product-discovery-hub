import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OpeningHours } from "@/components/OpeningHours";
import { LocationMap } from "@/components/LocationMap";
import { EnquireButtons } from "@/components/EnquireButtons";
import { SITE } from "@/lib/site";
import { Phone, Mail, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${SITE.shortName}` },
      {
        name: "description",
        content: `Visit ${SITE.name} at ${SITE.address.full}. Call ${SITE.phone} or email ${SITE.email}.`,
      },
      { property: "og:title", content: `Contact ${SITE.shortName}` },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="container-page py-6 md:py-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Contact" }]} />
      <h1 className="text-3xl md:text-4xl font-black mt-6">Get in touch</h1>
      <p className="text-mid mt-2 max-w-2xl">
        Call, email, or pop into the shop. We're happy to talk you through what's in stock and help
        you reserve a roll end.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] mt-8">
        <div className="space-y-4">
          <LocationMap />
          <div className="card-surface p-6 grid sm:grid-cols-3 gap-4">
            <a href={SITE.phoneTel} className="flex items-start gap-3">
              <Phone className="text-brand mt-0.5" size={20} />
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-mid">Call</div>
                <div className="font-black">{SITE.phone}</div>
              </div>
            </a>
            <a href={SITE.emailMailto} className="flex items-start gap-3">
              <Mail className="text-brand mt-0.5" size={20} />
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-mid">Email</div>
                <div className="font-black break-all">{SITE.email}</div>
              </div>
            </a>
            <div className="flex items-start gap-3">
              <MapPin className="text-brand mt-0.5" size={20} />
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-mid">Visit</div>
                <div className="font-black">{SITE.address.full}</div>
              </div>
            </div>
          </div>
          <div className="card-surface p-6">
            <h2 className="font-black text-lg mb-2">Make an enquiry</h2>
            <p className="text-sm text-mid mb-4">
              Choose what suits you — we usually respond the same day.
            </p>
            <EnquireButtons />
          </div>
        </div>
        <OpeningHours />
      </div>
    </div>
  );
}
