#!/usr/bin/env node

/**
 * updateGoogleRatings.js
 *
 * Fetches real Google ratings and review counts for venues using the
 * Google Places API (New) — Text Search endpoint.
 *
 * Usage:
 *   node scripts/updateGoogleRatings.js
 *
 * Requires GOOGLE_PLACES_API_KEY in .env file at project root.
 * The API key is NEVER exposed to client-side code.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ENV_PATH = resolve(ROOT, ".env");
const JSX_PATH = resolve(ROOT, "src/pages/ExperienceAhangamaGuide.jsx");
const MATCHES_PATH = resolve(ROOT, "scripts/.place-matches.json");

// ── Load API key ──────────────────────────────────────────────────────────────
config({ path: ENV_PATH });

// Fallback: also check .env.example if .env doesn't have the key
if (!process.env.GOOGLE_PLACES_API_KEY) {
  config({ path: resolve(ROOT, ".env.example") });
}

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  console.error("ERROR: GOOGLE_PLACES_API_KEY not found in .env file.");
  console.error("Add it to the project root .env file:");
  console.error("  GOOGLE_PLACES_API_KEY=your_key_here");
  process.exit(1);
}

const API_BASE = "https://places.googleapis.com/v1/places:searchText";
const DETAIL_BASE = "https://places.googleapis.com/v1/places";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Sleep for ms milliseconds */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Load previously matched place IDs */
function loadMatches() {
  if (existsSync(MATCHES_PATH)) {
    try {
      return JSON.parse(readFileSync(MATCHES_PATH, "utf8"));
    } catch {
      return {};
    }
  }
  return {};
}

/** Save matched place IDs for future direct lookups */
function saveMatches(matches) {
  writeFileSync(MATCHES_PATH, JSON.stringify(matches, null, 2) + "\n");
}

/** Extract venue data arrays from the JSX file */
function extractVenuesFromJSX(source) {
  const arrayNames = [
    "BEST_STAYS",
    "EATS",
    "EXPERIENCES",
    "WELLNESS",
    "NIGHT_LIFE",
    "BEST_RETAIL_STORES",
    "BEST_CAFES",
    "TRANSPORT_VENUES",
  ];

  const venues = [];

  for (const name of arrayNames) {
    // Match the array: const NAME = [ ... ];
    const regex = new RegExp(
      `const\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\];`,
      "m"
    );
    const match = source.match(regex);
    if (!match) {
      console.warn(`  WARNING: Could not find array ${name} in JSX file.`);
      continue;
    }

    const arrayBody = match[1];

    // Match each venue object: { name: "...", ... }
    const venueRegex = /\{\s*name:\s*"([^"]+)"[^}]*\}/g;
    let venueMatch;

    while ((venueMatch = venueRegex.exec(arrayBody)) !== null) {
      const fullMatch = venueMatch[0];
      const venueName = venueMatch[1];

      // Extract lat/lng if present
      const latMatch = fullMatch.match(/lat:\s*([\d.]+)/);
      const lngMatch = fullMatch.match(/lng:\s*([\d.]+)/);

      // Extract existing rating
      const ratingMatch = fullMatch.match(/rating:\s*"([\d.]+)"/);
      const existingRating = ratingMatch ? ratingMatch[1] : null;

      venues.push({
        arrayName: name,
        name: venueName,
        lat: latMatch ? parseFloat(latMatch[1]) : null,
        lng: lngMatch ? parseFloat(lngMatch[1]) : null,
        existingRating,
        rawMatch: fullMatch,
      });
    }
  }

  return venues;
}

/** Search for a venue using Google Places API (New) — Text Search */
async function searchVenue(venue) {
  const query = venue.lat
    ? `${venue.name}, Ahangama, Sri Lanka`
    : `${venue.name}, Ahangama, Sri Lanka`;

  const body = {
    textQuery: query,
    languageCode: "en",
  };

  // Add location bias if coordinates available
  if (venue.lat && venue.lng) {
    body.locationBias = {
      circle: {
        center: {
          latitude: venue.lat,
          longitude: venue.lng,
        },
        radius: 5000.0, // 5km radius
      },
    };
  }

  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "places.id,places.displayName,places.rating,places.userRatingCount,places.location",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.places || [];
}

