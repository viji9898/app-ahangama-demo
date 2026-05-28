import React, { useEffect, useMemo, useState } from "react";
import { Alert, Spin, Tooltip } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

export default function LogoPage() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    fetch("/api/venue-logos")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load logos: ${response.status}`);
        }

        const payload = await response.json();
        if (!payload.ok) {
          throw new Error(payload.error || "Failed to load logos");
        }

        return Array.isArray(payload.logos) ? payload.logos : [];
      })
      .then((items) => {
        if (!active) return;
        setLogos(items);
        setLoading(false);
      })
      .catch((nextError) => {
        if (!active) return;
        setError(nextError);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const venuesWithLogos = useMemo(() => {
    return (Array.isArray(logos) ? logos : []).filter((venue) => venue?.logo);
  }, [logos]);

  return (
    <SiteLayout>
      <Seo
        title="Venue Logos — Ahangama"
        description="A simple gallery of venue logos."
        canonical={absUrl("/logo")}
      />

      {loading ? <Spin /> : null}

      {error ? (
        <Alert
          type="error"
          message="Unable to load venues"
          description={error.message}
          showIcon
        />
      ) : null}

      {!loading && !error ? (
        venuesWithLogos.length ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
            }}
          >
            {venuesWithLogos.map((venue) => (
              <Tooltip title={venue.name} key={venue.slug || venue.id}>
                <div
                  style={{
                    width: 100,
                    height: 100,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <img
                    src={venue.logo}
                    alt={venue.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                    loading="lazy"
                  />
                </div>
              </Tooltip>
            ))}
          </div>
        ) : (
          <Alert
            type="info"
            message="No venue logos available"
            showIcon
          />
        )
      ) : null}
    </SiteLayout>
  );
}
