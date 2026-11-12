/**
 * guideQrRedirectsNew.js
 *
 * Redirect mapping for the 38 NEW Physical Ahangama Guide QR codes (2026/27).
 * Kept separate from `guideQrRedirects.js` so the original seven QR codes and
 * their analytics configuration remain completely untouched.
 *
 * HOW TO CHANGE A DESTINATION
 * ----------------------------
 * 1. Set `destination` to the live page path (or absolute URL).
 * 2. Leave `slug`, `section` and `codeId` unchanged — they are printed into the
 *    QR codes and feed GA4 tracking.
 *
 * Most entries still use the safe fallback `destination: "/guide"` (the existing
 * online guide) so no QR code can 404. The intended page for each entry is
 * recorded in `plannedDestination` (`/guide/{slug}`) and can be promoted once
 * that page exists. Day 1 and Day 2 already point at their live pages.
 *
 * Day 1 is a special case: the artwork now encodes `/go/day-01`, while the
 * legacy `/go/first-24-hours` alias is kept working for any earlier printed
 * copies. Both resolve to the same entry and GA4 identity.
 */

/**
 * Safe fallback used by every new QR code until its dedicated page is live.
 * `/guide` is an existing, working route.
 */
export const QR_FALLBACK_DESTINATION = "/guide";

/**
 * @typedef {Object} GuideQrRedirect
 * @property {string} slug                URL segment after /go/ (permanent)
 * @property {string[]} [legacySlugs]     older /go/ aliases that must keep working
 * @property {string} [encodedSlug]       slug actually encoded in the printed QR,
 *                                        when it differs from the canonical slug
 * @property {string} section             unique qr_section value for GA4
 * @property {string} codeId              unique qr_code_id value for GA4
 * @property {string} label               human-readable page title
 * @property {string} group               guide section grouping
 * @property {string} file                base filename for SVG/PNG output
 * @property {string} destination         live redirect target
 * @property {string} plannedDestination  intended page once published
 */

