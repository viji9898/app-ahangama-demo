import { createSitemapEntry, extractImageUrls, tryQueryRows } from "./utils.js";

async function loadDatabaseEvents() {
  const rows = await tryQueryRows(`
    SELECT
      slug,
      updated_at,
      start_datetime,
      created_at,
      image_url,
      TO_JSONB(events.*) AS raw
    FROM events
    WHERE slug IS NOT NULL
      AND editorial_status <> 'hidden'
      AND status = 'published'
    ORDER BY start_datetime DESC NULLS LAST, updated_at DESC NULLS LAST, slug ASC
  `);

  return rows || [];
}

export async function generateEventsSitemap({ siteUrl }) {
  return (await loadDatabaseEvents()).map((event) =>
    createSitemapEntry({
      pathname: `/events/${event.slug}`,
      siteUrl,
      lastmod: event.updated_at || event.start_datetime || event.created_at,
      images: extractImageUrls(event.raw || event, siteUrl),
    }),
  );
}
