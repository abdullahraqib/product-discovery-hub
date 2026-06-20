import { ShieldCheck, Hammer, Award, Truck } from "lucide-react";

const ITEMS = [
  {
    icon: Award,
    title: "50+ Years Experience",
    desc: "Half a century of carpet expertise",
  },
  {
    icon: ShieldCheck,
    title: "Family Business",
    desc: "Bradford-born, independently run",
  },
  {
    icon: Hammer,
    title: "Free Fitting Quote",
    desc: "Experienced fitters across West Yorkshire",
  },
  {
    icon: Truck,
    title: "Click & Collect",
    desc: "From our Valley Road store",
  },
];

export function TrustBadges() {
  return (
    <section className="container-page my-10" aria-label="Why choose us">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ITEMS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card-surface p-5 flex items-start gap-3">
            <div className="h-10 w-10 rounded-md bg-brand/10 text-brand grid place-items-center shrink-0">
              <Icon size={20} />
            </div>
            <div>
              <div className="font-black text-sm">{title}</div>
              <div className="text-xs text-mid mt-0.5">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
