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
        (p.cardPerk && p.cardPerk.toLowerCase().includes(search.toLowerCase())) ||
        (p.tags && p.tags.join(" ").toLowerCase().includes(search.toLowerCase()))),
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
            place.lng
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
    <div style={{ maxWidth: 430, margin: '0 auto', padding: 0, background: '#fafbfc' }}>
      <div style={{ padding: 12, background: '#fff', position: 'sticky', top: 0, zIndex: 10 }}>
        <input
          type="text"
          placeholder="Search venues or perks"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', fontSize: 16, padding: 10, borderRadius: 8, border: '1px solid #eee', marginBottom: 8 }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 8 }}>
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
            food: "🍽️", eat: "🍽️", drink: "🍹", stay: "🏨", sleep: "🛏️", sport: "🏄", surf: "🏄", yoga: "🧘", shop: "🛍️", wellness: "💆", art: "🎨", music: "🎵",
          };
          const icon = categoryIcons[(place.category || '').toLowerCase()] || "⭐";
          return (
            <div key={place.id} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 8px rgba(79,111,134,0.07)', padding: 0, overflow: 'hidden', marginBottom: 2 }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 10, cursor: place.mapUrl ? 'pointer' : 'default' }} onClick={() => place.mapUrl && window.open(place.mapUrl, '_blank', 'noopener,noreferrer')}>
                <div style={{ position: 'relative', width: 100, height: 100, flex: '0 0 100px' }}>
                  {place.image && (
                    <img src={place.image} alt={place.name + ' photo'} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 14, display: 'block' }} loading="lazy" />
                  )}
                  {place.discount && (
                    <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(255, 215, 64, 0.95)', color: '#7a5c00', fontWeight: 700, fontSize: 13, borderRadius: 10, padding: '2px 10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', zIndex: 2, letterSpacing: 0.2 }}>{Math.round(place.discount * 100)}% Off</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, minHeight: 24 }}>
                    <span style={{ fontSize: 20, marginRight: 2 }}>{icon}</span>
                    <span style={{ fontWeight: 700, fontSize: 18, lineHeight: '24px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>{place.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#666', minHeight: 18 }}>
                    <span style={{ color: '#f7b733', fontSize: 14 }}>★</span>
                    <span style={{ fontWeight: 600 }}>{place.stars ? place.stars.toFixed(1) : '-'}</span>
                    <span style={{ color: '#aaa', fontWeight: 400 }}>· {place.reviews || 0}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#555', lineHeight: '18px', maxHeight: 36, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', margin: '2px 0 0 0' }}>{place.excerpt || place.cardPerk}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#888', marginTop: 2, minHeight: 16 }}>
                    <span>{place.area}{distance !== null ? ` · ` : ''}</span>
                    {distance !== null && (
                      <span>{distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`} away</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 2, minHeight: 26 }}>
                    {place.offer && place.offer.length > 0 ? (
                      place.offer.filter(offer => !(offer && /%\s*off/i.test(offer))).slice(0, 2).map((offer, i) => (
                        <span key={i} style={{ background: i === 0 ? '#F8E9C7' : '#E6F0FA', color: i === 0 ? '#A67C00' : '#2176AE', fontSize: 12, borderRadius: 8, padding: '3px 10px', fontWeight: 600, whiteSpace: 'nowrap', lineHeight: '18px', height: 22, display: 'inline-flex', alignItems: 'center' }}>{offer}</span>
                      ))
                    ) : (
                      place.tags && place.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} style={{ background: '#eee', color: '#666', fontSize: 12, borderRadius: 8, padding: '3px 10px', fontWeight: 500, whiteSpace: 'nowrap', lineHeight: '18px', height: 22, display: 'inline-flex', alignItems: 'center' }}>{tag}</span>
                      ))
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                    <button
                      className="ahg-listing-details-btn"
                      style={{ background: 'none', border: 'none', color: '#2176AE', fontWeight: 600, fontSize: 15, cursor: 'pointer', padding: 0, outline: 'none' }}
                      onClick={e => { e.stopPropagation(); setExpandedId(expandedId === place.id ? null : place.id); }}
                      aria-expanded={expandedId === place.id}
                      aria-controls={`expand-details-${place.id}`}
                    >
                      {expandedId === place.id ? 'Hide details' : 'More details'}
                    </button>
                  </div>
                </div>
              </div>
              {expandedId === place.id && (
                <div id={`expand-details-${place.id}`} style={{ background: '#f9f9f9', borderRadius: 12, marginTop: 0, padding: '16px 14px', fontSize: 15, color: '#333', boxShadow: '0 1px 6px rgba(79,111,134,0.07)', transition: 'all 0.2s' }}>
                  {place.description && (<div style={{ marginBottom: 10 }}>{place.description}</div>)}
                  {place.bestFor && place.bestFor.length > 0 && (<div style={{ marginBottom: 8 }}><strong>Best for:</strong> {place.bestFor.join(', ')}</div>)}
                  {place.hours && (<div style={{ marginBottom: 8 }}><strong>Hours:</strong> {place.hours}</div>)}
                  {place.howToClaim && (<div style={{ marginBottom: 8 }}><strong>How to claim:</strong> {place.howToClaim}</div>)}
                  {place.restrictions && (<div style={{ marginBottom: 8 }}><strong>Restrictions:</strong> {place.restrictions}</div>)}
                  {place.whatsApp && (<div style={{ marginBottom: 8 }}><strong>WhatsApp:</strong> {place.whatsApp}</div>)}
                  {place.instagram && (<div style={{ marginBottom: 8 }}><strong>Instagram:</strong> @{place.instagram}</div>)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
