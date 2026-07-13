import { getVenueSectionEntries } from "./venues.js";

export async function generateEatSitemap(context) {
  return getVenueSectionEntries("eat", context);
}
