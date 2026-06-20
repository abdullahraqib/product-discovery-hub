import { SITE } from "@/lib/site";

export function LocationMap() {
  return (
    <div className="card-surface overflow-hidden">
      <iframe
        title={`Map of ${SITE.name}`}
        src={SITE.mapsEmbed}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-[320px] block border-0"
      />
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
