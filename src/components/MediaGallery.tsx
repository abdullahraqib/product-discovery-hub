import { useCallback, useEffect, useRef, useState } from "react";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Play, Maximize2 } from "lucide-react";
import { isVideo } from "@/lib/media";

const MIN_SCALE = 1;
const MAX_SCALE = 5;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function MediaGallery({ media, alt }: { media: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  if (media.length === 0) return null;
  const current = media[Math.min(index, media.length - 1)];

  return (
    <div>
      <div className="relative">
        {isVideo(current) ? (
          <video
            src={current}
            controls
            playsInline
            preload="metadata"
            className="w-full aspect-video rounded-lg bg-black object-contain"
          />
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative block w-full aspect-video rounded-lg overflow-hidden bg-neutral-100 group"
            aria-label="Open full-size image"
          >
            <img
              src={current}
              alt={alt}
              className="w-full h-full object-contain"
            />
            <span className="absolute bottom-3 right-3 bg-charcoal/80 text-white rounded-full p-2">
              <ZoomIn size={16} />
            </span>
          </button>

        )}

        {isVideo(current) && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute top-3 right-3 bg-charcoal/80 text-white rounded-full p-2 hover:bg-brand"
            aria-label="Open full screen"
          >
            <Maximize2 size={16} />
          </button>
        )}
      </div>

      {media.length > 1 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {media.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${isVideo(src) ? "video" : "image"} ${i + 1}`}
              aria-current={i === index}
              className={`relative w-20 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                i === index ? "border-brand" : "border-transparent"
              }`}
            >
              {isVideo(src) ? (
                <>
                  <video src={src} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                  <span className="absolute inset-0 grid place-items-center bg-black/30 text-white">
                    <Play size={16} />
                  </span>
                </>
              ) : (
                <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
              )}
            </button>
          ))}
        </div>
      )}

      {open && (
        <Lightbox
          media={media}
          alt={alt}
          index={Math.min(index, media.length - 1)}
          onIndexChange={setIndex}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

function Lightbox({
  media,
  alt,
  index,
  onIndexChange,
  onClose,
}: {
  media: string[];
  alt: string;
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());

  const src = media[index];
  const video = isVideo(src);
  const multiple = media.length > 1;

  const reset = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const go = useCallback(
    (delta: number) => {
      if (!multiple) return;
      reset();
      onIndexChange((index + delta + media.length) % media.length);
    },
    [index, media.length, multiple, onIndexChange, reset],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "+" || e.key === "=") setScale((s) => clamp(s + 0.5, MIN_SCALE, MAX_SCALE));
      else if (e.key === "-") setScale((s) => clamp(s - 0.5, MIN_SCALE, MAX_SCALE));
      else if (e.key === "0") reset();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [go, onClose, reset]);

  const zoomBy = (delta: number) =>
    setScale((s) => {
      const next = clamp(s + delta, MIN_SCALE, MAX_SCALE);
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });

  const onWheel = (e: React.WheelEvent) => {
    if (video) return;
    e.preventDefault();
    zoomBy(e.deltaY > 0 ? -0.3 : 0.3);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (video) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchRef.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale };
      dragRef.current = null;
    } else if (scale > 1) {
      dragRef.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchRef.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const next = clamp((pinchRef.current.scale * dist) / pinchRef.current.dist, MIN_SCALE, MAX_SCALE);
      setScale(next);
      if (next === 1) setOffset({ x: 0, y: 0 });
      return;
    }

    if (dragRef.current) {
      setOffset({
        x: dragRef.current.ox + (e.clientX - dragRef.current.x),
        y: dragRef.current.oy + (e.clientY - dragRef.current.y),
      });
    }
  };

  const endPointer = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchRef.current = null;
    if (pointers.current.size === 0) dragRef.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 select-none"
      role="dialog"
      aria-modal
      aria-label="Media preview"
    >
      <div className="absolute top-0 inset-x-0 flex items-center justify-between p-4 z-10">
        <span className="text-white/80 text-xs font-black uppercase tracking-widest">
          {index + 1} / {media.length}
        </span>
        <div className="flex items-center gap-2">
          {!video && (
            <>
              <button
                type="button"
                onClick={() => zoomBy(-0.5)}
                disabled={scale <= MIN_SCALE}
                className="text-white p-2 rounded-full bg-white/10 hover:bg-brand disabled:opacity-40"
                aria-label="Zoom out"
              >
                <ZoomOut size={20} />
              </button>
              <button
                type="button"
                onClick={() => zoomBy(0.5)}
                disabled={scale >= MAX_SCALE}
                className="text-white p-2 rounded-full bg-white/10 hover:bg-brand disabled:opacity-40"
                aria-label="Zoom in"
              >
                <ZoomIn size={20} />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-white p-2 rounded-full bg-white/10 hover:bg-brand"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div
        className="absolute inset-0 overflow-hidden grid place-items-center touch-none"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onDoubleClick={() => (scale > 1 ? reset() : setScale(2.5))}
        onClick={(e) => {
          if (e.target === e.currentTarget && scale === 1) onClose();
        }}
      >
        {video ? (
          <video
            src={src}
            controls
            autoPlay
            playsInline
            className="max-w-[92vw] max-h-[85vh] object-contain"
          />
        ) : (
          <img
            src={src}
            alt={alt}
            draggable={false}
            className="max-w-[92vw] max-h-[85vh] object-contain transition-transform duration-75"
            style={{
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
              cursor: scale > 1 ? "grab" : "zoom-in",
            }}
          />
        )}
      </div>

      {multiple && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-white/10 hover:bg-brand"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-white/10 hover:bg-brand"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-0 inset-x-0 p-4 flex gap-2 justify-center overflow-x-auto">
            {media.map((m, i) => (
              <button
                key={m + i}
                type="button"
                onClick={() => {
                  reset();
                  onIndexChange(i);
                }}
                aria-label={`Go to item ${i + 1}`}
                className={`relative shrink-0 w-16 h-12 rounded overflow-hidden border-2 ${
                  i === index ? "border-brand" : "border-white/20 opacity-60 hover:opacity-100"
                }`}
              >
                {isVideo(m) ? (
                  <>
                    <video src={m} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                    <span className="absolute inset-0 grid place-items-center bg-black/40 text-white">
                      <Play size={12} />
                    </span>
                  </>
                ) : (
                  <img src={m} alt="" className="w-full h-full object-cover" loading="lazy" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
