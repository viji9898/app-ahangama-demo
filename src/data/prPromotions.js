const DEFAULT_ITEM_SUBTITLE = "Included with this venue offer";
const DEFAULT_PASS_SUBTITLE = "USD30 · 1 Month · 100+ Perks · All Ahangama";
const STANDARD_PASS_SUBTITLE = "1 Year · 100+ Perks · All Ahangama";

export const DEFAULT_PR_PROMOTION = {
  trustPoints: ["Instant access", "Valid across Ahangama", "100+ local perks"],
  receipt: {
    title: "YOUR ORDER",
    currency: "USD",
    items: [
      {
        icon: "coffee",
        label: "Any coffee",
        subtitle: DEFAULT_ITEM_SUBTITLE,
        quantity: 1,
        unitPrice: 3.5,
      },
      {
        icon: "pastry",
        label: "Any pastry",
        subtitle: DEFAULT_ITEM_SUBTITLE,
        quantity: 1,
        unitPrice: 4,
      },
      {
        icon: "postcards",
        label: "Postcards",
        subtitle: DEFAULT_ITEM_SUBTITLE,
        quantity: 2,
        unitPrice: 2,
      },
      {
        icon: "pass",
        label: "Ahangama Pass",
        subtitle: DEFAULT_PASS_SUBTITLE,
        quantity: 1,
        unitPrice: 30,
        showDividerBefore: true,
      },
    ],
    promoPrice: 18,
  },
  conversion: {
    header: "Local Benefits Across 100+ Venues",
    codeLabel: "Use code:",
    codeValue: "KAFFI60",
    buttonText: "GET AHANGAMA PASS NOW",
  },
};

export const PR_PROMOTIONS = {
  "kaffi-ag": {
    receipt: {
      title: "YOUR ORDER",
      currency: "USD",
      items: [
        {
          icon: "coffee",
          label: "Any coffee",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 1,
          unitPrice: 3.5,
        },
        {
          icon: "pastry",
          label: "Any pastry",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 1,
          unitPrice: 4,
        },
        {
          icon: "postcards",
          label: "Postcards",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 2,
          unitPrice: 2,
        },
        {
          icon: "pass",
          label: "Ahangama Pass",
          subtitle: DEFAULT_PASS_SUBTITLE,
          quantity: 1,
          unitPrice: 30,
          showDividerBefore: true,
        },
      ],
      promoPrice: 18,
    },
    conversion: {
      codeValue: "KAFFI60",
    },
  },
  coconut: {
    receipt: {
      title: "YOUR ORDER",
      currency: "USD",
      items: [
        {
          icon: "coffee",
          label: "Pickleball access",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 1,
          unitPrice: 8,
        },
        {
          icon: "pastry",
          label: "Wellness perk",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 1,
          unitPrice: 6,
        },
        {
          icon: "postcards",
          label: "Postcards",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 2,
          unitPrice: 2,
        },
        {
          icon: "pass",
          label: "Ahangama Pass",
          subtitle: STANDARD_PASS_SUBTITLE,
          quantity: 1,
          unitPrice: 30,
          showDividerBefore: true,
        },
      ],
      promoPrice: 18,
    },
    conversion: {
      codeValue: "COCO60",
    },
  },
  tahini: {
    receipt: {
      title: "YOUR ORDER",
      currency: "USD",
      items: [
        {
          icon: "yoga-classes",
          label: "Yoga classes",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 3,
          unitPrice: 9.31,
        },
        {
          icon: "postcards",
          label: "Postcards",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 2,
          unitPrice: 2.17,
        },
        {
          icon: "pass",
          label: "Ahangama Pass",
          subtitle: STANDARD_PASS_SUBTITLE,
          quantity: 1,
          unitPrice: 30,
          showDividerBefore: true,
        },
      ],
      promoPrice: 22,
    },
    conversion: {
      codeValue: "HELLO50",
    },
  },
  pura: {
    receipt: {
      title: "YOUR ORDER",
      currency: "USD",
      items: [
        {
          icon: "yoga-mat",
          label: "Yoga mat",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 1,
          unitPrice: 9.31,
        },
        {
          icon: "pilates-class",
          label: "Pilates class",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 1,
          unitPrice: 9.31,
        },
        {
          icon: "postcards",
          label: "Postcards",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 2,
          unitPrice: 2.17,
        },
        {
          icon: "pass",
          label: "Ahangama Pass",
          subtitle: STANDARD_PASS_SUBTITLE,
          quantity: 1,
          unitPrice: 30,
          showDividerBefore: true,
        },
      ],
      promoPrice: 22,
    },
    conversion: {
      codeValue: "HELLO50",
    },
  },
  mana: {
    receipt: {
      title: "YOUR ORDER",
      currency: "USD",
      items: [
        {
          icon: "coffee",
          label: "Stay credit",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 1,
          unitPrice: 10,
        },
        {
          icon: "pastry",
          label: "Boutique villa benefit",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 1,
          unitPrice: 5,
        },
        {
          icon: "postcards",
          label: "Postcards",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 2,
          unitPrice: 2,
        },
        {
          icon: "pass",
          label: "Ahangama Pass",
          subtitle: STANDARD_PASS_SUBTITLE,
          quantity: 1,
          unitPrice: 30,
          showDividerBefore: true,
        },
      ],
      promoPrice: 15,
    },
    conversion: {
      codeValue: "HELLO50",
    },
  },
  living: {
    receipt: {
      title: "YOUR ORDER",
      currency: "USD",
      items: [
        {
          icon: "coffee",
          label: "Coffee and brunch credit",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 1,
          unitPrice: 8,
        },
        {
          icon: "pastry",
          label: "Menu perk",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 1,
          unitPrice: 4,
        },
        {
          icon: "postcards",
          label: "Postcards",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 2,
          unitPrice: 2,
        },
        {
          icon: "pass",
          label: "Ahangama Pass",
          subtitle: STANDARD_PASS_SUBTITLE,
          quantity: 1,
          unitPrice: 30,
          showDividerBefore: true,
        },
      ],
      promoPrice: 15,
    },
    conversion: {
      codeValue: "HELLO50",
    },
  },
};

