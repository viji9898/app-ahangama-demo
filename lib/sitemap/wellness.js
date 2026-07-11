import { getVenueSectionEntries } from "./venues.js";

export async function generateWellnessSitemap(context) {
  return getVenueSectionEntries("wellness", context);
}
