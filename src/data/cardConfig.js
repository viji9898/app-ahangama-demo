export const CARD_PRODUCTS = {
  standard: {
    id: "standard",
    name: "Ahangama Card",
    priceUsd: 35,
    validityDays: 30,
    maxPeople: 1,
    oncePerDayPerVenue: true,
    validForOnePerson: true,
    description: "Full access to all partner venues and offers",
    bestFor: "Solo travelers, couples sharing a card",
    features: ["All venue discounts", "Standard offers", "30-day validity"],
  },

  duo: {
    id: "duo",
    name: "Ahangama Duo Card",
    priceUsd: 60,
    validityDays: 30,
    maxPeople: 2,
    oncePerDayPerVenue: true,
    validForOnePerson: false,
    description:
      "Same access and offers as the standard Ahangama Card for 2 people",
    bestFor: "Couples, friends travelling together",
    features: ["All venue discounts", "Named for 2 people", "30-day validity"],
  },

  longStay: {
    id: "longStay",
    name: "Ahangama Long-Stay Card",
    priceUsd: 60,
    validityDays: 90,
    maxPeople: 1,
    oncePerDayPerVenue: true,
    validForOnePerson: true,
    description:
      "Includes all standard discounts + occasional members-only offers",
    bestFor: "Digital nomads, slow travellers",
    features: [
      "All standard discounts",
      "Members-only offers",
      "90-day validity",
    ],
  },

  explorer: {
    id: "explorer",
    name: "Ahangama Explorer Card (Premium)",
    priceUsd: 99,
    validityDays: 90,
    maxPeople: 1,
    oncePerDayPerVenue: true,
    validForOnePerson: true,
    description:
      "Premium experiences, early access to new venues, and exclusive perks",
    bestFor: "Power users, creators, long-stay visitors",
    features: [
      "Premium experiences",
      "Early venue access",
      "Exclusive perks",
      "90-day validity",
    ],
    isPremium: true,
  },

  week: {
    id: "week",
    name: "Ahangama Week Pass",
    priceUsd: 15,
    validityDays: 7,
    maxPeople: 1,
    oncePerDayPerVenue: true,
    validForOnePerson: true,
    description: "Limited partner venues",
    bestFor: "Short stays, first-time visitors",
    features: ["Limited venues", "7-day validity", "Perfect for short trips"],
    isLimited: true,
  },
};

// Legacy export for backward compatibility
export const CARD_PRODUCT = CARD_PRODUCTS.standard;
