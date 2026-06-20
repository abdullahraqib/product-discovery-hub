export const SITE = {
  name: "SR Carpets & Floors",
  shortName: "SR Carpets",
  tagline: "Bradford's Best Roll Ends",
  description:
    "Quality carpet roll ends and off-cuts in Bradford. 4m & 5m widths, all styles, unbeatable prices. Half a century of family experience and free fitting service.",
  phone: "01274 057433",
  phoneTel: "tel:01274057433",
  email: "info@srcarpetsandfloors.co.uk",
  emailMailto: "mailto:info@srcarpetsandfloors.co.uk",
  address: {
    street: "60 Valley Road",
    locality: "Bradford",
    postcode: "BD1 4AA",
    country: "United Kingdom",
    full: "60 Valley Road, Bradford, BD1 4AA",
  },
  hours: [
    { day: "Monday", open: "10:00", close: "18:00" },
    { day: "Tuesday", open: "10:00", close: "18:00" },
    { day: "Wednesday", open: "10:00", close: "18:00" },
    { day: "Thursday", open: "10:00", close: "18:00" },
    { day: "Friday", open: "10:00", close: "18:00" },
    { day: "Saturday", open: "09:00", close: "18:00" },
    { day: "Sunday", open: "11:00", close: "17:00" },
  ],
  socials: {
    instagram: "https://www.instagram.com/srcarpets/",
    facebook: "https://www.facebook.com/sandr.carpets",
    tiktok: "https://www.tiktok.com/@sr.carpets.and.fl",
  },
  mapsEmbed:
    "https://www.google.com/maps?q=60+Valley+Road,+Bradford,+BD1+4AA&output=embed",
  mapsLink:
    "https://www.google.com/maps/search/?api=1&query=SR+Carpets+%26+Floors+60+Valley+Road+Bradford+BD1+4AA",
};

export function emailEnquiryLink(productName?: string, sku?: string) {
  const subject = productName
    ? `Enquiry: ${productName}${sku ? ` (${sku})` : ""}`
    : "Roll End Enquiry";
  const body = productName
    ? `Hi SR Carpets,\n\nI'd like to enquire about: ${productName}${sku ? ` (Ref: ${sku})` : ""}.\n\nPlease could you confirm availability and let me know the next steps.\n\nThanks,\n`
    : `Hi SR Carpets,\n\nI'd like to enquire about a roll end.\n\nThanks,\n`;
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
