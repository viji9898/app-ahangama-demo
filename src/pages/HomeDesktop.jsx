import React, { useState, useEffect } from "react";
import { PLACES } from "../data/places";
import { CATEGORIES } from "../data/categories";

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

export default function HomeDesktop() {
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
  return (
    <>
      {/* Hero Section */}
      <div
        style={{
          width: "100%",
          background: "linear-gradient(90deg, #F6EFE8 60%, #f7e7c6 100%)",
          padding: "48px 0 24px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid #f0e6dc",
        }}
      >
        <h1
          style={{
            fontSize: 38,
            fontWeight: 800,
            color: "#2F3E3A",
            margin: 0,
            letterSpacing: 0.5,
            textAlign: "center",
            textShadow: "0 2px 12px rgba(79,111,134,0.06)",
          }}
        >
          Discover the Best of Ahangama
        </h1>
        <p
          style={{
            fontSize: 20,
            color: "#4A3F36",
            margin: "18px 0 0 0",
            fontWeight: 500,
            textAlign: "center",
            maxWidth: 600,
          }}
        >
          Explore exclusive venues, perks, and experiences with your Ahangama
          Pass. Find your next favorite spot below!
        </p>
      </div>
      {/* Search Filter & Categories */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          background: "#F6EFE8",
          padding: 24,
          boxShadow: "0 2px 12px rgba(79,111,134,0.06)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search venues or perks"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: 260,
            fontSize: 14,
            padding: 7,
            borderRadius: 6,
            border: "1px solid #eee",
            marginBottom: 16,
            marginRight: 0,
            background: "#fff",
            display: "block",
          }}
        />
        <div
          style={{
            display: "flex",
            gap: 7,
            marginBottom: 0,
            flexWrap: "wrap",
            background: "#F6EFE8",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => setCategory(undefined)}
            style={{
              fontSize: 13,
              padding: "6px 12px",
              borderRadius: 6,
              border: category ? "1px solid #eee" : "2px solid #bfa16a",
              background: category ? "#fff" : "#f7e7c6",
              color: category ? "#333" : "#bfa16a",
              fontWeight: 600,
              cursor: "pointer",
              outline: "none",
              transition: "all 0.15s",
            }}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              style={{
                fontSize: 13,
                padding: "6px 12px",
                borderRadius: 6,
                border:
                  category === cat.key ? "2px solid #bfa16a" : "1px solid #eee",
                background: category === cat.key ? "#f7e7c6" : "#fff",
                color: category === cat.key ? "#bfa16a" : "#333",
                fontWeight: 600,
                cursor: "pointer",
                outline: "none",
                transition: "all 0.15s",
              }}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 20,
          padding: 18,
        }}
      >
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
                background: "#FBF6F1",
                borderRadius: 12,
                boxShadow: "0 1px 6px rgba(79,111,134,0.06)",
                padding: 0,
                overflow: "hidden",
                minHeight: 280,
                maxHeight: 340,
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4/3",
                  minHeight: 90,
                  maxHeight: 120,
                  overflow: "hidden",
                }}
              >
                {place.image && (
                  <img
                    src={place.image}
                    alt={place.name + " photo"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "16px 16px 0 0",
                      display: "block",
                      aspectRatio: "4/3",
                      minHeight: 140,
                      maxHeight: 180,
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
                  padding: 12,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      minHeight: 20,
                    }}
                  >
                    <span style={{ fontSize: 20, marginRight: 2 }}>{icon}</span>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 15,
                        lineHeight: "20px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 120,
                      }}
                    >
                      {place.name}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: "#666",
                      minHeight: 14,
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
                      fontSize: 11,
                      color: "#555",
                      lineHeight: "15px",
                      maxHeight: 28,
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
                      fontSize: 10,
                      color: "#888",
                      marginTop: 2,
                      minHeight: 12,
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
                </div>
                <div style={{ display: "flex", width: "100%", marginTop: 8 }}>
                  <button
                    style={{
                      flex: 1,
                      background: "#E6DDD4",
                      color: "#4A3F36",
                      border: "none",
                      borderRadius: "0 0 0 12px",
                      fontWeight: 700,
                      fontSize: 12,
                      padding: "8px 0",
                      cursor: place.mapUrl ? "pointer" : "not-allowed",
                      outline: "none",
                      letterSpacing: 0.2,
                      boxShadow: "0 -1px 6px rgba(79,111,134,0.04)",
                      borderRight: "1px solid #e6f0fa",
                      margin: 0,
                      opacity: place.mapUrl ? 1 : 0.5,
                    }}
                    onClick={() =>
                      place.mapUrl &&
                      window.open(place.mapUrl, "_blank", "noopener,noreferrer")
                    }
                    disabled={!place.mapUrl}
                  >
                    Google Maps
                  </button>
                  <button
                    style={{
                      flex: 1,
                      background: "#F0E6DC",
                      color: "#4A3F36",
                      border: "none",
                      borderRadius: "0 0 12px 0",
                      fontWeight: 700,
                      fontSize: 12,
                      padding: "8px 0",
                      cursor: "pointer",
                      outline: "none",
                      letterSpacing: 0.2,
                      boxShadow: "0 -1px 6px rgba(79,111,134,0.04)",
                      margin: 0,
                    }}
                    onClick={() =>
                      setExpandedId(expandedId === place.id ? null : place.id)
                    }
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
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      background: "rgba(0,0,0,0.18)",
                      zIndex: 1000,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => setExpandedId(null)}
                  >
                    <div
                      style={{
                        background: "#FBF6F1",
                        borderRadius: 16,
                        padding: "28px 24px 18px 24px",
                        fontSize: 16,
                        color: "#333",
                        boxShadow: "0 4px 32px rgba(79,111,134,0.18)",
                        minWidth: 320,
                        maxWidth: 420,
                        width: "90vw",
                        position: "relative",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setExpandedId(null)}
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 14,
                          background: "none",
                          border: "none",
                          fontSize: 22,
                          color: "#bfa16a",
                          cursor: "pointer",
                        }}
                        aria-label="Close details"
                      >
                        ×
                      </button>
                      {place.description && (
                        <div style={{ marginBottom: 10 }}>
                          {place.description}
                        </div>
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
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <a
        href="https://pass.ahangama.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          margin: "0 auto",
          zIndex: 1200,
          minWidth: 320,
          width: "50%",
          maxWidth: "100vw",
          background: "#2F3E3A",
          color: "#FFFFFF",
          fontWeight: 700,
          fontSize: 22,
          padding: "20px 0 18px 0",
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

      {/* Footer */}
      <footer
        style={{
          width: "100%",
          background: "#F6EFE8",
          color: "#4A3F36",
          textAlign: "center",
          fontSize: 15,
          fontWeight: 500,
          padding: "32px 0 18px 0",
          marginTop: 80,
          position: "relative",
        }}
      >
        &copy; {new Date().getFullYear()} Ahangama Pass. Made with{" "}
        <span style={{ color: "#bfa16a" }}>♥</span> in Sri Lanka.
      </footer>
    </>
  );
}
