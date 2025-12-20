// src/data/vendorOfferFramework.js

export const VENDOR_OFFER_FRAMEWORK = [
  {
    key: "cafes-food",
    title: "Cafés & Food",
    subtitle: "Low-cost perks that encourage return visits.",
    blocks: [
      {
        heading: "Discounts (use sparingly)",
        items: [
          "10% off total bill (weekday / off-peak only)",
          "15% off second visit (encourages return)",
        ],
      },
      {
        heading: "Offers (preferred)",
        items: [
          "Free coffee / tea with breakfast",
          "Free dessert with main",
          "Free side (salad / fries / toast)",
          "Free upgrade (regular → large drink)",
        ],
      },
      {
        heading: "Services / Privileges",
        items: [
          "Priority seating when available",
          "Flexible table holding (5–10 mins)",
          "Off-menu recommendation from staff",
        ],
      },
      {
        heading: "Promotions",
        items: [
          "“Pass Morning Hour” (e.g. 8–10am perk)",
          "Buy 3 visits → 1 free drink (tracked loosely)",
        ],
      },
    ],
    why: "Low food cost, increases dwell time and repeat visits.",
  },
  {
    key: "stays",
    title: "Stays (Hotels, Guesthouses, Villas)",
    subtitle: "Use availability-based benefits to avoid price dilution.",
    blocks: [
      {
        heading: "Discounts",
        items: [
          "10% off direct bookings only",
          "5–10% off long stays (7+ nights)",
        ],
      },
      {
        heading: "Offers (best)",
        items: [
          "Free early check-in or late checkout (subject to availability)",
          "Complimentary welcome drink / fruit platter",
          "Free room upgrade if available",
        ],
      },
      {
        heading: "Services / Privileges",
        items: [
          "Priority booking window for pass holders",
          "Flexible cancellation (within reason)",
          "Local tips / concierge-style support",
        ],
      },
      {
        heading: "Promotions",
        items: [
          "Stay 3 nights, get 4th at reduced rate",
          "Low-season pass-only rates",
        ],
      },
    ],
    why: "Fills low-occupancy gaps, costs nothing if availability allows.",
  },
  {
    key: "surf-ocean",
    title: "Surf & Ocean (Schools, Rentals, Guides)",
    subtitle: "Margin-safe perks using owned equipment and time.",
    blocks: [
      {
        heading: "Discounts",
        items: ["15% off multi-day rentals", "10% off lessons booked direct"],
      },
      {
        heading: "Offers",
        items: [
          "Free board upgrade",
          "Free rash guard / leash use",
          "Free extra hour on rental",
        ],
      },
      {
        heading: "Services / Privileges",
        items: [
          "Priority booking during busy times",
          "Flexible rescheduling (weather dependent)",
          "Free surf spot advice / timing tips",
        ],
      },
      {
        heading: "Promotions",
        items: [
          "Book 3 sessions, get 1 free video analysis",
          "Pass-holder-only group sessions",
        ],
      },
    ],
    why: "Equipment already owned; marginal cost is near zero.",
  },
  {
    key: "wellness",
    title: "Wellness (Yoga, Spa, Recovery)",
    subtitle: "Fill quieter slots and build loyalty without heavy discounting.",
    blocks: [
      {
        heading: "Discounts",
        items: [
          "10–15% off treatments (off-peak hours)",
          "Discounted multi-session packs",
        ],
      },
      {
        heading: "Offers",
        items: [
          "Free class with 2 booked",
          "Free add-on (ice bath, sauna, tea ritual)",
          "Free consultation or assessment",
        ],
      },
      {
        heading: "Services / Privileges",
        items: [
          "Priority booking for popular classes",
          "Quiet-hour access where possible",
          "Extended session time (5–10 mins buffer)",
        ],
      },
      {
        heading: "Promotions",
        items: [
          "Pass-holder-only wellness mornings",
          "Community sessions (fills quieter slots)",
        ],
      },
    ],
    why: "Fills low-demand hours, builds loyalty.",
  },
  {
    key: "experiences-culture",
    title: "Experiences & Culture",
    subtitle: "Add perceived value without discounting core price.",
    blocks: [
      {
        heading: "Discounts",
        items: [
          "10% off per person (small groups)",
          "Reduced child pricing for families",
        ],
      },
      {
        heading: "Offers",
        items: [
          "Free add-on (market visit, drink, souvenir)",
          "Complimentary guide upgrade",
          "Free photos / short video clip",
        ],
      },
      {
        heading: "Services / Privileges",
        items: [
          "Smaller group sizes for pass holders",
          "Flexible start times",
          "Priority booking on limited slots",
        ],
      },
      {
        heading: "Promotions",
        items: [
          "Pass-only experiences (limited seats)",
          "Early access to new experiences",
        ],
      },
    ],
    why: "Adds perceived value without discounting core price.",
  },
  {
    key: "shops-finds",
    title: "Shops & Local Finds",
    subtitle: "Bundles and add-ons that increase basket size.",
    blocks: [
      {
        heading: "Discounts",
        items: ["10–15% off selected items", "Pass-only bundles"],
      },
      {
        heading: "Offers",
        items: [
          "Free gift with purchase",
          "Free personalization / wrapping",
          "Complimentary local product sample",
        ],
      },
      {
        heading: "Services / Privileges",
        items: [
          "Early access to new stock",
          "Staff recommendations",
          "Reserved items for 24 hours",
        ],
      },
      {
        heading: "Promotions",
        items: ["Pass Picks shelf", "Limited-edition pass items"],
      },
    ],
    why: "Moves inventory, increases basket size.",
  },
  {
    key: "night-social",
    title: "Night, Bars & Social",
    subtitle: "Time-box benefits to protect margins.",
    blocks: [
      {
        heading: "Discounts",
        items: [
          "10% off cocktails (early evening only)",
          "Happy-hour extensions for pass holders",
        ],
      },
      {
        heading: "Offers",
        items: [
          "Free welcome drink",
          "Complimentary bar snack",
          "Free drink on second visit",
        ],
      },
      {
        heading: "Services / Privileges",
        items: [
          "Priority entry",
          "Reserved seating where possible",
          "Faster service lane at bar (subtle but powerful)",
        ],
      },
      {
        heading: "Promotions",
        items: ["Pass-holder-only nights", "Guestlist access"],
      },
    ],
    why: "Creates demand at the right time, without broad discounting.",
  },
];
