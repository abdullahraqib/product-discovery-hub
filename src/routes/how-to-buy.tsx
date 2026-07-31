import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EnquireButtons } from "@/components/EnquireButtons";
import { SITE } from "@/lib/site";
import { ShoppingBag, ClipboardList, Phone } from "lucide-react";

export const Route = createFileRoute("/how-to-buy")({
  head: () => ({
    meta: [
      { title: `How to Buy — ${SITE.shortName}` },
      {
        name: "description",
        content:
          "Three simple steps to buy a carpet roll end from RollEndShop: choose your roll end, note the reference number, then call to reserve and collect.",
      },
      { property: "og:title", content: `How to Buy — ${SITE.shortName}` },
      { property: "og:description", content: "Three simple steps to grab a bargain carpet roll end." },
      { property: "og:url", content: "/how-to-buy" },
    ],
    links: [{ rel: "canonical", href: "/how-to-buy" }],
  }),
  component: HowToBuyPage,
});

const STEPS = [
  {
    icon: ShoppingBag,
    title: "Choose your roll end",
    body: "Browse our stock until you find your match. Each roll end is a one-off piece — once it's gone, it's gone. Use the search and filters to find a carpet that fits your room.",
  },
  {
    icon: ClipboardList,
    title: "Note the reference number",
    body: "Every roll end has a unique reference number (for example, SRC-00148). You'll see it on the listing and in the size dropdown — note it down so we know exactly which piece you want.",
  },
  {
    icon: Phone,
    title: "Call us to reserve",
    body: (
      <>
        Give us a call on {SITE.phone} to check that your roll is still in available - roll end availability is always changing and it would be impossible to keep our website stock completely accurate 100% of the time!
        <br />
        &nbsp;A roll end is only reserved once it's been paid for — we can take payment over the phone or in store. We can then arrange pickup or delivery for you.
      </>
    ),
  },
];

function HowToBuyPage() {
  return (
    <div className="container-page py-6 md:py-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "How to Buy" }]} />

      <h1 className="text-3xl md:text-4xl font-black mt-6 mb-8">How to Buy</h1>

      <div className="grid gap-5 md:gap-6">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card-surface p-6 md:p-8 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex items-center gap-3 sm:flex-col sm:items-start">
                <div className="h-14 w-14 rounded-full bg-brand text-white grid place-items-center shrink-0">
                  <Icon size={26} />
                </div>
                <span className="font-impact text-5xl text-brand/20 sm:hidden">{i + 1}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-impact text-3xl text-brand/30 hidden sm:inline">{i + 1}</span>
                  <h2 className="text-xl md:text-2xl font-black">{s.title}</h2>
                </div>
                <div className="text-charcoal mt-2 leading-relaxed">{s.body}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card-surface p-8 md:p-10 text-center bg-charcoal text-white border-y-8 border-pop mt-8">
        <h2 className="text-2xl md:text-3xl font-black">Ready to grab a bargain?</h2>
        <p className="text-neutral-300 mt-2 mb-6">
 Roll ends sell fast — give us a call and we'll hold it for you.
        </p>
        <div className="flex justify-center">
          <EnquireButtons />
        </div>
      </div>
    </div>
  );
}