const PR_PROMOTION_ALIASES = {
  "tahini-f": "tahini",
};

export function resolvePrPromotionSlug(slug) {
  if (!slug) {
    return "";
  }

  return PR_PROMOTIONS[slug] ? slug : PR_PROMOTION_ALIASES[slug] || slug;
}

export function getPrPromoCheckoutContext(slug, promoCode) {
  const resolvedSlug = resolvePrPromotionSlug(slug);
  const promotion = getPrPromotion(resolvedSlug);
  const resolvedPromoCode = String(promoCode || "").trim().toUpperCase();
  const expectedPromoCode = String(
    promotion?.conversion?.codeValue || "",
  ).trim().toUpperCase();

  if (!resolvedSlug || !PR_PROMOTIONS[resolvedSlug]) {
    return null;
  }

  if (!resolvedPromoCode || resolvedPromoCode !== expectedPromoCode) {
    return null;
  }

  return {
    slug: resolvedSlug,
    promoCode: promotion.conversion.codeValue,
    promoPrice: Number(promotion.receipt?.promoPrice) || 0,
    currency: promotion.receipt?.currency || "USD",
    promotion,
  };
}

export function getPrPromotion(slug) {
  const resolvedSlug = resolvePrPromotionSlug(slug);

  if (!resolvedSlug) {
    return DEFAULT_PR_PROMOTION;
  }

  const promotion = PR_PROMOTIONS[resolvedSlug];

  if (!promotion) {
    return DEFAULT_PR_PROMOTION;
  }

  return {
    ...DEFAULT_PR_PROMOTION,
    ...promotion,
    receipt: {
      ...DEFAULT_PR_PROMOTION.receipt,
      ...promotion.receipt,
      items: promotion.receipt?.items || DEFAULT_PR_PROMOTION.receipt.items,
    },
    conversion: {
      ...DEFAULT_PR_PROMOTION.conversion,
      ...promotion.conversion,
    },
  };
}
