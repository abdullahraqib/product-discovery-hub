import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";

export function LocationMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  return (
    <div className="card-surface overflow-hidden">
      <div ref={ref} className="w-full h-[320px] bg-neutral-200">
        {show && (
          <iframe
            title={`Map of ${SITE.name}`}
            src={SITE.mapsEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-[320px] block border-0"
          />
        )}
      </div>
      <div className="p-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="text-sm">
          <div className="font-black">{SITE.name}</div>
          <div className="text-mid">{SITE.address.full}</div>
        </div>
        <a
          href={SITE.mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-charcoal text-sm"
        >
          Directions
        </a>
      </div>
    </div>
  );
}
