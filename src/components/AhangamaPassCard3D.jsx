import React, { useRef, useState } from "react";
import passCardImage from "../assets/hero_pass_apple_wallet.png";
import "../styles/guide-page.css";

const MAX_ROTATION = 15;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function AhangamaPassCard3D({
  image = passCardImage,
  alt = "Ahangama Pass enrolled membership card",
  variant = "pass",
}) {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  const updateTilt = (clientX, clientY) => {
    const card = cardRef.current;
    if (!card) return;

    const bounds = card.getBoundingClientRect();
    const x = (clientX - bounds.left) / bounds.width;
    const y = (clientY - bounds.top) / bounds.height;
    const nextX = clamp((0.5 - y) * MAX_ROTATION * 2, -MAX_ROTATION, MAX_ROTATION);
    const nextY = clamp((x - 0.5) * MAX_ROTATION * 2, -MAX_ROTATION, MAX_ROTATION);

    setRotation({ x: nextX, y: nextY });
    setGlare({ x: clamp(100 - x * 100, 0, 100), y: clamp(100 - y * 100, 0, 100) });
  };

  const resetTilt = () => {
    setRotation({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50 });
  };

  return (
    <div className="ahg-pass3d-scene" onMouseLeave={resetTilt}>
      <div
        ref={cardRef}
        className={`ahg-pass3d-card ahg-pass3d-card--${variant}`}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
        onMouseMove={(event) => updateTilt(event.clientX, event.clientY)}
        onTouchMove={(event) => {
          const touch = event.touches[0];
          if (touch) updateTilt(touch.clientX, touch.clientY);
        }}
        onTouchEnd={resetTilt}
        onTouchCancel={resetTilt}
      >
        <div
          className="ahg-pass3d-glare"
          style={{ background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,.38), transparent 34%)` }}
          aria-hidden="true"
        />
        <img src={image} alt={alt} className="ahg-pass3d-image" />
        {variant === "guide" ? (
          <div className="ahg-guide3d-content">
            <span className="ahg-guide3d-badge">THE GUIDE</span>
            <span className="ahg-guide3d-eyebrow">DISCOVER - THINGS NOBODY TELLS YOU</span>
            <strong className="ahg-guide3d-title">Experience<br />Ahangama</strong>
            <span className="ahg-guide3d-subtitle">The insider&apos;s <b>guide</b> to Sri Lanka&apos;s coolest coast.</span>
            <span className="ahg-guide3d-cta">Get Your Complimentary Pass</span>
            <span className="ahg-guide3d-season">AHANGAMA SEASON 2026/2027</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}