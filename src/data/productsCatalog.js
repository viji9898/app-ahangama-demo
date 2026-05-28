export const PRODUCTS_CATALOG = [
  {
    key: "12-must-do-things",
    slug: "12-must-do-things",
    title: "12 Must Do Things",
    navLabel: "12 Must Do Things",
    href: "/product/12-must-do-things",
    description: "The curated shortlist that anchors Ahangama discovery.",
  },
  {
    key: "free-ahangama-pass",
    slug: "free-ahangama-pass",
    title: "Free Ahangama Pass",
    navLabel: "Free Ahangama Pass",
    href: "/product/free-ahangama-pass",
    description: "Free onboarding layer: guide, wallet-style experience, and funnel.",
  },
  {
    key: "5usd-ahangama-pass",
    slug: "5usd-ahangama-pass",
    title: "$5 Ahangama Pass",
    navLabel: "$5 Ahangama Pass",
    href: "/product/5usd-ahangama-pass",
    description: "Low-cost pass concept for lightweight perks and upsell.",
  },
];

export function getProductBySlug(slug) {
  return PRODUCTS_CATALOG.find((product) => product.slug === slug) || null;
}
