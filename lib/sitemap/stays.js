import { getVenueSectionEntries } from "./venues.js";

export async function generateStaysSitemap(context) {
  return getVenueSectionEntries("stays", context);
}
