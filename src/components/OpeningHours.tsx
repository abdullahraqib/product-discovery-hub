import { SITE } from "@/lib/site";

export function OpeningHours() {
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long" });
  return (
    <div className="card-surface p-6">
      <h3 className="text-lg font-black mb-3">Opening Hours</h3>
      <ul className="text-sm">
        {SITE.hours.map((h) => {
          const isToday = h.day === today;
          return (
            <li
              key={h.day}
              className={`flex justify-between py-1.5 border-b border-border last:border-0 ${
                isToday ? "font-black text-brand" : "text-charcoal"
              }`}
            >
              <span>
                {h.day}
                {isToday && <span className="ml-2 text-[10px] uppercase">Today</span>}
              </span>
              <span>
                {h.open}–{h.close}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