/** @type {GuideQrRedirect[]} */
export const GUIDE_QR_REDIRECTS_NEW = [
  // ── First 24 Hours ────────────────────────────────────────────────────────
  { slug: "day-01", legacySlugs: ["first-24-hours"], section: "first_24_hours", codeId: "qr_first_24_hours", label: "Your First 24 Hours in Ahangama (Day 1)", group: "First 24 Hours", file: "QR-Your-First-24-Hours-In-Ahangama", destination: "/guide/day-01", plannedDestination: "/guide/day-01" },
  { slug: "day-02", section: "day_02", codeId: "qr_day_02", label: "Day 02", group: "First 24 Hours", file: "QR-Day-02", destination: "/guide/day-02", plannedDestination: "/guide/day-02" },

  // ── Food & Dining ─────────────────────────────────────────────────────────
  { slug: "rise-and-dine", section: "rise_and_dine", codeId: "qr_rise_and_dine", label: "Rise & Dine", group: "Food & Dining", file: "QR-Rise-And-Dine", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/rise-and-dine" },
  { slug: "brew-with-a-view", section: "brew_with_a_view", codeId: "qr_brew_with_a_view", label: "Brew with a View", group: "Food & Dining", file: "QR-Brew-With-A-View", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/brew-with-a-view" },
  { slug: "taste-of-sri-lanka", section: "taste_of_sri_lanka", codeId: "qr_taste_of_sri_lanka", label: "Taste of Sri Lanka", group: "Food & Dining", file: "QR-Taste-Of-Sri-Lanka", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/taste-of-sri-lanka" },
  { slug: "midday-plates", section: "midday_plates", codeId: "qr_midday_plates", label: "Midday Plates", group: "Food & Dining", file: "QR-Midday-Plates", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/midday-plates" },
  { slug: "sunset-eats-drinks", section: "sunset_eats_drinks", codeId: "qr_sunset_eats_drinks", label: "Sunset Eats & Drinks", group: "Food & Dining", file: "QR-Sunset-Eats-And-Drinks", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/sunset-eats-drinks" },
  { slug: "after-dark", section: "after_dark", codeId: "qr_after_dark", label: "After Dark", group: "Food & Dining", file: "QR-After-Dark", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/after-dark" },
  { slug: "green-plates", section: "green_plates", codeId: "qr_green_plates", label: "Green Plates", group: "Food & Dining", file: "QR-Green-Plates", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/green-plates" },
  { slug: "little-feet-big-adventures", section: "little_feet_big_adventures", codeId: "qr_little_feet_big_adventures", label: "Little Feet, Big Adventures", group: "Food & Dining", file: "QR-Little-Feet-Big-Adventures", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/little-feet-big-adventures" },

  // ── Hotels & Accommodation ────────────────────────────────────────────────
  { slug: "hotels-to-explore", section: "hotels_to_explore", codeId: "qr_hotels_to_explore", label: "Hotels to Explore", group: "Hotels & Accommodation", file: "QR-Hotels-To-Explore", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/hotels-to-explore" },
  { slug: "boutique-hotels", section: "boutique_hotels", codeId: "qr_boutique_hotels", label: "Boutique Hotels", group: "Hotels & Accommodation", file: "QR-Boutique-Hotels", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/boutique-hotels" },
  { slug: "villas-we-love", section: "villas_we_love", codeId: "qr_villas_we_love", label: "Villas we love", group: "Hotels & Accommodation", file: "QR-Villas-We-Love", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/villas-we-love" },
  { slug: "wellness-retreat-stays", section: "wellness_retreat_stays", codeId: "qr_wellness_retreat_stays", label: "Wellness & Retreat Stays", group: "Hotels & Accommodation", file: "QR-Wellness-And-Retreat-Stays", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/wellness-retreat-stays" },
  { slug: "hostels", section: "hostels", codeId: "qr_hostels", label: "Hostels", group: "Hotels & Accommodation", file: "QR-Hostels", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/hostels" },

  // ── Wellness ──────────────────────────────────────────────────────────────
  { slug: "pilates", section: "pilates", codeId: "qr_pilates", label: "Pilates", group: "Wellness", file: "QR-Pilates", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/pilates" },
  { slug: "meditation-mindfulness", section: "meditation_mindfulness", codeId: "qr_meditation_mindfulness", label: "Meditation & Mindfulness", group: "Wellness", file: "QR-Meditation-And-Mindfulness", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/meditation-mindfulness" },
  { slug: "fitness-gyms", section: "fitness_gyms", codeId: "qr_fitness_gyms", label: "Fitness & Gyms", group: "Wellness", file: "QR-Fitness-And-Gyms", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/fitness-gyms" },
  { slug: "spa-traditional-healing", section: "spa_traditional_healing", codeId: "qr_spa_traditional_healing", label: "Spa & Traditional Healing", group: "Wellness", file: "QR-Spa-And-Traditional-Healing", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/spa-traditional-healing" },
  { slug: "recovery-therapy", section: "recovery_therapy", codeId: "qr_recovery_therapy", label: "Recovery Therapy", group: "Wellness", file: "QR-Recovery-Therapy", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/recovery-therapy" },

  // ── Surf ──────────────────────────────────────────────────────────────────
  { slug: "surf-and-stay", section: "surf_and_stay", codeId: "qr_surf_and_stay", label: "Surf & Stay", group: "Surf", file: "QR-Surf-And-Stay", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/surf-and-stay" },
  { slug: "chase-the-swell", section: "chase_the_swell", codeId: "qr_chase_the_swell", label: "Chase the Swell", group: "Surf", file: "QR-Chase-The-Swell", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/chase-the-swell" },
  { slug: "borrow-a-board", section: "borrow_a_board", codeId: "qr_borrow_a_board", label: "Borrow A Board", group: "Surf", file: "QR-Borrow-A-Board", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/borrow-a-board" },

  // ── Experiences & Local Life ──────────────────────────────────────────────
  { slug: "10-things-to-do", section: "10_things_to_do", codeId: "qr_10_things_to_do", label: "10 Things You Should do in Ahangama", group: "Experiences & Local Life", file: "QR-10-Things-You-Should-Do-In-Ahangama", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/10-things-to-do" },
  { slug: "beyond-the-beach", section: "beyond_the_beach", codeId: "qr_beyond_the_beach", label: "Beyond the Beach", group: "Experiences & Local Life", file: "QR-Beyond-The-Beach", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/beyond-the-beach" },
  { slug: "everyday-ahangama", section: "everyday_ahangama", codeId: "qr_everyday_ahangama", label: "Everyday Ahangama", group: "Experiences & Local Life", file: "QR-Everyday-Ahangama", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/everyday-ahangama" },
  { slug: "a-little-piece-of-ahangama", section: "a_little_piece_of_ahangama", codeId: "qr_a_little_piece_of_ahangama", label: "A Little Piece of Ahangama", group: "Experiences & Local Life", file: "QR-A-Little-Piece-Of-Ahangama", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/a-little-piece-of-ahangama" },
  { slug: "sorted-in-ahangama", section: "sorted_in_ahangama", codeId: "qr_sorted_in_ahangama", label: "Sorted in Ahangama", group: "Experiences & Local Life", file: "QR-Sorted-In-Ahangama", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/sorted-in-ahangama" },
  { slug: "nightlife", section: "nightlife", codeId: "qr_nightlife", label: "Nightlife in Ahangama", group: "Experiences & Local Life", file: "QR-Nightlife-In-Ahangama", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/nightlife" },
  { slug: "local-tour-guides", section: "local_tour_guides", codeId: "qr_local_tour_guides", label: "Local Tour Guides", group: "Experiences & Local Life", file: "QR-Local-Tour-Guides", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/local-tour-guides" },
  { slug: "need-a-ride", section: "need_a_ride", codeId: "qr_need_a_ride", label: "Need A Ride?", group: "Experiences & Local Life", file: "QR-Need-A-Ride", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/need-a-ride" },

  // ── Nature & Ocean ────────────────────────────────────────────────────────
  { slug: "wild-meets-the-waves", section: "wild_meets_the_waves", codeId: "qr_wild_meets_the_waves", label: "Where the Wild Meets the Waves", group: "Nature & Ocean", file: "QR-Where-The-Wild-Meets-The-Waves", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/wild-meets-the-waves" },
  { slug: "whales-waves-open-ocean", section: "whales_waves_open_ocean", codeId: "qr_whales_waves_open_ocean", label: "Whales, Waves & The Open Ocean", group: "Nature & Ocean", file: "QR-Whales-Waves-And-The-Open-Ocean", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/whales-waves-open-ocean" },
  { slug: "head-out-to-the-sea", section: "head_out_to_the_sea", codeId: "qr_head_out_to_the_sea", label: "Where to Head Out to the Sea", group: "Nature & Ocean", file: "QR-Where-To-Head-Out-To-The-Sea", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/head-out-to-the-sea" },

  // ── Travel Beyond Ahangama ────────────────────────────────────────────────
  { slug: "hill-country-adventure", section: "hill_country_adventure", codeId: "qr_hill_country_adventure", label: "Build Your Hill-Country Adventure", group: "Travel Beyond Ahangama", file: "QR-Build-Your-Hill-Country-Adventure", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/hill-country-adventure" },
  { slug: "continue-your-sri-lankan-story", section: "continue_your_sri_lankan_story", codeId: "qr_continue_your_sri_lankan_story", label: "Five Ways To Continue Your Sri Lankan Story", group: "Travel Beyond Ahangama", file: "QR-Five-Ways-To-Continue-Your-Sri-Lankan-Story", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/continue-your-sri-lankan-story" },

  // ── Directory ─────────────────────────────────────────────────────────────
  { slug: "ahangama-directory", section: "ahangama_directory", codeId: "qr_ahangama_directory", label: "Ahangama Directory", group: "Directory", file: "QR-Ahangama-Directory", destination: QR_FALLBACK_DESTINATION, plannedDestination: "/guide/ahangama-directory" },

  // ── Main Guide Page ───────────────────────────────────────────────────────
  { slug: "main-page", section: "main_page", codeId: "qr_main_page", label: "Ahangama Guide – Main Page", group: "Ahangama Guide", file: "QR-Ahangama-Guide-Main-Page", destination: "/guide", plannedDestination: "/guide" },
];

/**
 * Returns the redirect config for a NEW /go/ slug, or null if not found.
 * Matches both the canonical slug and any legacy aliases.
 * @param {string} slug
 */
export function getNewQrRedirect(slug) {
  return (
    GUIDE_QR_REDIRECTS_NEW.find(
      (r) => r.slug === slug || r.legacySlugs?.includes(slug),
    ) ?? null
  );
}
