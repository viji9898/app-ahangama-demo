import { dedupeEntries } from "./utils.js";
import { getAllVenueImageEntries } from "./venues.js";

export async function generateImagesSitemap(context, sectionEntries = []) {
  const venueEntries = await getAllVenueImageEntries(context);
  const entriesWithImages = [...sectionEntries, ...venueEntries].filter(
    (entry) => entry.images?.length,
  );

  return dedupeEntries(entriesWithImages).map((entry) => ({
    ...entry,
    images: [...new Set(entry.images)],
  }));
}
