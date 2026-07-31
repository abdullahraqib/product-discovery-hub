import { useEffect, useRef, useState } from "react";

type SizeOption = {
  label: string;
  price: string | number;
  ref: string;
};

type Props = {
  options: SizeOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SizeDropdown({ options, value, onChange, placeholder = "— Select a size —" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedIdx = /^\d+$/.test(value) ? Number(value) : -1;
  const selected = selectedIdx >= 0 ? options[selectedIdx] : null;

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-3 py-2.5 text-sm font-bold border-2 border-border rounded-md focus:border-brand outline-none bg-white text-left flex items-center justify-between"
      >
        <span className={selected ? "" : "text-mid"}>
          {selected ? (
            <>
              {selected.label} — £{selected.price}{" "}
              <span className="text-[#dc2626]">Reference number: ({selected.ref})</span>
            </>
          ) : (
            placeholder
          )}
        </span>
        <svg width="16" height="16" viewBox="0 0 20 20" className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          <path d="M5 7l5 6 5-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-30 mt-1 w-full max-h-72 overflow-auto rounded-md border-2 border-border bg-white shadow-lg"
        >
          <li>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="w-full px-3 py-2.5 text-left text-sm text-mid hover:bg-secondary"
            >
              {placeholder}
            </button>
          </li>
          {options.map((opt, i) => (
            <li key={opt.ref + i} role="option" aria-selected={selectedIdx === i}>
              <button
                type="button"
                onClick={() => {
                  onChange(String(i));
                  setOpen(false);
                }}
                className={`w-full px-3 py-2.5 text-left text-sm font-bold flex items-center justify-between hover:bg-secondary ${
                  selectedIdx === i ? "bg-secondary" : ""
                }`}
              >
                <span>
                  {opt.label} — £{opt.price}{" "}
                  <span className="text-[#dc2626]">({opt.ref})</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
