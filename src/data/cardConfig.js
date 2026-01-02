export const CARD_PRODUCTS = {
  week: {
    id: "week",
    name: "7-Day Pass",
    priceUsd: 18,
    validityDays: 7,
    maxPeople: 1,
    oncePerDayPerVenue: true,
    validForOnePerson: true,
    description: "Perfect for short stays and exploring Ahangama's highlights",
    bestFor: "Weekend trips, first-time visitors, short stays",
    features: [
      "All venue discounts",
      "7-day validity",
      "Perfect for short trips",
    ],
    isPopular: true,
  },

  standard: {
    id: "standard",
    name: "30-Day Pass",
    priceUsd: 35,
    validityDays: 30,
    maxPeople: 1,
    oncePerDayPerVenue: true,
    validForOnePerson: true,
    description: "Full access to all partner venues and offers for a month",
    bestFor: "Solo travelers, couples, medium-term stays",
    features: ["All venue discounts", "Standard offers", "30-day validity"],
  },

  longStay: {
    id: "longStay",
    name: "90-Day Long-Stay Pass",
    priceUsd: 60,
    validityDays: 90,
    maxPeople: 1,
    oncePerDayPerVenue: true,
    validForOnePerson: true,
    description: "Extended access for long-term visitors and digital nomads",
    bestFor: "Digital nomads, slow travelers, extended stays",
    features: [
      "All venue discounts",
      "Extended validity",
      "90-day access",
      "Best value for long stays",
    ],
  },
};

// Legacy export for backward compatibility
export const CARD_PRODUCT = CARD_PRODUCTS.week; // Default to most popular
