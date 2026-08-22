# Reduce CLS (layout shift) on RollEndShop

Layout shift happens when content on screen moves after it first paints. On this site there are four confirmed sources, listed in order of impact.

## 1. The product grid loads after the page paints (biggest cause)

The homepage fetches roll ends in the browser with `useQuery` only. The server-rendered page shows 6 skeleton cards, then swaps in however many products exist (often 20+), so everything below the grid — reviews, map, FAQ, footer — jumps down.

Fix: load products in the route loader with `context.queryClient.ensureQueryData(productsQuery())` and read them with `useSuspenseQuery`, so the real cards are in the initial HTML. Do the same on the landing/category routes that use the same grid.

## 2. "Recently viewed" appears after hydration

That section reads local storage in an effect and returns `null` until then. When it appears it inserts a full row of cards mid-page and pushes the rest down.

Fix: move it below the review carousel, and reserve its height (render the section wrapper with a fixed min-height while unknown) so appearing content fills a space that was already there.

## 3. Web font swap reflows the big headline

Archivo Black and Lato load from Google Fonts with `display=swap`. The hero headline and card titles reflow when the real fonts land.

Fix: preload the two font files, and add `size-adjust` / `ascent-override` fallback `@font-face` rules so the fallback occupies close to the same space as the final font.

## 4. Review carousel height changes as quotes rotate

The quote box has `min-h-[120px]`, but longer reviews grow past it, shifting the map and FAQ every 6 seconds.

Fix: set a fixed height per breakpoint sized to the longest review, with the text vertically centred.

## Smaller wins

- Add explicit `width`/`height` attributes on the logo and product images (aspect ratio boxes are already in place, this just helps pre-CSS paint).
- Keep the promo marquee height fixed so the animation never changes layout height.

## Technical notes

Files touched: `src/routes/index.tsx`, `src/routes/roll-ends.index.tsx` and the landing/category routes, `src/components/RecentlyViewed.tsx`, `src/components/ReviewCarousel.tsx`, `src/components/SiteHeader.tsx`, `src/routes/__root.tsx`, `src/styles.css`. No design or copy changes — layout stays visually identical.

Verification: after deploy, Vercel Speed Insights reports CLS per route; target under 0.1.
