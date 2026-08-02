import { useCallback, useEffect, useRef, useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

type Props = {
  /** Source image: a File chosen by the admin, or an existing image URL. */
  file?: File;
  url?: string;
  /** Called with the cropped image as a JPEG blob. */
  onCropped: (blob: Blob) => void;
  onCancel: () => void;
};

const ASPECTS: { label: string; value: number | null }[] = [
  { label: "4:3", value: 4 / 3 },
  { label: "1:1", value: 1 },
  { label: "3:2", value: 3 / 2 },
  { label: "16:9", value: 16 / 9 },
  { label: "Original", value: null },
];

const MAX_OUT = 1600;
const MIN_ZOOM = 1;
const MAX_ZOOM = 6;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export default function ImageCropper({ file, url, onCropped, onCancel }: Props) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [aspect, setAspect] = useState<number | null>(4 / 3);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  // Load the source image
  useEffect(() => {
    let objectUrl: string | null = null;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => setImg(image);
    image.onerror = () => setLoadError("Could not load this image for cropping.");
    if (file) {
      objectUrl = URL.createObjectURL(file);
      image.src = objectUrl;
    } else if (url) {
      image.src = url;
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file, url]);

  const effAspect = aspect ?? (img ? img.naturalWidth / img.naturalHeight : 4 / 3);

  // Measure the crop box
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      setBox({ w, h: w / effAspect });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [effAspect, img]);

  const baseScale =
    img && box.w
      ? Math.max(box.w / img.naturalWidth, box.h / img.naturalHeight)
      : 1;
  const scale = baseScale * zoom;

  const clampOffset = useCallback(
    (o: { x: number; y: number }, s: number) => {
      if (!img) return o;
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      return {
        x: clamp(o.x, Math.min(0, box.w - dw), 0),
        y: clamp(o.y, Math.min(0, box.h - dh), 0),
      };
    },
    [img, box.w, box.h],
  );

  // Centre whenever geometry changes
  const recentre = useCallback(
    (z: number) => {
      if (!img || !box.w) return;
      const s = baseScale * z;
      setOffset({
        x: (box.w - img.naturalWidth * s) / 2,
        y: (box.h - img.naturalHeight * s) / 2,
      });
    },
    [img, box.w, box.h, baseScale],
  );

  useEffect(() => {
    recentre(zoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img, box.w, box.h, effAspect]);

  function applyZoom(next: number, anchor?: { x: number; y: number }) {
    const z = clamp(next, MIN_ZOOM, MAX_ZOOM);
    setZoom((prev) => {
      const k = z / prev;
      const px = anchor?.x ?? box.w / 2;
      const py = anchor?.y ?? box.h / 2;
      setOffset((o) => clampOffset({ x: px - (px - o.x) * k, y: py - (py - o.y) * k }, baseScale * z));
      return z;
    });
  }

  // Non-passive wheel zoom
  const zoomRef = useRef(applyZoom);
  zoomRef.current = applyZoom;
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      const rect = el.getBoundingClientRect();
      setZoom((z) => {
        const next = clamp(z * Math.exp(-dy * 0.0015), MIN_ZOOM, MAX_ZOOM);
        zoomRef.current(next, { x: e.clientX - rect.left, y: e.clientY - rect.top });
        return z;
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d) return;
    setOffset(clampOffset({ x: d.ox + (e.clientX - d.x), y: d.oy + (e.clientY - d.y) }, scale));
  }
  function endDrag() {
    dragRef.current = null;
  }

  function confirm() {
    if (!img || !box.w) return;
    const sx = -offset.x / scale;
    const sy = -offset.y / scale;
    const sw = box.w / scale;
    const sh = box.h / scale;
    const outW = Math.round(Math.min(sw, MAX_OUT));
    const outH = Math.round(outW / effAspect);
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);
    canvas.toBlob(
      (blob) => {
        if (blob) onCropped(blob);
      },
      "image/jpeg",
      0.9,
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-border">
          <h2 className="font-black uppercase tracking-wide text-sm">Crop & zoom</h2>
          <button type="button" onClick={onCancel} aria-label="Cancel cropping" className="text-mid">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {loadError ? (
            <p className="text-sm font-bold text-brand">{loadError}</p>
          ) : (
            <>
              <div
                ref={boxRef}
                style={{ height: box.h || undefined }}
                className="relative w-full overflow-hidden rounded-md bg-black touch-none cursor-grab active:cursor-grabbing select-none"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              >
                {img && (
                  <img
                    src={img.src}
                    alt=""
                    draggable={false}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      transformOrigin: "0 0",
                      transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                      width: img.naturalWidth,
                      height: img.naturalHeight,
                      maxWidth: "none",
                    }}
                  />
                )}
                <div className="pointer-events-none absolute inset-0 border-2 border-white/70" />
              </div>

              <div className="flex flex-wrap gap-2">
                {ASPECTS.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    onClick={() => setAspect(a.value)}
                    className={`px-3 py-1.5 text-xs font-black uppercase tracking-wide rounded-md border-2 ${
                      aspect === a.value ? "border-brand text-brand" : "border-border text-mid"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button type="button" onClick={() => applyZoom(zoom - 0.25)} aria-label="Zoom out">
                  <ZoomOut size={18} />
                </button>
                <input
                  type="range"
                  min={MIN_ZOOM}
                  max={MAX_ZOOM}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => applyZoom(Number(e.target.value))}
                  className="flex-1 accent-[hsl(var(--brand))]"
                  aria-label="Zoom level"
                />
                <button type="button" onClick={() => applyZoom(zoom + 0.25)} aria-label="Zoom in">
                  <ZoomIn size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    recentre(1);
                  }}
                  aria-label="Reset crop"
                  className="text-mid"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onCancel} className="btn-outline-charcoal text-sm">
              Cancel
            </button>
            <button type="button" onClick={confirm} disabled={!img} className="btn-brand text-sm">
              Use this crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
