// Place/Vendor Status Management
export const PLACE_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  COMING_SOON: "coming_soon",
};

export const PLACE_STATUS_LABELS = {
  [PLACE_STATUS.ACTIVE]: "Active",
  [PLACE_STATUS.INACTIVE]: "Inactive",
  [PLACE_STATUS.COMING_SOON]: "Coming Soon",
};

export const PLACE_STATUS_COLORS = {
  [PLACE_STATUS.ACTIVE]: "green",
  [PLACE_STATUS.INACTIVE]: "red",
  [PLACE_STATUS.COMING_SOON]: "orange",
};

// Helper function to check if a place should be visible to users
export const shouldShowPlace = (place) => {
  // Default to active if no status is set (backward compatibility)
  const status = place.status || PLACE_STATUS.ACTIVE;
  return status === PLACE_STATUS.ACTIVE;
};

// Helper function to get places by status
export const getPlacesByStatus = (places, status) => {
  return places.filter((place) => place.status === status);
};

// Helper function to get active places only
export const getActivePlaces = (places) => {
  return getPlacesByStatus(places, PLACE_STATUS.ACTIVE);
};
