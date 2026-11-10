/*
 * Shared hero images for editorial articles.
 *
 * The article page, the /articles index and the homepage "Weekly Picks"
 * cards all read the hero image from here, so changing it in one place
 * updates every surface.
 *
 * The rest of each article's photography lives in its page component.
 */

export const SPICE_TRAIL_HERO_IMAGE = {
  src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-hero-image-the-spice-trail-villa-pool-ahangama-36cd3204.webp",
  filename: "hero-image-the-spice-trail-villa-pool-ahangama.webp",
  alt: "The Spice Trail villa and swimming pool in Ahangama.",
};

export const THE_WELL_HERO_IMAGE = {
  src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-hero-image-the-well-ahangama-pool-garden-exterior-37879a24.webp",
  filename: "the-well-ahangama-pool-garden-exterior.webp",
  alt: "Wide view of The Well's swimming pool, garden seating and building surrounded by tropical greenery.",
};

/*
 * Ko Lake Villa's hero image is added by the editorial team. Until then the
 * card falls back to /ko-lake-villa/placeholder.svg and the article hero
 * renders a labelled placeholder.
 */
export const KO_LAKE_VILLA_HERO_IMAGE = {
  src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-hero-image-ko-lake-villa-between-trees-and-lake-b48fa3a1.webp",
  filename: "ko-lake-villa-between-trees-and-lake.webp",
  alt: "Ko Lake Villa, between the trees and the lake.",
};

/*
 * Abode Boutique Hotels' hero image is added by the editorial team. Until then
 * the card falls back to /abode-boutique-hotels/placeholder.svg and the
 * article hero renders a labelled placeholder.
 */
export const ABODE_HERO_IMAGE = {
  src: "",
  filename: "hero-image-abode-boutique-hotels-ahangama.webp",
  alt: "Abode Boutique Hotels in Ahangama on Sri Lanka's south coast.",
};

export function resolveHeroImage(slot) {
  return slot?.src || "";
}
