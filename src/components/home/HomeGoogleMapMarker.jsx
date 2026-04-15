import React from "react";

export default function HomeGoogleMapMarker({
  name,
  discount,
  isActive = false,
  onClick,
}) {
  return (
    <button
      type="button"
      className={`home-gmap-marker${isActive ? " is-active" : ""}`}
      onClick={onClick}
      aria-label={`${name}${discount ? `, ${discount}` : ""}`}
    >
      <span className="home-gmap-marker__bubble">
        <span className="home-gmap-marker__name">{name}</span>
        {discount ? (
          <span className="home-gmap-marker__discount">{discount}</span>
        ) : null}
      </span>
    </button>
  );
}