/** Fetch details for a known place ID */
async function getPlaceDetails(placeId) {
  const res = await fetch(`${DETAIL_BASE}/${placeId}`, {
    method: "GET",
    headers: {
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "id,displayName,rating,userRatingCount",
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Details API ${res.status}: ${errText}`);
  }

  return await res.json();
}

/** Validate that a search result matches the venue we're looking for */
function validateResult(venue, place) {
  if (!place) return false;

  const placeName = (place.displayName?.text || "").toLowerCase();
  const venueName = venue.name.toLowerCase();

  // Check if the place name contains the venue name or vice versa
  // (handles slight name variations like "Cafe" vs "Café")
  const normalizedPlace = placeName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const normalizedVenue = venueName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (normalizedPlace.includes(normalizedVenue) || normalizedVenue.includes(normalizedPlace)) {
    return true;
  }

  // Check if first significant word matches (at least 4 chars)
  const venueWords = normalizedVenue.split(/\s+/).filter((w) => w.length >= 4);
  const placeWords = normalizedPlace.split(/\s+/).filter((w) => w.length >= 4);

  if (venueWords.length > 0 && placeWords.length > 0) {
    if (venueWords[0] === placeWords[0]) return true;
  }

  // If we have coordinates, check distance
  if (venue.lat && venue.lng && place.location) {
    const dist = haversineDistance(
      venue.lat,
      venue.lng,
      place.location.latitude,
      place.location.longitude
    );
    if (dist < 2) return true; // Within 2km
  }

  return false;
}

/** Haversine distance in km between two lat/lng points */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Google Places API — Update Venue Ratings");
  console.log("═══════════════════════════════════════════════════════════\n");

  // Read JSX source
  const source = readFileSync(JSX_PATH, "utf8");
  const venues = extractVenuesFromJSX(source);

  console.log(`Found ${venues.length} venues across all arrays.\n`);

  // Load previously matched place IDs
  const matches = loadMatches();

  let updated = 0;
  let skipped = 0;
  let failed = 0;
  const failedVenues = [];

  for (let i = 0; i < venues.length; i++) {
    const venue = venues[i];
    const progress = `[${i + 1}/${venues.length}]`;

    // If we have a saved place ID, use direct lookup (cheaper + more accurate)
    if (matches[venue.name]?.placeId) {
      try {
        const details = await getPlaceDetails(matches[venue.name].placeId);
        if (details.rating != null) {
          console.log(
            `${progress} ✓ ${venue.name} → ${details.rating} (${details.userRatingCount || 0} reviews) [cached Place ID]`
          );
          venues[i].newRating = String(details.rating);
          venues[i].newReviewCount = details.userRatingCount || 0;
          venues[i].placeId = details.id;
          updated++;
          await sleep(100);
          continue;
        }
      } catch (err) {
        console.log(
          `${progress} ⚠ ${venue.name} — cached Place ID failed, trying text search...`
        );
      }
    }

    // Text search
    try {
      const places = await searchVenue(venue);

      if (places.length === 0) {
        console.log(`${progress} ✗ ${venue.name} — no results found`);
        failed++;
        failedVenues.push(venue.name);
        await sleep(100);
        continue;
      }

      // Find best matching result
      let bestMatch = null;
      for (const place of places) {
        if (validateResult(venue, place)) {
          bestMatch = place;
          break;
        }
      }

      // Fallback: if no validated match, use first result if it has a rating
      if (!bestMatch && places[0]?.rating != null) {
        console.log(
          `${progress} ? ${venue.name} — using first result: "${places[0].displayName?.text}" (no exact match)`
        );
        bestMatch = places[0];
      }

      if (!bestMatch || bestMatch.rating == null) {
        console.log(
          `${progress} ✗ ${venue.name} — no valid match with rating found`
        );
        failed++;
        failedVenues.push(venue.name);
        await sleep(100);
        continue;
      }

      // Save match for future runs
      matches[venue.name] = {
        placeId: bestMatch.id,
        displayName: bestMatch.displayName?.text,
        rating: bestMatch.rating,
        userRatingCount: bestMatch.userRatingCount || 0,
      };

      console.log(
        `${progress} ✓ ${venue.name} → ${bestMatch.rating} (${bestMatch.userRatingCount || 0} reviews) [${bestMatch.displayName?.text}]`
      );

      venues[i].newRating = String(bestMatch.rating);
      venues[i].newReviewCount = bestMatch.userRatingCount || 0;
      venues[i].placeId = bestMatch.id;
      updated++;

      await sleep(100); // Rate limit: ~10 req/sec
    } catch (err) {
      console.error(`${progress} ✗ ${venue.name} — ERROR: ${err.message}`);
      failed++;
      failedVenues.push(venue.name);
      await sleep(200);
    }
  }

  // Save place matches
  saveMatches(matches);

  // Update the JSX file
  if (updated > 0) {
    let newSource = source;

    for (const venue of venues) {
      if (!venue.newRating) continue;

      // Add reviewCount field to the venue's raw match
      // Insert it before the closing } of the venue object
      const oldRaw = venue.rawMatch;

      // Check if reviewCount already exists
      if (oldRaw.includes("reviewCount:")) {
        // Replace existing reviewCount
        const newRaw = oldRaw.replace(
          /reviewCount:\s*\d+/,
          `reviewCount: ${venue.newReviewCount}`
        );
        // Also update rating
        const withRating = newRaw.replace(
          /rating:\s*"[\d.]+"/,
          `rating: "${venue.newRating}"`
        );
        newSource = newSource.replace(oldRaw, withRating);
      } else {
        // Add reviewCount before closing }
        const newRaw = oldRaw.replace(
          /\}(\s*,?\s*)$/,
          `, reviewCount: ${venue.newReviewCount} }$1`
        );
        // Also update rating
        const withRating = newRaw.replace(
          /rating:\s*"[\d.]+"/,
          `rating: "${venue.newRating}"`
        );
        newSource = newSource.replace(oldRaw, withRating);
      }
    }

    writeFileSync(JSX_PATH, newSource);
  }

  // Summary
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("  SUMMARY");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`  Total venues:    ${venues.length}`);
  console.log(`  Updated:         ${updated}`);
  console.log(`  No results:      ${failed}`);
  console.log(`  Skipped (error): ${skipped}`);
  console.log(`  Place IDs saved: ${Object.keys(matches).length}`);

  if (failedVenues.length > 0) {
    console.log("\n  Venues that need manual review:");
    failedVenues.forEach((name) => console.log(`    - ${name}`));
  }

  console.log("\n  Place matches saved to: scripts/.place-matches.json");
  console.log("  Next run will use cached Place IDs for faster + cheaper updates.");
  console.log("═══════════════════════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
