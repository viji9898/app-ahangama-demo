/*
 * Venue Performance Statistics — canonical venue registry.
 *
 * This file is imported by both the browser bundle and the Netlify
 * functions, so it must stay free of Node-only imports.
 *
 * `key` is the public statistics URL segment: /stats/<key>
 * `venueId` is the canonical `venues260414.id` used by GA4 events and
 * the guide database. Keeping both explicit lets the requested short
 * URLs differ from the database identifiers.
 */

export const VENUE_STATS = [
  {
    key: "abode-by-the-beach",
    venueId: "abode-by-the-beach",
    name: "Abode by the Beach",
    shortName: "Abode by the Beach",
    section: "best_stays",
    sectionLabel: "Best Stays",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/abode-by-the-beach-beachfront-villa-and-outdoor-dining-area-at-abode-ahangama-at-sunset-d2a43496.webp",
    instagram: "https://www.instagram.com/abode.bythebeach/?hl=en",
    googleMaps: "https://maps.app.goo.gl/zBaLF7oDPAXZosbV9",
    website: "https://www.abodeboutiquehotels.com/abode-by-the-beach.php",
    articlePaths: [],
  },
  {
    key: "abode-ahangama",
    venueId: "abode-ahangama",
    name: "Abode Ahangama",
    shortName: "Abode Ahangama",
    section: "best_stays",
    sectionLabel: "Best Stays",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/abode-ahangama-exterior-of-a-white-tropical-villa-with-a-terracotta-roof-and-green-lawn-37575f64.webp",
    instagram: "https://www.instagram.com/abode.ahangama/?hl=en",
    googleMaps: "https://maps.app.goo.gl/VHJDoB16JXKNjMB77",
    website: "https://www.abodeboutiquehotels.com/abode-ahangama.php",
    articlePaths: [],
  },
  {
    key: "spa-therapy-ahangama",
    venueId: "spa-therapy-spice-trail",
    name: "Spa Therapy Ahangama",
    shortName: "Spa Therapy",
    section: "wellness",
    sectionLabel: "Wellness",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/spa-therapy-spice-trail-massage-therapist-performing-a-leg-massage-treatment-at-spice-trail-39b95a6b.webp",
    instagram: "https://www.instagram.com/thespicetrail.ahangama/",
    googleMaps: "https://maps.app.goo.gl/UrMF4sBceLKThuHz5",
    website: "https://www.thespicetrails.com/spa-therapy",
    articlePaths: ["/the-spice-trail-your-south-coast-boutique-base"],
  },
  {
    key: "the-spice-trail",
    venueId: "the-spice-trail",
    name: "The Spice Trail Boutique Hotel & Spa",
    shortName: "The Spice Trail",
    section: "best_stays",
    sectionLabel: "Best Stays",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/the-spice-trail-villa-with-red-tiled-roof-reflecting-in-a-swimming-pool-at-spice-trail-3300fdd7.webp",
    instagram: "https://www.instagram.com/thespicetrail.ahangama/?hl=en",
    googleMaps: "https://maps.app.goo.gl/uAsMgoJGDSYFfiGS9",
    website: "https://www.thespicetrails.com/",
    articlePaths: ["/the-spice-trail-your-south-coast-boutique-base"],
  },
  {
    key: "little-bang-kitchen",
    venueId: "little-bang-kitchen-ahangama",
    name: "Little Bang Kitchen",
    shortName: "Little Bang Kitchen",
    section: "best_eats",
    sectionLabel: "Best Eats",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/the-spice-trail-friends-toasting-with-wine-glasses-around-a-dining-table-at-little-bang-92b5bc93.webp",
    instagram: "https://www.instagram.com/lbk.ahangama/",
    googleMaps: "https://maps.app.goo.gl/KHoUt6WKzRGYC4av6",
    website: "https://www.thespicetrails.com/little-bang-kitchen",
    articlePaths: ["/the-spice-trail-your-south-coast-boutique-base"],
  },
  {
    key: "nirbana-paddle-boarding",
    venueId: "nirbana-retreat",
    name: "Nirbana Retreat – Paddle Boarding",
    shortName: "Nirbana Retreat",
    section: "best_experiences",
    sectionLabel: "Experiences",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/nirbana-retreat-lake-view-8-people-paddle-boarding-3d5fafe5.webp",
    instagram: "https://instagram.com/nirbanaretreat",
    googleMaps: "https://maps.app.goo.gl/Fw5R6fHKHTF2TNG18",
    website: "https://www.nirbanaretreat.com/",
    articlePaths: [],
  },
  {
    key: "salon-change",
    venueId: "salon-change",
    name: "Salon Change",
    shortName: "Salon Change",
    section: "wellness",
    sectionLabel: "Wellness",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/salon-change-barber-styling-a-client-s-hair-in-a-barbershop-0cd0b28f.webp",
    instagram: "https://instagram.com/salon_change",
    googleMaps: "https://maps.app.goo.gl/yCHiBamG3TPDFGA58",
    website: "",
    articlePaths: [],
  },
  {
    key: "namikaze",
    venueId: "namikaze-restaurant-bar",
    name: "Namikaze Restaurant & Bar",
    shortName: "Namikaze",
    section: "best_eats",
    sectionLabel: "Best Eats",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/namikaze-restaurant-bar-massage-therapist-performing-a-leg-massage-treatment-at-spice-trail-cdc2cb89.webp",
    instagram: "https://instagram.com/namikazerestaurant",
    googleMaps: "https://maps.app.goo.gl/A4J4h9niYo6RGeZo6",
    website:
      "https://www.radissonhotels.com/en-us/hotels/radisson-collection-resort-galle/restaurants-and-bars/namikaze",
    articlePaths: [],
  },
];

export const VENUE_STATS_BY_KEY = Object.fromEntries(
  VENUE_STATS.map((venue) => [venue.key, venue]),
);

export function getVenueStats(key) {
  if (!key) return null;
  return VENUE_STATS_BY_KEY[String(key).trim().toLowerCase()] || null;
}

export const LINK_TYPES = [
  { key: "instagram", label: "Instagram" },
  { key: "google_maps", label: "Google Maps" },
  { key: "website", label: "Website" },
];
