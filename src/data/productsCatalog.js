export const PRODUCTS_CATALOG = [
  {
    key: "free-ahangama-pass",
    slug: "free-ahangama-pass",
    title: "Free Ahangama Pass",
    navLabel: "01 — Free Pass",
    href: "/product/free-ahangama-pass",
    description: "Your entry into Ahangama: recommendations, map, WhatsApp updates.",
  },
  {
    key: "pass-plus",
    slug: "pass-plus",
    title: "Ahangama Pass+",
    navLabel: "02 — Pass+",
    href: "/product/pass-plus",
    description: "Lightweight paid membership for insider perks and discounts.",
  },
  {
    key: "12-must-do-things",
    slug: "12-must-do-things",
    title: "12 Must Do Things in Ahangama",
    navLabel: "03 — 12 Must Do Things",
    href: "/product/12-must-do-things",
    description: "A curated experience bundle inspired by attraction passes.",
  },
  {
    key: "concierge",
    slug: "concierge",
    title: "Premium / Concierge",
    navLabel: "04 — Concierge",
    href: "/product/concierge",
    description: "High-touch travel support: bookings, transfers, itineraries.",
  },
];

export function getProductBySlug(slug) {
  return PRODUCTS_CATALOG.find((product) => product.slug === slug) || null;
}
