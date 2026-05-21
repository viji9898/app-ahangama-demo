const DEFAULT_ITEM_SUBTITLE = "Included with this venue offer";
const DEFAULT_PASS_SUBTITLE = "USD30 · 1 Month · 100+ Perks · All Ahangama";
const STANDARD_PASS_SUBTITLE = "1 Year · 100+ Perks · All Ahangama";

export const DEFAULT_PR_PROMOTION = {
  venueEmail: "hello@viji.com",
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
    venueEmail: "hello@viji.com",
    receipt: {
      title: "YOUR ORDER",
      currency: "USD",
      items: [
        {
          icon: "coffee",
          label: "Any coffee",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 1,
          unitPrice: 6.05,
        },
        {
          icon: "pastry",
          label: "Any pastry",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 1,
          unitPrice: 4.36,
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
          subtitle: DEFAULT_PASS_SUBTITLE,
          quantity: 1,
          unitPrice: 30,
          showDividerBefore: true,
        },
      ],
      promoPrice: 22,
    },
    conversion: {
      codeValue: "KAFFI60",
    },
  },
  coconut: {
    venueEmail: "hello@viji.com",
    receipt: {
      title: "YOUR ORDER",
      currency: "USD",
      items: [
        {
          icon: "gift",
          label: "Pickle ball Upto to 4 players",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 1,
          unitPrice: 23,
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
      promoPrice: 22,
    },
    conversion: {
      codeValue: "COCO60",
    },
  },
  tahini: {
    venueEmail: "hello@viji.com",
    receipt: {
      title: "YOUR ORDER",
      currency: "USD",
      items: [
        {
          icon: "yoga-classes",
          label: "Yoga classes",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 3,
          unitPrice: 9.22,
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
      codeValue: "TAHINI60",
    },
  },
  pura: {
    venueEmail: "hello@viji.com",
    receipt: {
      title: "YOUR ORDER",
      currency: "USD",
      items: [
        {
          icon: "yoga-mat",
          label: "Yoga mat",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 1,
          unitPrice: 9,
        },
        {
          icon: "pilates-class",
          label: "Pilates class",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 1,
          unitPrice: 8.66,
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
      codeValue: "PURA50",
    },
  },
  mana: {
    venueEmail: "hello@viji.com",
    receipt: {
      title: "YOUR ORDER",
      currency: "USD",
      items: [
        {
          icon: "gift",
          label: "Sauna + Ice bath",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 1,
          unitPrice: 15,
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
      promoPrice: 22,
    },
    conversion: {
      codeValue: "MANA50",
    },
  },
  living: {
    venueEmail: "hello@viji.com",
    receipt: {
      title: "YOUR ORDER",
      currency: "USD",
      items: [
        {
          icon: "coffee",
          label: "Any Beverage",
          subtitle: DEFAULT_ITEM_SUBTITLE,
          quantity: 1,
          unitPrice: 4,
        },
        {
          icon: "gift",
          label: "Homemade Cookie ",
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
      promoPrice: 22,
    },
    conversion: {
      codeValue: "LIVINGG50",
    },
  },
};

const PR_PROMOTION_ALIASES = {
  "coconut-c": "coconut",
  "living-r-c-s": "living",
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
  const resolvedPromoCode = String(promoCode || "")
    .trim()
    .toUpperCase();
  const expectedPromoCode = String(promotion?.conversion?.codeValue || "")
    .trim()
    .toUpperCase();

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
