import React, { useMemo } from "react";
import { Alert, Spin, Tooltip } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { usePlaces } from "../app/placesContext";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

export default function LogoPage() {
  const { places, loading, error } = usePlaces();

  const venuesWithLogos = useMemo(() => {
    return (Array.isArray(places) ? places : []).filter(
      (venue) => venue && venue.logo,
    );
  }, [places]);

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
