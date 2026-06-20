import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; to?: string; params?: Record<string, string> };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-mid">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {c.to && !last ? (
                <Link
                  to={c.to}
                  params={c.params as never}
                  className="hover:text-brand font-bold"
                >
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="text-charcoal font-bold">
                  {c.label}
                </span>
              )}
              {!last && <ChevronRight size={14} aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
