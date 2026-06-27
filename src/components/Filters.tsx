import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

export type SortKey = "popularity" | "newest" | "price-asc" | "price-desc" | "size";

export type FilterState = {
  search: string;
  colour: string;
  width: string;
  sort: SortKey;
};

const SORT_LABELS: Record<SortKey, string> = {
  popularity: "Most popular",
  newest: "Newest in",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  size: "Size (largest)",
};

export function Filters({
  state,
  onChange,
  colourOptions,
  widthOptions,
}: {
  state: FilterState;
  onChange: (s: FilterState) => void;
  colourOptions: { colour: string; hex: string }[];
  widthOptions: number[];
}) {
  const [open, setOpen] = useState(false);

  const activeCount =
    (state.colour ? 1 : 0) + (state.width ? 1 : 0) + (state.sort !== "popularity" ? 1 : 0);

  const Controls = (
    <div className="grid gap-3 md:grid-cols-[auto_auto_auto] md:items-end">
      <label className="block">
        <span className="text-xs font-black uppercase tracking-wider text-mid block mb-1">Colour</span>
        <select
          value={state.colour}
          onChange={(e) => onChange({ ...state, colour: e.target.value })}
          className="w-full md:w-44 px-3 py-2.5 text-sm font-bold border-2 border-border rounded-md focus:border-brand outline-none bg-white"
        >
          <option value="">All colours</option>
          {colourOptions.map((c) => (
            <option key={c.colour} value={c.colour}>
              {c.colour}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs font-black uppercase tracking-wider text-mid block mb-1">Width</span>
        <select
          value={state.width}
          onChange={(e) => onChange({ ...state, width: e.target.value })}
          className="w-full md:w-32 px-3 py-2.5 text-sm font-bold border-2 border-border rounded-md focus:border-brand outline-none bg-white"
        >
          <option value="">Any width</option>
          {widthOptions.map((w) => (
            <option key={w} value={String(w)}>
              {w}m
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs font-black uppercase tracking-wider text-mid block mb-1">Sort by</span>
        <select
          value={state.sort}
          onChange={(e) => onChange({ ...state, sort: e.target.value as SortKey })}
          className="w-full md:w-44 px-3 py-2.5 text-sm font-bold border-2 border-border rounded-md focus:border-brand outline-none bg-white"
        >
          {Object.entries(SORT_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  return (
    <div className="card-surface p-3 md:p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <label className="block flex-1">
          <span className="text-xs font-black uppercase tracking-wider text-mid block mb-1">Search</span>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mid" aria-hidden />
            <input
              type="search"
              value={state.search}
              onChange={(e) => onChange({ ...state, search: e.target.value })}
              placeholder="Search roll ends…"
              aria-label="Search roll ends"
              className="w-full pl-9 pr-3 py-2.5 text-sm font-bold border-2 border-border rounded-md focus:border-brand outline-none bg-white"
            />
          </div>
        </label>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="md:hidden inline-flex items-center justify-center gap-2 h-11 px-4 rounded-md border-2 border-charcoal text-charcoal text-sm font-black uppercase tracking-wider"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <SlidersHorizontal size={16} aria-hidden />
          Filter &amp; sort
          {activeCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-brand text-white text-[10px] font-black">
              {activeCount}
            </span>
          )}
        </button>

        <div className="hidden md:block">{Controls}</div>
      </div>

      {open && (
        <div
          className="md:hidden fixed inset-0 z-[60] bg-charcoal/60 flex items-end"
          role="dialog"
          aria-modal="true"
          aria-label="Filter and sort"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full bg-white rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-lg">Filter &amp; sort</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 -mr-2 text-charcoal"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>
            {Controls}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  onChange({ search: state.search, colour: "", width: "", sort: "popularity" })
                }
                className="flex-1 h-11 rounded-md border-2 border-border text-sm font-black uppercase tracking-wider"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 h-11 rounded-md bg-brand text-white text-sm font-black uppercase tracking-wider"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
