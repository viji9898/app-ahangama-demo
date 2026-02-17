import React, { useState, useEffect } from "react";
import { PLACES } from "../data/places";

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function HomeMobile() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(undefined);
  const [userLocation, setUserLocation] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {},
        { enableHighAccuracy: true, timeout: 10000 },
      );
    }
  }, []);

  let filtered = PLACES.filter(
    (p) =>
      p.status === "active" &&
      (!category || p.category === category) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.cardPerk &&
          p.cardPerk.toLowerCase().includes(search.toLowerCase())) ||
        (p.tags &&
          p.tags.join(" ").toLowerCase().includes(search.toLowerCase()))),
  );

  if (userLocation) {
    filtered = filtered
      .map((place) => {
        let distance = null;
        if (place.lat && place.lng) {
          distance = getDistanceFromLatLonInKm(
            userLocation.lat,
            userLocation.lng,
            place.lat,
            place.lng,
          );
        }
        return { ...place, _distance: distance };
      })
      .sort((a, b) => {
        if (a._distance === null && b._distance === null) return 0;
        if (a._distance === null) return 1;
        if (b._distance === null) return -1;
        return a._distance - b._distance;
      });
  }

  // Mobile-first container and card styles
  return (
    <div
      style={{
        maxWidth: 430,
        margin: "0 auto",
        padding: 0,
        background: "#fafbfc",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Hero section at the top */}
      <div
        style={{
          width: "100%",
          background: "linear-gradient(90deg, #f7b733 60%, #fc8803 100%)",
          color: "#fff",
          padding: "14px 0 14px 0",
          textAlign: "left",
          fontWeight: 700,
          fontSize: 20,
          letterSpacing: 0.2,
          position: "relative",
          boxShadow: "0 2px 8px rgba(79,111,134,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "nowrap",
          overflow: "hidden",
        }}
      >
        <img
          src="https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/pass_sample.jpeg"
          alt="Ahangama Pass Sample"
          style={{
            width: 60,
            height: 60,
            borderRadius: 10,
            boxShadow: "0 1px 4px #e0e0e0",
            marginLeft: 12,
            marginRight: 10,
            flexShrink: 0,
            objectFit: "contain",
          }}
        />
        <span
          style={{
            display: "inline-block",
            verticalAlign: "middle",
            lineHeight: 1.2,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
            flex: 1,
          }}
        >
          Discover & unlock the best of Ahangama with your Pass!
        </span>
      </div>
      {/* Floating Get Pass button for mobile */}
      <a
        href="https://pass.ahangama.com"
        target="_blank"
        rel="noopener noreferrer"
        className="ahg-floating-getpass-btn"
        style={{
          display: "block",
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          margin: "0 auto",
          zIndex: 1000,
          width: "100vw",
          maxWidth: 500,
          background: "linear-gradient(90deg, #f7b733 60%, #fc8803 100%)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 20,
          padding: "18px 0 16px 0",
          borderRadius: "18px 18px 0 0",
          boxShadow: "0 -2px 16px rgba(79,111,134,0.10)",
          textAlign: "center",
          textDecoration: "none",
          letterSpacing: 0.5,
          transition: "background 0.2s, box-shadow 0.2s",
        }}
      >
        Get Your Pass
      </a>
      <div
        style={{
          padding: 12,
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <input
          type="text"
          placeholder="Search venues or perks"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            fontSize: 16,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #eee",
            marginBottom: 8,
          }}
        />
        {/* Category filter buttons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            overflowX: "auto",
            marginBottom: 8,
          }}
        >
          <button
            onClick={() => setCategory(undefined)}
            style={{
              minWidth: 70,
              padding: "6px 14px",
              borderRadius: 8,
              border: "none",
              background: !category ? "#2176AE" : "#eee",
              color: !category ? "#fff" : "#2176AE",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            All
          </button>
          {[
            ...new Set(
              PLACES.filter((p) => p.status === "active").map(
                (p) => p.category,
              ),
            ),
          ].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(category === c ? undefined : c)}
              style={{
                minWidth: 70,
                padding: "6px 14px",
                borderRadius: 8,
                border: "none",
                background: category === c ? "#2176AE" : "#eee",
                color: category === c ? "#fff" : "#2176AE",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                textTransform: "capitalize",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: 8,
        }}
      >
        {filtered.length === 0 && (
          <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>
            No venues found.
          </div>
        )}
        {filtered.map((place) => {
          let distance = null;
          if (userLocation && place.lat && place.lng) {
            distance = getDistanceFromLatLonInKm(
              userLocation.lat,
              userLocation.lng,
              place.lat,
              place.lng,
            );
          }
          const categoryIcons = {
            food: "🍽️",
            eat: "🍽️",
            drink: "🍹",
            stay: "🏨",
            sleep: "🛏️",
            sport: "🏄",
            yoga: "🧘",
            shop: "🛍️",
            wellness: "💆",
            art: "🎨",
            music: "🎵",
          };
          const icon =
            categoryIcons[(place.category || "").toLowerCase()] || "⭐";
          return (
            <div
              key={place.id}
              style={{
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 1px 8px rgba(79,111,134,0.07)",
                padding: 0,
                overflow: "hidden",
                marginBottom: 16,
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 10,
                  cursor: "default",
                  padding: 0,
                  paddingBottom: 0,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 100,
                    height: 100,
                    flex: "0 0 100px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {place.image && (
                    <img
                      src={place.image}
                      alt={place.name + " photo"}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 14,
                        display: "block",
                      }}
                      loading="lazy"
                    />
                  )}
                  {place.discount && (
                    <span
                      style={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        background: "rgba(255, 215, 64, 0.95)",
                        color: "#7a5c00",
                        fontWeight: 700,
                        fontSize: 13,
                        borderRadius: 10,
                        padding: "2px 10px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        zIndex: 2,
                        letterSpacing: 0.2,
                      }}
                    >
                      {Math.round(place.discount * 100)}% Off
                    </span>
                  )}
                </div>
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      minHeight: 24,
                    }}
                  >
                    <span style={{ fontSize: 20, marginRight: 2 }}>{icon}</span>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 18,
                        lineHeight: "24px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 180,
                      }}
                    >
                      {place.name}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 13,
                      color: "#666",
                      minHeight: 18,
                    }}
                  >
                    <span style={{ color: "#f7b733", fontSize: 14 }}>★</span>
                    <span style={{ fontWeight: 600 }}>
                      {place.stars ? place.stars.toFixed(1) : "-"}
                    </span>
                    <span style={{ color: "#aaa", fontWeight: 400 }}>
                      · {place.reviews || 0}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#555",
                      lineHeight: "18px",
                      maxHeight: 36,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      margin: "2px 0 0 0",
                    }}
                  >
                    {place.excerpt || place.cardPerk}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 12,
                      color: "#888",
                      marginTop: 2,
                      minHeight: 16,
                    }}
                  >
                    <span>
                      {place.area}
                      {distance !== null ? ` · ` : ""}
                    </span>
                    {distance !== null && (
                      <span>
                        {distance < 1
                          ? `${Math.round(distance * 1000)} m`
                          : `${distance.toFixed(1)} km`}{" "}
                        away
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      marginTop: 2,
                      minHeight: 26,
                    }}
                  >
                    {place.offer && place.offer.length > 0
                      ? place.offer
                          .filter((offer) => !(offer && /%\s*off/i.test(offer)))
                          .slice(0, 2)
                          .map((offer, i) => (
                            <span
                              key={i}
                              style={{
                                background: i === 0 ? "#F8E9C7" : "#E6F0FA",
                                color: i === 0 ? "#A67C00" : "#2176AE",
                                fontSize: 12,
                                borderRadius: 8,
                                padding: "3px 10px",
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                lineHeight: "18px",
                                height: 22,
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                            >
                              {offer}
                            </span>
                          ))
                      : place.tags &&
                        place.tags.slice(0, 2).map((tag, i) => (
                          <span
                            key={i}
                            style={{
                              background: "#eee",
                              color: "#666",
                              fontSize: 12,
                              borderRadius: 8,
                              padding: "3px 10px",
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                              lineHeight: "18px",
                              height: 22,
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                  </div>
                </div>
              </div>
              {/* Banner for More Details and Google Maps at the bottom of the card */}
              <div style={{ display: "flex", width: "100%" }}>
                <button
                  className="ahg-listing-maps-btn"
                  style={{
                    flex: 1,
                    background: "#fff",
                    color: "#2176AE",
                    border: "none",
                    borderRadius: "0 0 0 16px",
                    fontWeight: 700,
                    fontSize: 15,
                    padding: "12px 0",
                    cursor: place.mapUrl ? "pointer" : "not-allowed",
                    outline: "none",
                    letterSpacing: 0.2,
                    boxShadow: "0 -1px 6px rgba(79,111,134,0.04)",
                    borderRight: "1px solid #e6f0fa",
                    margin: 0,
                    opacity: place.mapUrl ? 1 : 0.5,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (place.mapUrl) window.open(place.mapUrl, "_blank", "noopener,noreferrer");
                  }}
                  disabled={!place.mapUrl}
                >
                  Google Maps
                </button>
                <button
                  className="ahg-listing-details-btn"
                  style={{
                    flex: 1,
                    background: expandedId === place.id ? "#e6f0fa" : "#2176AE",
                    color: expandedId === place.id ? "#2176AE" : "#fff",
                    border: "none",
                    borderRadius: "0 0 16px 0",
                    fontWeight: 700,
                    fontSize: 15,
                    padding: "12px 0",
                    cursor: "pointer",
                    outline: "none",
                    letterSpacing: 0.2,
                    boxShadow: "0 -1px 6px rgba(79,111,134,0.04)",
                    margin: 0,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedId(expandedId === place.id ? null : place.id);
                  }}
                  aria-expanded={expandedId === place.id}
                  aria-controls={`expand-details-${place.id}`}
                >
                  {expandedId === place.id ? "Hide details" : "More details"}
                </button>
              </div>
              {expandedId === place.id && (
                <div
                  id={`expand-details-${place.id}`}
                  style={{
                    background: "#f9f9f9",
                    borderRadius: 12,
                    marginTop: 0,
                    padding: "16px 14px",
                    fontSize: 15,
                    color: "#333",
                    boxShadow: "0 1px 6px rgba(79,111,134,0.07)",
                    transition: "all 0.2s",
                  }}
                >
                  {place.description && (
                    <div style={{ marginBottom: 10 }}>{place.description}</div>
                  )}
                  {place.bestFor && place.bestFor.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      <strong>Best for:</strong> {place.bestFor.join(", ")}
                    </div>
                  )}
                  {place.hours && (
                    <div style={{ marginBottom: 8 }}>
                      <strong>Hours:</strong> {place.hours}
                    </div>
                  )}
                  {place.howToClaim && (
                    <div style={{ marginBottom: 8 }}>
                      <strong>How to claim:</strong> {place.howToClaim}
                    </div>
                  )}
                  {place.restrictions && (
                    <div style={{ marginBottom: 8 }}>
                      <strong>Restrictions:</strong> {place.restrictions}
                    </div>
                  )}
                  {place.whatsApp && (
                    <div style={{ marginBottom: 8 }}>
                      <strong>WhatsApp:</strong> {place.whatsApp}
                    </div>
                  )}
                  {place.instagram && (
                    <div style={{ marginBottom: 8 }}>
                      <strong>Instagram:</strong> @{place.instagram}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
