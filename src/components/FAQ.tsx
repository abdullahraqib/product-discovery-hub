import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/data/faqs";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="container-page my-16" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto">
        <h2 id="faq-heading" className="text-2xl md:text-3xl font-black text-center mb-2">
          Frequently asked questions
        </h2>
        <p className="text-center text-mid text-sm mb-8">
          Can't find your answer? Call us or drop us an email.
        </p>
        <div className="space-y-2">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="card-surface overflow-hidden">
                <button
                  className="w-full flex items-center justify-between gap-4 p-4 text-left font-black"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-sm text-mid leading-relaxed">{f.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
