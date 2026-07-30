import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EnquireButtons } from "@/components/EnquireButtons";
import { SITE } from "@/lib/site";
import { Store, Truck, CreditCard, Phone } from "lucide-react";

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { title: `Delivery & Collection — ${SITE.shortName}` },
      {
        name: "description",
        content:
          "Collection from our Bradford store or delivery arranged over the phone. Roll ends must be paid for to reserve — call SR Carpets & Floors to arrange.",
      },
      { property: "og:title", content: `Delivery & Collection — ${SITE.shortName}` },
      { property: "og:description", content: "Collection from Bradford or delivery arranged by phone." },
      { property: "og:url", content: "/delivery" },
    ],
    links: [{ rel: "canonical", href: "/delivery" }],
  }),
  component: DeliveryPage,
});

function DeliveryPage() {
  const options = [
    {
      icon: Store,
      title: "Collection from store",
      body: "Pick up your roll end from our shop at " +
        SITE.address.full +
        ". We're open seven days a week — see our opening hours for details. Collection is free.",
    },
    {
      icon: Truck,
      title: "Delivery",
      body: "We can arrange delivery for your roll end across West Yorkshire. Give us a call with your reference number and postcode, and we can confirm availability.\u00a0\nUnlike other companies who include 3x the delivery fee in the price of the product, we aim to be completely transparent with our customers and charge a separate delivery fee.\n\u00a0*Delivery address must match address on the card used to pay",
    },
    {
      icon: CreditCard,
      title: "Payment to reserve",
      body: "A roll end is only reserved once it has been paid for. We can take payment over the phone or in store — until then, pieces stay available to everyone on a first-come, first-served basis.",
    },
  ];

  return (
    <div className="container-page py-6 md:py-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Delivery" }]} />

      <header className="mt-6 mb-8">
        <h1 className="text-3xl md:text-4xl font-black">Delivery & Collection</h1>
        <p className="text-mid mt-2 max-w-2xl leading-relaxed">
          Every roll end is a one-off piece. Once you've paid, it's yours — collect it from our
          Bradford shop or let us arrange delivery.
        </p>
      </header>

      <div className="grid gap-5 md:gap-6 md:grid-cols-3">
        {options.map((o, i) => {
          const Icon = o.icon;
          return (
            <div key={i} className="card-surface p-6 md:p-8">
              <div className="h-14 w-14 rounded-full bg-brand text-white grid place-items-center mb-4">
                <Icon size={26} />
              </div>
              <h2 className="text-lg md:text-xl font-black">{o.title}</h2>
              <p className="text-charcoal mt-2 leading-relaxed text-sm">{o.body}</p>
            </div>
          );
        })}
      </div>

      <div className="card-surface p-6 md:p-8 mt-8">
        <h2 className="text-xl font-black mb-4 flex items-center gap-2">
          <Phone size={20} className="text-brand" /> Need help arranging delivery?
        </h2>
        <p className="text-charcoal leading-relaxed mb-4">
          Call us with your reference number and we'll talk you through the options. We don't offer a
          fitting service — you're welcome to arrange your own fitter.
        </p>
        <EnquireButtons />
      </div>
    </div>
  );
}
