import { SITE } from "@/lib/site";

export type LandingSection = { h2: string; body: string[] };

export type LandingHub = {
  slug: string;
  h1: string;
  title: string;
  description: string;
  intro: string;
  sections: LandingSection[];
  faqs: { q: string; a: string }[];
  breadcrumb: string;
};

const CALL = `Call ${SITE.phone}`;

export const LANDING_HUBS: Record<string, LandingHub> = {
  "roll-ends": {
    slug: "/roll-ends",
    breadcrumb: "Carpet Roll Ends",
    h1: "Carpet Roll Ends",
    title: `Carpet Roll Ends — Huge Clearance Stock | ${SITE.name}`,
    description:
      "Browse hundreds of carpet roll ends at clearance prices. 4m and 5m widths, wool, twist, saxony and berber. New roll ends in every week at our Bradford outlet.",
    intro:
      "A roll end is the last piece left on a carpet roll — same carpet, same quality, a fraction of the price. Every roll end below is in stock right now, priced by the piece, and sold first come, first served.",
    sections: [
      {
        h2: "What is a carpet roll end?",
        body: [
          "When a full roll of carpet has been cut down for other customers, the piece left over is called a roll end (also known as a remnant or an offcut). It is identical to the carpet sold at full price on the roll — the only difference is that the length is fixed, so it has to go at a clearance price.",
          "Because roll ends are one-offs, each piece is unique. Once it is gone, it is gone — which is why our stock changes every single week.",
        ],
      },
      {
        h2: "What sizes do carpet roll ends come in?",
        body: [
          "Most of our roll ends are 4m or 5m wide, with lengths from around 2m up to 12m and beyond. Every listing shows the exact length x width of each piece and the price for that piece, so there is nothing to work out.",
          "Not sure what you need? Use the room size filter on our stock list — enter your room length and width and we will only show roll ends big enough to fit, in either direction.",
        ],
      },
      {
        h2: "How much do roll ends cost?",
        body: [
          "Roll end prices are worked out from the price per square metre for that carpet, so a bigger piece costs more and a smaller piece costs less. Typical savings against the full-roll price run from 40% to 70%.",
          `Found one you like? Note the reference number shown next to the price and ${CALL} to pay and reserve it.`,
        ],
      },
    ],
    faqs: [
      {
        q: "Are carpet roll ends good quality?",
        a: "Yes. Roll ends are cut from the same rolls as our full-price carpet — wool twists, saxonies, berber loops and more. They are discounted because of the fixed length, not because of any fault.",
      },
      {
        q: "How often do you get new roll ends in?",
        a: "New roll ends land every week. Our online stock list is updated as pieces come in and sell, so it always reflects what is actually on the floor.",
      },
    ],
  },
  "carpet-remnants": {
    slug: "/carpet-remnants",
    breadcrumb: "Carpet Remnants",
    h1: "Carpet Remnants",
    title: `Carpet Remnants — Cheap Remnant Carpet in Stock | ${SITE.name}`,
    description:
      "Cheap carpet remnants in stock now — wool, twist, saxony and berber remnants in 4m and 5m widths at up to 70% off. Bradford carpet remnant specialists.",
    intro:
      "Carpet remnants are the leftover pieces from full rolls, sold off at clearance prices. We hold one of the biggest remnant stocks in Yorkshire, with new pieces arriving weekly.",
    sections: [
      {
        h2: "Remnants, roll ends and offcuts — what's the difference?",
        body: [
          "They are all names for the same thing: a piece of carpet left over from a full roll. Some shops call them remnants, some call them roll ends, others say offcuts. Whatever the name, you are buying quality carpet at a fraction of the full-roll price.",
        ],
      },
      {
        h2: "What can you use a carpet remnant for?",
        body: [
          "Remnants are ideal for bedrooms, box rooms, landings, stairs, hallways, home offices, caravans, vans and rental properties. Larger remnants are big enough for full lounges and through-lounges.",
          "Smaller pieces also make great bound rugs and runners.",
        ],
      },
      {
        h2: "Buying a remnant from us",
        body: [
          "Every remnant is measured, priced and photographed before it goes online. Pick your piece, note the reference number next to the price, then call to pay and reserve. Collect from our Bradford store or ask about local delivery.",
        ],
      },
    ],
    faqs: [
      {
        q: "Are carpet remnants cheaper than buying off the roll?",
        a: "Considerably. Because the length is fixed, remnants are cleared at 40-70% below the equivalent full-roll price.",
      },
      {
        q: "Can I see a remnant before I buy?",
        a: `Yes — come and see it at ${SITE.address.full}. Bear in mind remnants are one-offs, so call ahead on ${SITE.phone} to check it is still available.`,
      },
    ],
  },
  "cheap-carpets": {
    slug: "/cheap-carpets",
    breadcrumb: "Cheap Carpets",
    h1: "Cheap Carpets",
    title: `Cheap Carpets in Bradford — Clearance Prices | ${SITE.name}`,
    description:
      "Cheap carpets in Bradford without cheap quality. Branded roll ends, remnants and end of line carpet at clearance prices, in 4m and 5m widths. In stock today.",
    intro:
      "Cheap carpet does not have to mean poor carpet. Everything we sell is quality carpet from full rolls — priced low because it is a roll end, a remnant or an end of line range.",
    sections: [
      {
        h2: "How we keep carpet prices low",
        body: [
          "We buy roll ends, remnants and discontinued end of line stock from mills and wholesalers, then clear them from one warehouse-style outlet. No showroom mark-up, no lengthy sales process — you see the piece, you see the price.",
          "Because every piece is a one-off, we price by the piece using the price per square metre of that carpet. What you see on the listing is what you pay.",
        ],
      },
      {
        h2: "Cheap carpet for every room",
        body: [
          "Hard-wearing twist and berber loop for stairs, hallways and high-traffic rooms. Soft saxony and wool blends for bedrooms and lounges. Budget felt-backed options for rentals and quick refreshes.",
        ],
      },
      {
        h2: "What you save",
        body: [
          "Savings against equivalent full-roll pricing typically run from 40% up to 70%. On a lounge-sized piece that is often hundreds of pounds.",
          `Everything is first come, first served — ${CALL} to pay and hold a piece before someone else does.`,
        ],
      },
    ],
    faqs: [
      {
        q: "Why are your carpets so cheap?",
        a: "Because we specialise in roll ends, remnants and end of line stock. The carpet is the same quality as full-price carpet, but the fixed length or discontinued range means it has to clear at a discount.",
      },
      {
        q: "Do you do cheap carpet fitting?",
        a: `We can put you in touch with local fitters. Call ${SITE.phone} and we will point you in the right direction.`,
      },
    ],
  },
  "end-of-line-carpets": {
    slug: "/end-of-line-carpets",
    breadcrumb: "End of Line Carpets",
    h1: "End of Line Carpets",
    title: `End of Line Carpets — Discontinued Ranges Cleared | ${SITE.name}`,
    description:
      "End of line and discontinued carpet cleared at outlet prices. Quality wool, twist and saxony ranges in 4m and 5m widths, in stock at our Bradford outlet.",
    intro:
      "End of line carpet is stock from ranges the mills have discontinued. Nothing wrong with it — it simply is not being made any more, so it has to clear.",
    sections: [
      {
        h2: "Why end of line carpet is such good value",
        body: [
          "When a mill retires a colour or a range, the remaining stock has to move. We take it on and clear it at a fraction of its original retail price. You get current-quality carpet — often premium wool blends — for budget money.",
        ],
      },
      {
        h2: "The catch (there's always one)",
        body: [
          "Once an end of line piece sells, we cannot reorder it. If you need extra later for another room, it may not be available — so buy enough in one go, and add 10cm for trimming when you measure.",
        ],
      },
      {
        h2: "How to buy",
        body: [
          `Browse the stock list, note the reference number beside the price, and ${CALL} to pay over the phone or in store. We will set it aside for collection.`,
        ],
      },
    ],
    faqs: [
      {
        q: "Is end of line carpet lower quality?",
        a: "No. End of line means the range has been discontinued by the manufacturer, not that the carpet is seconds or faulty.",
      },
      {
        q: "Can you get more of the same end of line carpet?",
        a: "Usually not — once discontinued stock is gone it cannot be reordered. Always buy enough for the whole job at once.",
      },
    ],
  },
  "carpet-offcuts": {
    slug: "/carpet-offcuts",
    breadcrumb: "Carpet Offcuts",
    h1: "Carpet Offcuts",
    title: `Carpet Offcuts For Sale — Cheap Offcut Carpet | ${SITE.name}`,
    description:
      "Carpet offcuts for sale from £ per piece. Small and large offcuts in 4m and 5m widths — ideal for bedrooms, stairs, vans, rugs and rentals. Bradford outlet.",
    intro:
      "Carpet offcuts are the pieces trimmed from full rolls. We measure, price and list every one, so you can grab exactly the size you need for a fraction of the full price.",
    sections: [
      {
        h2: "What are carpet offcuts used for?",
        body: [
          "Bedrooms, box rooms, landings, stair runs, home offices, caravans, campervan floors, workshops, rental refreshes and bound rugs. If you need a modest amount of carpet, an offcut almost always beats buying off the roll.",
        ],
      },
      {
        h2: "Finding an offcut that fits",
        body: [
          "Measure the widest points of your room and add 10cm for trimming. Then use the room size filter on our stock list — it matches any offcut that is big enough, whichever way round it turns.",
          "Our free measuring guide walks you through rooms and stairs step by step.",
        ],
      },
      {
        h2: "Prices and reserving",
        body: [
          `Each offcut is priced individually by the square metre rate of that carpet. Note the reference number beside the price and ${CALL} to pay and reserve. Collection from ${SITE.address.full}.`,
        ],
      },
    ],
    faqs: [
      {
        q: "Do you sell small carpet offcuts?",
        a: "Yes — sizes range from small pieces suitable for rugs and box rooms right up to full lounge-sized pieces.",
      },
      {
        q: "Can I get a carpet offcut bound into a rug?",
        a: `Ask when you call on ${SITE.phone} and we will let you know what is possible.`,
      },
    ],
  },
};
