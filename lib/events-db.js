import process from "node:process";
import pg from "pg";

const { Pool } = pg;
const EVENTS_TABLE = "events";

let pool;

function getConnectionString() {
  return process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL || "";
}

function getPool() {
  if (!pool) {
    const connectionString = getConnectionString();

    if (!connectionString) {
      throw new Error("Missing database connection. Expected DATABASE_URL.");
    }

    pool = new Pool({ connectionString });
  }

  return pool;
}

function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDatePart(value, options) {
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", options).format(date);
}

function formatDayLabel(day) {
  if (String(day.key || "").startsWith("ongoing")) {
    return "Ongoing";
  }

  return `${String(day.weekday || "").slice(0, 3)} ${day.dayNumber} ${String(day.month || "").slice(0, 3)} 2026`;
}

function normalizeJsonArray(value) {
  return Array.isArray(value) ? value : [];
}

function mapEventRow(row) {
  const dayKey = row.day_key || String(row.start_date).slice(0, 10);

  return {
    id: row.source_key || row.id,
    title: row.title,
    venue: row.venue_name,
    time: row.display_time || row.start_time || "",
    category: row.subcategory || row.category,
    image: row.image_url || "",
    mobileImage: row.mobile_image_url || "",
    offerImage: row.offer_image_url || "",
    offerText: row.offer_text || "",
    description: row.description || "",
    expiryDate: row.end_date ? String(row.end_date).slice(0, 10) : "",
    venueLinks: normalizeJsonArray(row.venue_links),
    details: normalizeJsonArray(row.details),
    passBenefit: row.pass_benefit || null,
    instagramUrl: row.instagram_url || "",
    directionsUrl: row.directions_url || row.venue_google_url || "",
    dayKey,
    date: "",
  };
}

function mapDayRow(row) {
  const key = row.day_key || String(row.start_date).slice(0, 10);
  const weekday = row.weekday || formatDatePart(key, { weekday: "long" });
  const dayNumber = row.day_number || formatDatePart(key, { day: "numeric" });
  const month = row.month || formatDatePart(key, { month: "long" });

  return { key, weekday, dayNumber, month, events: [] };
}

function buildEditorPicks(days) {
  return days
    .flatMap((day) =>
      day.events.map((event) => {
        const eventDate = day.key.startsWith("ongoing")
          ? "Ongoing"
          : formatDayLabel(day);

        return `${event.title} at ${event.venue} — ${eventDate}.`;
      }),
    )
    .slice(0, 4);
}

export async function listEventCalendarDays({ date = new Date() } = {}) {
  const todayKey = getTodayKey(date);
  const result = await getPool().query(
    `
      SELECT *
      FROM ${EVENTS_TABLE}
      WHERE deleted_at IS NULL
        AND status = 'published'
        AND day_key IS NOT NULL
        AND (
          (day_key ~ '^\\d{4}-\\d{2}-\\d{2}$' AND day_key >= $1)
          OR (
            day_key LIKE 'ongoing%'
            AND (end_date IS NULL OR end_date >= $1::date)
          )
        )
      ORDER BY
        CASE WHEN day_key ~ '^\\d{4}-\\d{2}-\\d{2}$' THEN 0 ELSE 1 END,
        day_key ASC,
        event_order ASC,
        start_time ASC,
        title ASC
    `,
    [todayKey],
  );

  const daysByKey = new Map();

  for (const row of result.rows) {
    const key = row.day_key || String(row.start_date).slice(0, 10);

    if (!daysByKey.has(key)) {
      daysByKey.set(key, mapDayRow(row));
    }

    const event = mapEventRow(row);
    event.date = formatDayLabel(daysByKey.get(key));
    daysByKey.get(key).events.push(event);
  }

  return [...daysByKey.values()].filter((day) => day.events.length > 0);
}

export async function getEventsCalendarPayload() {
  const days = await listEventCalendarDays();

  return {
    days,
    editorPicks: buildEditorPicks(days),
  };
}