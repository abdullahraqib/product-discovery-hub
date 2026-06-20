import { useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";

export function ImageZoom({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative block w-full aspect-video rounded-lg overflow-hidden bg-neutral-200 group"
        aria-label="Zoom image"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
        />
        <span className="absolute bottom-3 right-3 bg-charcoal/80 text-white rounded-full p-2">
          <ZoomIn size={16} />
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 grid place-items-center p-4"
          role="dialog"
          aria-modal
          aria-label="Image preview"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10 hover:bg-brand"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain cursor-zoom-out"
          />
        </div>
      )}
    </>
  );
}
