import React, {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const PlacesContext = createContext(null);

async function fetchPlaces(destinationSlug) {
  const params = new URLSearchParams({ destinationSlug });
  const response = await fetch(`/api/venues?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to load venues: ${response.status}`);
  }

  const payload = await response.json();
  if (!payload.ok) {
    throw new Error(payload.error || "Failed to load venues");
  }

  return Array.isArray(payload.venues) ? payload.venues : [];
}

export function PlacesProvider({ children, destinationSlug = "ahangama" }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    fetchPlaces(destinationSlug)
      .then((venues) => {
        if (!active) return;

        startTransition(() => {
          setPlaces(venues);
          setLoading(false);
        });
      })
      .catch((nextError) => {
        if (!active) return;

        setError(nextError);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [destinationSlug, reloadToken]);

  const value = useMemo(
    () => ({
      places,
      loading,
      error,
      reload: () => setReloadToken((current) => current + 1),
    }),
    [places, loading, error],
  );

  return (
    <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>
  );
}

export function usePlaces() {
  const context = useContext(PlacesContext);

  if (!context) {
    throw new Error("usePlaces must be used within PlacesProvider");
  }

  return context;
}
