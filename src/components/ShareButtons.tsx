import { useState } from "react";
import { Facebook, Link2, Check } from "lucide-react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const fullUrl =
    typeof window !== "undefined" ? new URL(url, window.location.origin).toString() : url;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center" role="group" aria-label="Share">
      <span className="text-xs font-black uppercase tracking-wider text-mid mr-1">Share:</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="h-9 px-3 inline-flex items-center gap-2 text-sm font-bold rounded-md border-2 border-border hover:border-brand hover:text-brand transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook size={16} /> Facebook
      </a>
      <a
        href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(fullUrl)}`}
        className="h-9 px-3 inline-flex items-center gap-2 text-sm font-bold rounded-md border-2 border-border hover:border-brand hover:text-brand transition-colors"
        aria-label="Share by email"
      >
        Email
      </a>
      <button
        type="button"
        onClick={copy}
        className="h-9 px-3 inline-flex items-center gap-2 text-sm font-bold rounded-md border-2 border-border hover:border-brand hover:text-brand transition-colors"
        aria-label="Copy link"
      >
        {copied ? <Check size={16} /> : <Link2 size={16} />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
