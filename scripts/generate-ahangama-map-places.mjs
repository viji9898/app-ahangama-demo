import { writeFile } from "node:fs/promises";
import { config } from "dotenv";

config({ path: ".env", quiet: true });

const apiKey = process.env.GOOGLE_PLACES_API_KEY;
if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY is missing");

const center = { latitude: 5.973, longitude: 80.365 };
const radiusKm = 4;
const outputPath = new URL("../src/data/ahangama-map-places.js", import.meta.url);
const searches = [
  ...[
    "hotels in Ahangama Sri Lanka",
    "guest houses in Ahangama Sri Lanka",
    "hostels in Ahangama Sri Lanka",
    "villas in Ahangama Sri Lanka",
    "resorts in Ahangama Sri Lanka",
    "homestays in Ahangama Sri Lanka",
    "bed and breakfasts in Ahangama Sri Lanka",
    "holiday homes in Ahangama Sri Lanka",
    "surf camps with accommodation in Ahangama Sri Lanka",
  ].map((textQuery) => ({ textQuery, group: "accommodation" })),
  ...[
    "cafes in Ahangama Sri Lanka",
    "coffee shops in Ahangama Sri Lanka",
    "restaurants in Ahangama Sri Lanka",
    "breakfast restaurants in Ahangama Sri Lanka",
    "seafood restaurants in Ahangama Sri Lanka",
    "Sri Lankan restaurants in Ahangama Sri Lanka",
    "bars in Ahangama Sri Lanka",
    "cocktail bars in Ahangama Sri Lanka",
    "beach bars in Ahangama Sri Lanka",
  ].map((textQuery) => ({ textQuery, group: "food" })),
];
const categoryGroups = {
  accommodation: "accommodation",
  cafe: "food",
  restaurant: "food",
  bar: "food",
};
const categoryTypes = {
  accommodation: new Set([
    "bed_and_breakfast",
    "campground",
    "cottage",
    "extended_stay_hotel",
    "farmstay",
    "guest_house",
    "hostel",
    "hotel",
    "inn",
    "lodging",
    "motel",
    "private_guest_room",
    "resort_hotel",
    "rv_park",
  ]),
  cafe: new Set(["cafe", "coffee_shop"]),
  restaurant: new Set([
    "breakfast_restaurant",
    "brunch_restaurant",
    "fast_food_restaurant",
    "fine_dining_restaurant",
    "hamburger_restaurant",
    "indian_restaurant",
    "pizza_restaurant",
    "restaurant",
    "sandwich_shop",
    "seafood_restaurant",
    "sushi_restaurant",
    "thai_restaurant",
    "vegan_restaurant",
    "vegetarian_restaurant",
  ]),
  bar: new Set(["bar", "cocktail_bar", "pub", "sports_bar", "wine_bar"]),
};

const toRadians = (degrees) => degrees * Math.PI / 180;
const distanceKm = (first, second) => {
  const latitudeDelta = toRadians(second.latitude - first.latitude);
  const longitudeDelta = toRadians(second.longitude - first.longitude);
  const value = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(toRadians(first.latitude))
      * Math.cos(toRadians(second.latitude))
      * Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
};

const places = new Map();
for (const { textQuery, group } of searches) {
  let pageToken;
  do {
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id,places.displayName,places.location,places.primaryType,places.types,places.businessStatus,places.rating,places.userRatingCount,nextPageToken",
      },
      body: JSON.stringify({
        textQuery,
        languageCode: "en",
        pageSize: 20,
        locationBias: { circle: { center, radius: 5000 } },
        ...(pageToken ? { pageToken } : {}),
      }),
    });

    if (!response.ok) {
      throw new Error(`${textQuery}: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    for (const place of data.places || []) {
      if (!place.location || distanceKm(center, place.location) > radiusKm) continue;
      if (place.businessStatus === "CLOSED_PERMANENTLY") continue;
      const existingPlace = places.get(place.id) || { ...place, searchGroups: [] };
      existingPlace.searchGroups = [...new Set([...existingPlace.searchGroups, group])];
      places.set(place.id, existingPlace);
    }
    pageToken = data.nextPageToken;
  } while (pageToken);
}

const generatedPlaces = [...places.values()].flatMap((place) => {
  const types = new Set([place.primaryType, ...(place.types || [])]);
  const categories = Object.entries(categoryTypes)
    .filter(([category, acceptedTypes]) => (
      place.searchGroups.includes(categoryGroups[category])
      && [...types].some((type) => acceptedTypes.has(type))
    ))
    .map(([category]) => category);
  if (categories.length === 0) return [];

  const primaryCategory = categories.find((category) => categoryTypes[category].has(place.primaryType))
    || categories[0];
  return [{
    placeId: place.id,
    name: place.displayName?.text || "Unnamed place",
    category: primaryCategory,
    categories,
    rating: place.rating || 0,
    reviews: place.userRatingCount || 0,
    lat: place.location.latitude,
    lng: place.location.longitude,
  }];
}).sort((first, second) => (
  first.category.localeCompare(second.category)
  || second.reviews - first.reviews
  || first.name.localeCompare(second.name)
));

const output = `// Generated by scripts/generate-ahangama-map-places.mjs.\n`
  + `export const AHANGAMA_MAP_PLACES = ${JSON.stringify(generatedPlaces, null, 2)};\n`;
await writeFile(outputPath, output);

const counts = Object.fromEntries(Object.keys(categoryTypes).map((category) => [
  category,
  generatedPlaces.filter((place) => place.categories.includes(category)).length,
]));
console.log(JSON.stringify({ places: generatedPlaces.length, ...counts }, null, 2));