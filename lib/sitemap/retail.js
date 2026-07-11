import { getVenueSectionEntries } from "./venues.js";

export async function generateRetailSitemap(context) {
  return getVenueSectionEntries("retail", context);
}
