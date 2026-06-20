import { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { REVIEWS } from "@/data/reviews";

export function ReviewCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % REVIEWS.length), 6000);
    return () => clearInterval(t);
  }, []);

  const review = REVIEWS[i];

  return (
    <section className="container-page my-16" aria-label="Customer reviews">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1 mb-2" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, k) => (
            <Star key={k} size={20} className="fill-brand text-brand" />
          ))}
        </div>
        <h2 className="text-2xl md:text-3xl font-black">What our customers say</h2>
        <p className="text-sm text-mid mt-1">Real 5-star reviews from Google</p>
      </div>

      <div className="card-surface p-6 md:p-10 max-w-3xl mx-auto relative">
        <blockquote className="text-center min-h-[120px] flex flex-col justify-center">
          <p className="text-base md:text-lg leading-relaxed italic text-charcoal">
            “{review.text}”
          </p>
          <footer className="mt-4 text-sm font-black text-charcoal">
            {review.name}
            <span className="text-mid font-normal"> • {review.source}</span>
          </footer>
        </blockquote>

        <button
          aria-label="Previous review"
          onClick={() => setI((v) => (v - 1 + REVIEWS.length) % REVIEWS.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-charcoal text-white grid place-items-center hover:bg-brand transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          aria-label="Next review"
          onClick={() => setI((v) => (v + 1) % REVIEWS.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-charcoal text-white grid place-items-center hover:bg-brand transition-colors"
        >
          <ChevronRight size={18} />
        </button>

        <div className="flex gap-1.5 justify-center mt-6">
          {REVIEWS.map((_, k) => (
            <button
              key={k}
              aria-label={`Show review ${k + 1}`}
              onClick={() => setI(k)}
              className={`h-1.5 rounded-full transition-all ${
                k === i ? "w-6 bg-brand" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
