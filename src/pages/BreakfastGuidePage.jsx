import React from "react";
import {
  EnvironmentOutlined,
  InstagramOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { PLACES } from "../data/places";
import { EAT_DRINK_GUIDES } from "../features/print-guide/guideData";
import "../styles/breakfast-guide.css";

export const EAT_DRINK_GUIDE_PATHS = Object.freeze(
  Object.fromEntries(
    Object.keys(EAT_DRINK_GUIDES).map((guideKey) => [
      guideKey,
      `/guide/${guideKey}`,
    ]),
  ),
);

function getInstagramUrl(place) {
  if (!place.instagram) return null;
  return `https://www.instagram.com/${String(place.instagram).replace(/^@/, "")}/`;
}

function getDirectionsUrl(place) {
  if (place.mapUrl) return place.mapUrl;
  if (typeof place.lat === "number" && typeof place.lng === "number") {
    return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
  }
  return null;
}

function GuideVenueCard({ place, index, guideTitle }) {
  const instagramUrl = getInstagramUrl(place);
  const directionsUrl = getDirectionsUrl(place);
  const offer = Array.isArray(place.offer) ? place.offer[0] : place.offer;

  return (
    <article className="breakfast-card">
      <div className="breakfast-card-media">
        <img
          src={place.image || place.ogImage || place.logo}
          alt={`${place.name.trim()} ${guideTitle.toLowerCase()} venue`}
          loading="lazy"
        />
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="breakfast-card-body">
        <div className="breakfast-card-heading">
          <div>
            <p>{place.area || "Ahangama"}</p>
            <h2>{place.name.trim()}</h2>
          </div>
          {place.stars ? (
            <span
              className="breakfast-rating"
              aria-label={`${place.stars} stars from ${place.reviews || 0} reviews`}
            >
              <StarFilled /> {place.stars}
              {place.reviews ? (
                <small>· {place.reviews.toLocaleString()} reviews</small>
              ) : null}
            </span>
          ) : null}
        </div>
        <p className="breakfast-description">
          {place.excerpt || place.description}
        </p>
        <dl className="breakfast-details">
          <div>
            <dt>Rate</dt>
            <dd>{place.price || "Check current menu"}</dd>
          </div>
          <div>
            <dt>Best for</dt>
            <dd>{(place.bestFor || [guideTitle]).slice(0, 2).join(" · ")}</dd>
          </div>
        </dl>
        {offer ? (
          <p className="breakfast-offer">
            <span>Card rate</span>
            <strong>{offer}</strong>
          </p>
        ) : null}
        <div className="breakfast-card-actions">
          {instagramUrl ? (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
              <InstagramOutlined /> Instagram
            </a>
          ) : (
            <span className="is-unavailable">
              <InstagramOutlined /> Instagram unavailable
            </span>
          )}
          {directionsUrl ? (
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
              <EnvironmentOutlined /> Google directions
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function EatDrinkGuidePage({ guideKey }) {
  const guide = EAT_DRINK_GUIDES[guideKey];
  const guidePath = EAT_DRINK_GUIDE_PATHS[guideKey];
  const places = guide.venueSlugs
    .map((slug) => PLACES.find((place) => place.slug === slug))
    .filter(Boolean);

  return (
    <main className="breakfast-guide">
      <Seo
        title={`${guide.title} in Ahangama | Ahangama Guide`}
        description={`${guide.description} Includes rates, Instagram profiles and Google directions.`}
        canonical={absUrl(guidePath)}
        ogImage={places[0]?.image}
      />
      <header className="breakfast-header">
        <div>
          <span>Ahangama Guide · Eat & Drink</span>
          <h1>{guide.title}</h1>
          <p>{guide.description}</p>
        </div>
        <aside>
          <strong>{places.length}</strong>
          <span>local addresses</span>
        </aside>
      </header>
      <section className="breakfast-grid" aria-label={`${guide.title} places`}>
        {places.map((place, index) => (
          <GuideVenueCard
            key={place.slug}
            place={place}
            index={index}
            guideTitle={guide.title}
          />
        ))}
      </section>
      <footer className="breakfast-footer">
        Rates, opening hours and offers can change seasonally. Confirm directly
        with each venue before visiting.
      </footer>
    </main>
  );
}