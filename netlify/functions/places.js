// Google Places API endpoint with geocoding and caching
const cache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

// Map frontend types to Google Places API types
const TYPE_MAPPING = {
  cafe: "cafe",
  restaurant: "restaurant",
  bar: "bar",
  hotel: "lodging",
  coworking: "establishment", // will use keyword "coworking"
  gym: "gym",
  spa: "spa",
};

// Helper to sleep for Google Places pagination
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Geocode location text to lat/lng
async function geocodeLocation(locationText) {
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    locationText
  )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  const response = await fetch(geocodeUrl);
  const data = await response.json();

  if (data.status !== "OK" || !data.results.length) {
    throw new Error(`Could not geocode location: ${locationText}`);
  }

  const location = data.results[0].geometry.location;
  return { lat: location.lat, lng: location.lng };
}

// Fetch places from Google Places API
async function fetchPlaces(lat, lng, radius, type, keyword = null) {
  const places = [];
  let nextPageToken = null;

  do {
    let placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    if (keyword) {
      placesUrl += `&keyword=${encodeURIComponent(keyword)}`;
    }

    if (nextPageToken) {
      placesUrl += `&pagetoken=${nextPageToken}`;
    }

    const response = await fetch(placesUrl);
    const data = await response.json();

    if (data.status === "INVALID_REQUEST" && nextPageToken) {
      // Wait 2 seconds and retry for pagination
      await sleep(2000);
      continue;
    }

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    if (data.results) {
      places.push(...data.results);
    }

    nextPageToken = data.next_page_token;

    // Add delay between pagination requests
    if (nextPageToken) {
      await sleep(2000);
    }
  } while (nextPageToken && places.length < 60); // Limit to 60 results max

  return places;
}

// Normalize place data
function normalizePlaces(places) {
  return places.map((place) => ({
    placeId: place.place_id,
    name: place.name,
    types: place.types || [],
    rating: place.rating || 0,
    reviews: place.user_ratings_total || 0,
    address: place.formatted_address || place.vicinity || "No address",
    lat: place.geometry?.location?.lat || 0,
    lng: place.geometry?.location?.lng || 0,
    mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
  }));
}

// Remove duplicates by place_id
function deduplicatePlaces(places) {
  const seen = new Set();
  return places.filter((place) => {
    if (seen.has(place.placeId)) {
      return false;
    }
    seen.add(place.placeId);
    return true;
  });
}

export const handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { location, type, radius = 2500 } = event.queryStringParameters || {};

    if (!location || !type) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Location and type are required" }),
      };
    }

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Google Maps API key not configured" }),
      };
    }

    // Create cache key
    const cacheKey = `${type}-${location}-${radius}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          places: cached.data,
          cached: true,
        }),
      };
    }

    // Geocode location
    const coords = await geocodeLocation(location);

    // Map frontend type to Google type
    const googleType = TYPE_MAPPING[type] || type;
    const keyword = type === "coworking" ? "coworking" : null;

    // Fetch places
    const rawPlaces = await fetchPlaces(
      coords.lat,
      coords.lng,
      parseInt(radius),
      googleType,
      keyword
    );

    // Normalize and deduplicate
    let places = normalizePlaces(rawPlaces);
    places = deduplicatePlaces(places);

    // Cache results
    cache.set(cacheKey, {
      data: places,
      timestamp: Date.now(),
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        places: places,
        location: coords,
        cached: false,
      }),
    };
  } catch (error) {
    console.error("Places API error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || "Failed to fetch places data",
      }),
    };
  }
};
