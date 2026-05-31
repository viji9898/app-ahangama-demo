import { shouldShowPlace } from "../data/placeStatus";

export const FULL_LIST_PATH = "/full-list";
export const MAX_HOME_PASS_VENUES = 10;
export const TOP_BEST_FOR_LIMIT = 10;

function normalizeTag(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getSortScore(place) {
  return (
    (place.isFeatured ? 1000 : 0) +
    (place.staffPick ? 100 : 0) +
    (place.priorityScore || 0) +
    (place.passPriority || 0) +
    (place.reviews || 0)
  );
}

export function getPassPlaces(allPlaces, destinationSlug = "ahangama") {
  return allPlaces
    .filter((place) => place.destinationSlug === destinationSlug)
    .filter((place) => shouldShowPlace(place))
    .filter(
      (place) =>
        (Array.isArray(place.offers) && place.offers.length > 0) ||
        Boolean(place.offer),
    )
    .sort((left, right) => {
      const scoreDiff = getSortScore(right) - getSortScore(left);
      if (scoreDiff !== 0) return scoreDiff;
      return String(left.name || "").localeCompare(String(right.name || ""));
    });
}

export function buildBestForGroups(passPlaces, topLimit = TOP_BEST_FOR_LIMIT) {
  const bestForStats = new Map();

  passPlaces.forEach((place) => {
    (place.bestFor || []).forEach((entry) => {
      const normalized = normalizeTag(entry);
      if (!normalized) return;

      const current = bestForStats.get(normalized) || {
        key: normalized,
        label: String(entry).trim(),
        count: 0,
      };

      current.count += 1;
      if (!current.label && entry) {
        current.label = String(entry).trim();
      }
      bestForStats.set(normalized, current);
    });
  });

  const topBestFors = Array.from(bestForStats.values())
    .sort((left, right) => {
      if (right.count !== left.count) return right.count - left.count;
      return left.label.localeCompare(right.label);
    })
    .slice(0, topLimit);

  const topBestForKeys = new Set(topBestFors.map((item) => item.key));
  const groups = topBestFors.map((item) => ({ ...item, places: [] }));
  const groupMap = new Map(groups.map((group) => [group.key, group]));
  const otherPlaces = [];

  passPlaces.forEach((place) => {
    const matchingTopTags = (place.bestFor || [])
      .map((entry) => normalizeTag(entry))
      .filter((key) => topBestForKeys.has(key));

    if (!matchingTopTags.length) {
      otherPlaces.push(place);
      return;
    }

    matchingTopTags.sort((left, right) => {
      const leftGroup = groupMap.get(left);
      const rightGroup = groupMap.get(right);
      if ((rightGroup?.count || 0) !== (leftGroup?.count || 0)) {
        return (rightGroup?.count || 0) - (leftGroup?.count || 0);
      }
      return (leftGroup?.label || "").localeCompare(rightGroup?.label || "");
    });

    groupMap.get(matchingTopTags[0])?.places.push(place);
  });

  return { topBestFors, groups, otherPlaces };
}
