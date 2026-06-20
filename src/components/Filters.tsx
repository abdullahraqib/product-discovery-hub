import { Search } from "lucide-react";
import { COLOUR_OPTIONS, WIDTH_OPTIONS } from "@/data/products";

export type SortKey = "popularity" | "newest" | "price-asc" | "price-desc" | "size";

export type FilterState = {
  search: string;
  colour: string;
  width: string;
  sort: SortKey;
};

export function Filters({
  state,
  onChange,
}: {
  state: FilterState;
  onChange: (s: FilterState) => void;
}) {
  return (
    <div className="card-surface p-4 grid gap-3 md:grid-cols-[1fr_auto_auto_auto] items-end">
      <label className="block">
        <span className="text-xs font-black uppercase tracking-wider text-mid block mb-1">
          Search
        </span>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-mid"
            aria-hidden
          />
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

      <label className="block">
        <span className="text-xs font-black uppercase tracking-wider text-mid block mb-1">
          Colour
        </span>
        <select
          value={state.colour}
          onChange={(e) => onChange({ ...state, colour: e.target.value })}
          className="w-full md:w-44 px-3 py-2.5 text-sm font-bold border-2 border-border rounded-md focus:border-brand outline-none bg-white"
        >
          <option value="">All colours</option>
          {COLOUR_OPTIONS.map((c) => (
            <option key={c.colour} value={c.colour}>
              {c.colour}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs font-black uppercase tracking-wider text-mid block mb-1">
          Width
        </span>
        <select
          value={state.width}
          onChange={(e) => onChange({ ...state, width: e.target.value })}
          className="w-full md:w-32 px-3 py-2.5 text-sm font-bold border-2 border-border rounded-md focus:border-brand outline-none bg-white"
        >
          <option value="">Any width</option>
          {WIDTH_OPTIONS.map((w) => (
            <option key={w} value={String(w)}>
              {w}m
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs font-black uppercase tracking-wider text-mid block mb-1">
          Sort by
        </span>
        <select
          value={state.sort}
          onChange={(e) => onChange({ ...state, sort: e.target.value as SortKey })}
          className="w-full md:w-44 px-3 py-2.5 text-sm font-bold border-2 border-border rounded-md focus:border-brand outline-none bg-white"
        >
          <option value="popularity">Most popular</option>
          <option value="newest">Newest in</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="size">Size (largest)</option>
        </select>
      </label>
    </div>
  );
}
