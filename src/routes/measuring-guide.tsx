import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Printer, Ruler } from "lucide-react";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/measuring-guide")({
  head: () => ({
    meta: [
      { title: `How to Measure a Room for Carpet — ${SITE.shortName}` },
      {
        name: "description",
        content:
          "Free measuring guide from SR Carpets & Floors. Learn how to measure your room — including doorways, bays and stairs — for a perfect carpet fit.",
      },
      { property: "og:title", content: `Carpet Measuring Guide — ${SITE.shortName}` },
      { property: "og:url", content: "/measuring-guide" },
    ],
    links: [{ rel: "canonical", href: "/measuring-guide" }],
  }),
  component: GuidePage,
});

const STEPS = [
  {
    title: "1. Measure the widest point",
    body: "Use a tape measure and record the widest distance in each direction — including bay windows, alcoves and doorways. Carpet is sold from the widest measurement, never the average.",
  },
  {
    title: "2. Add for doorways and thresholds",
    body: "Add 10cm (4\") to every measurement that meets a doorway or threshold so we have enough to tuck in cleanly under the door bar.",
  },
  {
    title: "3. Sketch your room",
    body: "Draw a quick top-down sketch and label every wall with its measurement. Mark doorways, fireplaces and radiators so we can plan around them.",
  },
  {
    title: "4. Stairs and landings",
    body: "For stairs, count the steps and measure one tread + riser, then multiply. Add 40cm extra to allow for pattern alignment and bullnose wrap.",
  },
  {
    title: "5. Bring or send your measurements",
    body: `Email your sketch to ${SITE.email} or pop in to the Valley Road store and we'll match you to the right roll end.`,
  },
];

function GuidePage() {
  return (
    <div className="container-page py-6 md:py-10">
      <div className="no-print">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Measuring Guide" }]}
        />
      </div>

      <header className="mt-6 mb-6 flex flex-wrap justify-between items-end gap-4">
        <div className="flex-1 min-w-[260px]">
          <div className="inline-flex items-center gap-2 text-brand text-xs font-black uppercase tracking-[0.2em]">
            <Ruler size={14} /> Free Guide
          </div>
          <h1 className="text-3xl md:text-4xl font-black mt-2">
            How to Measure a Room for Carpet
          </h1>
          <p className="text-mid mt-2 max-w-2xl">
            Five quick steps to get the right size carpet roll end first time. Always measure from
            the widest point — doorways included.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="btn-brand no-print"
          aria-label="Print or save as PDF"
        >
          <Printer size={18} /> Download / Print PDF
        </button>
      </header>

      <div className="card-surface p-6 md:p-10 print:shadow-none print:border print:border-border">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b-[3px] border-brand">
          <div className="h-12 w-12 rounded-full bg-brand text-white grid place-items-center font-black text-lg">
            SR
          </div>
          <div>
            <div className="font-black">{SITE.name}</div>
            <div className="text-xs text-mid">
              {SITE.address.full} • {SITE.phone}
            </div>
          </div>
        </div>

        <ol className="space-y-6">
          {STEPS.map((s) => (
            <li key={s.title}>
              <h2 className="font-black text-lg text-brand">{s.title}</h2>
              <p className="text-charcoal mt-1 leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 bg-secondary rounded-md p-5">
          <h3 className="font-black mb-2">Top tips</h3>
          <ul className="text-sm space-y-1 list-disc pl-5 text-charcoal">
            <li>Always round measurements up to the nearest 10cm.</li>
            <li>Measure twice — it's the cheapest mistake to avoid.</li>
            <li>Take photos of any awkward corners and send them with your enquiry.</li>
            <li>Roll ends are fixed length — pick the one that beats your longest wall.</li>
          </ul>
        </div>

        <p className="text-center text-xs text-mid mt-8">
          © {new Date().getFullYear()} {SITE.name} — srcarpetsandfloors.co.uk
        </p>
      </div>
    </div>
  );
}
