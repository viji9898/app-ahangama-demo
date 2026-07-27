import "dotenv/config";
import pg from "pg";
import { createServer } from "vite";

const { Client } = pg;

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to seed the admin events table.");
  }

  return connectionString;
}

function slugify(value) {
  return String(value || "event")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "event";
}

function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isDatedDay(day) {
  return /^\d{4}-\d{2}-\d{2}$/.test(day.key);
}

function parseDisplayTime(value) {
  const normalized = String(value || "").trim();
  const match = normalized.match(/(\d{1,2})(?::|\.)(\d{2})\s*(AM|PM)/i);

  if (!match) {
    return "00:00:00";
  }

  let hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();

  if (meridiem === "PM" && hours < 12) {
    hours += 12;
  }

  if (meridiem === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}

function normalizeTextArray(value) {
  return Array.isArray(value)
    ? value.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
}

function normalizeImageUrls(event) {
  return [event.image, event.mobileImage, event.offerImage]
    .map((value) => String(value || "").trim())
    .filter(Boolean);
}

function normalizeCategory(event) {
  const text = [event.category, event.title, event.venue, event.description]
    .map((value) => String(value || "").toLowerCase())
    .join(" ");

  if (/yoga|pilates|breathwork|wellness|crossfit|fitness|shala|reformer|muay thai/.test(text)) {
    return "wellness";
  }

  if (/movie|film|art|drawing|painting|craft|weaving/.test(text)) {
    return "arts_culture";
  }

  if (/cooking|class|workshop|session|gathering|community/.test(text)) {
    return "workshops";
  }

  if (/happy hour|cocktail|wine|pasta|burger|beer|food|drink|cafe|café/.test(text)) {
    return "food_drink";
  }

  if (/dj|music|karaoke|party|sunset|night|mono|club/.test(text)) {
    return "music";
  }

  return "community";
}

function buildSeedRows(days) {
  const todayKey = getTodayKey();

  return days.flatMap((day) => {
    const datedDay = isDatedDay(day);

    return day.events.map((event, eventIndex) => {
      const startDate = datedDay ? day.key : event.expiryDate || todayKey;
      const title = String(event.title || event.venue || "Untitled event").trim();
      const venueName = String(event.venue || "Ahangama").trim();
      const sourceKey = `${day.key}-${String(eventIndex + 1).padStart(2, "0")}-${slugify(title)}-${slugify(venueName)}`;
      const imageUrls = normalizeImageUrls(event);

      return {
        id: sourceKey,
        sourceKey,
        title,
        description: event.description || null,
        category: normalizeCategory(event),
        subcategory: event.category || event.subcategory || null,
        venueId: event.venueId || slugify(venueName),
        venueName,
        startDate,
        endDate: event.expiryDate || null,
        startTime: parseDisplayTime(event.time),
        displayTime: event.time || "",
        recurring: day.key.startsWith("ongoing"),
        recurringType: day.key.startsWith("ongoing") ? "weekly" : null,
        dayOfWeek: day.weekday || null,
        imageUrl: event.image || null,
        mobileImageUrl: event.mobileImage || null,
        offerImageUrl: event.offerImage || null,
        offerText: event.offerText || null,
        tags: normalizeTextArray([event.category, day.key]),
        featured: Boolean(event.featured),
        editorialPick: Boolean(event.editorialPick),
        status: "published",
        source: "src/data/eventsCalendar.js",
        featuredThisWeek: datedDay && day.key >= todayKey,
        dayKey: day.key,
        weekday: day.weekday || null,
        dayNumber: day.dayNumber || null,
        month: day.month || null,
        details: normalizeTextArray(event.details),
        venueLinks: Array.isArray(event.venueLinks) ? event.venueLinks : [],
        passBenefit: event.passBenefit || null,
        eventOrder: eventIndex,
        directionsUrl: event.directionsUrl || null,
        instagramUrl: event.instagramUrl || null,
        imageUrls,
        rawEvent: event,
      };
    });
  });
}

async function loadStaticEvents() {
  const server = await createServer({
    appType: "custom",
    logLevel: "error",
    server: { middlewareMode: true },
  });

  try {
    const eventsModule = await server.ssrLoadModule("/src/data/eventsCalendar.js");
    return eventsModule.EVENTS_CALENDAR_DAYS;
  } finally {
    await server.close();
  }
}

async function seedEvents(rows) {
  const client = new Client({ connectionString: getConnectionString() });
  await client.connect();

  try {
    await client.query("BEGIN");

    for (const row of rows) {
      await client.query(
        `
          INSERT INTO events (
            id,
            title,
            description,
            category,
            subcategory,
            venue_id,
            venue_name,
            start_date,
            end_date,
            start_time,
            recurring,
            recurring_type,
            day_of_week,
            image_url,
            image_urls,
            tags,
            featured,
            editorial_pick,
            status,
            source,
            featured_this_week,
            day_key,
            weekday,
            day_number,
            month,
            display_time,
            mobile_image_url,
            offer_image_url,
            offer_text,
            details,
            venue_links,
            pass_benefit,
            event_order,
            directions_url,
            instagram_url,
            source_key,
            raw_event,
            updated_by,
            updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
            $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
            $31, $32, $33, $34, $35, $36, $37, 'seed-events-db', NOW()
          )
          ON CONFLICT (source_key) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            category = EXCLUDED.category,
            subcategory = EXCLUDED.subcategory,
            venue_id = EXCLUDED.venue_id,
            venue_name = EXCLUDED.venue_name,
            start_date = EXCLUDED.start_date,
            end_date = EXCLUDED.end_date,
            start_time = EXCLUDED.start_time,
            recurring = EXCLUDED.recurring,
            recurring_type = EXCLUDED.recurring_type,
            day_of_week = EXCLUDED.day_of_week,
            image_url = EXCLUDED.image_url,
            image_urls = EXCLUDED.image_urls,
            tags = EXCLUDED.tags,
            featured = EXCLUDED.featured,
            editorial_pick = EXCLUDED.editorial_pick,
            status = EXCLUDED.status,
            source = EXCLUDED.source,
            featured_this_week = EXCLUDED.featured_this_week,
            day_key = EXCLUDED.day_key,
            weekday = EXCLUDED.weekday,
            day_number = EXCLUDED.day_number,
            month = EXCLUDED.month,
            display_time = EXCLUDED.display_time,
            mobile_image_url = EXCLUDED.mobile_image_url,
            offer_image_url = EXCLUDED.offer_image_url,
            offer_text = EXCLUDED.offer_text,
            details = EXCLUDED.details,
            venue_links = EXCLUDED.venue_links,
            pass_benefit = EXCLUDED.pass_benefit,
            event_order = EXCLUDED.event_order,
            directions_url = EXCLUDED.directions_url,
            instagram_url = EXCLUDED.instagram_url,
            raw_event = EXCLUDED.raw_event,
            updated_by = EXCLUDED.updated_by,
            updated_at = NOW()
        `,
        [
          row.id,
          row.title,
          row.description,
          row.category,
          row.subcategory,
          row.venueId,
          row.venueName,
          row.startDate,
          row.endDate,
          row.startTime,
          row.recurring,
          row.recurringType,
          row.dayOfWeek,
          row.imageUrl,
          row.imageUrls,
          row.tags,
          row.featured,
          row.editorialPick,
          row.status,
          row.source,
          row.featuredThisWeek,
          row.dayKey,
          row.weekday,
          row.dayNumber,
          row.month,
          row.displayTime,
          row.mobileImageUrl,
          row.offerImageUrl,
          row.offerText,
          JSON.stringify(row.details),
          JSON.stringify(row.venueLinks),
          row.passBenefit ? JSON.stringify(row.passBenefit) : null,
          row.eventOrder,
          row.directionsUrl,
          row.instagramUrl,
          row.sourceKey,
          JSON.stringify(row.rawEvent),
        ],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

const days = await loadStaticEvents();
const rows = buildSeedRows(days);
await seedEvents(rows);

console.log(`Seeded ${rows.length} events into the admin events table.`);