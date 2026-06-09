import React from "react";
import { Typography } from "antd";

const { Text, Title } = Typography;

export default function EditorialNextArticle({
  href,
  kicker = "Discover More",
  title,
  image,
  ctaLabel = "Read now ->",
  style,
}) {
  return (
    <div style={{ marginTop: 16, marginBottom: 32, ...style }}>
      <a
        href={href}
        style={{
          display: "block",
          position: "relative",
          overflow: "hidden",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <img
          src={image}
          alt={title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(12,12,12,0.2) 0%, rgba(12,12,12,0.42) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "clamp(28px, 5vw, 52px)",
          }}
        >
          <Text
            style={{
              display: "block",
              color: "rgba(255,255,255,0.92)",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1.2,
              marginBottom: 16,
            }}
          >
            {kicker}
          </Text>
          <Title
            level={2}
            className="twelve-things-heroTitle"
            style={{
              maxWidth: 1220,
              margin: 0,
              color: "#ffffff",
              fontSize: "clamp(34px, 4.8vw, 76px)",
              lineHeight: 0.97,
              letterSpacing: -1.4,
              fontFamily: '"Avenir Next", "Segoe UI", sans-serif',
              fontWeight: 600,
            }}
          >
            {title}
          </Title>
          <Text
            style={{
              display: "block",
              marginTop: 18,
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: 0.2,
            }}
          >
            {ctaLabel}
          </Text>
        </div>
      </a>
    </div>
  );
}
