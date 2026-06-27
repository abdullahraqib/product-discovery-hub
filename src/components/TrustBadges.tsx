import { ShieldCheck, Award, Truck, Ruler } from "lucide-react";

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
    icon: Ruler,
    title: "4m & 5m Widths",
    desc: "All popular roll widths in stock",
  },
  {
    icon: Truck,
    title: "Click & Collect",
    desc: "From our Valley Road store",
  },
];

export function TrustBadges() {
  return (
    <section className="container-page my-6 md:my-10" aria-label="Why choose us">
      {/* Mobile: compact 2x2 icon grid */}
      <div className="grid grid-cols-2 gap-2 md:hidden">
        {ITEMS.map(({ icon: Icon, title }) => (
          <div
            key={title}
            className="card-surface p-2.5 flex items-center gap-2"
          >
            <div className="h-8 w-8 rounded-md bg-brand/10 text-brand grid place-items-center shrink-0">
              <Icon size={16} />
            </div>
            <div className="font-black text-[12px] leading-tight">{title}</div>
          </div>
        ))}
      </div>

      {/* Desktop: full cards */}
      <div className="hidden md:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
