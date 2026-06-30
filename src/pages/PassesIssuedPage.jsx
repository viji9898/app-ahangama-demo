import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Spin, Table, Tag, Typography } from "antd";
import { Helmet } from "react-helmet-async";
import { ReloadOutlined } from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";

const { Paragraph, Text, Title } = Typography;

export const PASSES_ISSUED_PATH = "/passes-issued";

const PASSES_ISSUED_ENDPOINT = "/.netlify/functions/passes-issued";

const VENUE_LABELS = {
  "lighthouse-hotel": "Lighthouse Hotel",
  kaffi: "Kaffi",
  gusta: "Gusta",
  tahini: "Tahini & Friends",
  "living-room": "Living Room",
  unknown: "Unknown Venue",
};

function formatVenueLabel(sourceHotelSlug) {
  if (!sourceHotelSlug) {
    return "Unknown Venue";
  }

  return (
    VENUE_LABELS[sourceHotelSlug] ||
    String(sourceHotelSlug)
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatList(items) {
  return Array.isArray(items) && items.length ? items.join(", ") : "-";
}

function buildVenueFilters(venues, passes) {
  const venueMap = new Map();

  venues.forEach((venue) => {
    if (venue.sourceHotelSlug) {
      venueMap.set(venue.sourceHotelSlug, venue.count || 0);
    }
  });

  passes.forEach((pass) => {
    const sourceHotelSlug = pass.sourceHotelSlug || "unknown";

    if (!venueMap.has(sourceHotelSlug)) {
      venueMap.set(sourceHotelSlug, 0);
    }
  });

  return [...venueMap.entries()]
    .map(([sourceHotelSlug, count]) => ({
      sourceHotelSlug,
      label: formatVenueLabel(sourceHotelSlug),
      count,
    }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
}

export default function PassesIssuedPage() {
  const [passes, setPasses] = useState([]);
  const [venues, setVenues] = useState([]);
  const [activeVenue, setActiveVenue] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadPasses = async ({ refreshing = false } = {}) => {
    if (refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError(null);

    try {
      const response = await fetch(PASSES_ISSUED_ENDPOINT);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to load issued passes");
      }

      setPasses(Array.isArray(data.passes) ? data.passes : []);
      setVenues(Array.isArray(data.venues) ? data.venues : []);
    } catch (nextError) {
      setError(nextError.message || "Unable to load issued passes");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadPasses();
  }, []);

  const venueFilters = useMemo(
    () => buildVenueFilters(venues, passes),
    [passes, venues],
  );

  const filteredPasses = useMemo(() => {
    if (activeVenue === "all") {
      return passes;
    }

    return passes.filter(
      (pass) => (pass.sourceHotelSlug || "unknown") === activeVenue,
    );
  }, [activeVenue, passes]);

  const activeVenueLabel =
    activeVenue === "all" ? "All venues" : formatVenueLabel(activeVenue);

  const columns = [
    {
      title: "Guest",
      dataIndex: "fullName",
      key: "guest",
      fixed: "left",
      width: 220,
      render: (_, pass) => (
        <div>
          <Text strong>{pass.fullName || "Unnamed guest"}</Text>
          <Text style={{ display: "block", color: "#6b665f", fontSize: 12 }}>
            {pass.email || "No email"}
          </Text>
          {pass.phone ? (
            <Text style={{ display: "block", color: "#8a8178", fontSize: 12 }}>
              {pass.phone}
            </Text>
          ) : null}
        </div>
      ),
    },
    {
      title: "Venue",
      dataIndex: "sourceHotelSlug",
      key: "sourceHotelSlug",
      width: 170,
      render: (sourceHotelSlug) => formatVenueLabel(sourceHotelSlug),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status) => (
        <Tag color={status === "active" ? "green" : "default"}>
          {status || "unknown"}
        </Tag>
      ),
    },
    {
      title: "Issued",
      dataIndex: "issuedAt",
      key: "issuedAt",
      width: 170,
      render: formatDate,
    },
    {
      title: "Valid Until",
      dataIndex: "validUntil",
      key: "validUntil",
      width: 170,
      render: formatDate,
    },
    {
      title: "Wallet",
      key: "wallet",
      width: 170,
      render: (_, pass) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <Tag color={pass.appleWalletInstalled ? "green" : "default"}>
            Apple
          </Tag>
          <Tag color={pass.googleWalletInstalled ? "green" : "default"}>
            Google
          </Tag>
        </div>
      ),
    },
    {
      title: "Preferences",
      key: "preferences",
      width: 260,
      render: (_, pass) => (
        <div>
          <Text style={{ display: "block", color: "#4b453e", fontSize: 12 }}>
            Stay: {pass.stayLength || "-"}
          </Text>
          <Text style={{ display: "block", color: "#6b665f", fontSize: 12 }}>
            Group: {pass.travelGroup || "-"}
          </Text>
          <Text style={{ display: "block", color: "#6b665f", fontSize: 12 }}>
            Interests: {formatList(pass.interests)}
          </Text>
        </div>
      ),
    },
    {
      title: "Pass",
      key: "pass",
      width: 130,
      render: (_, pass) =>
        pass.passkitInstallUrl ? (
          <a href={pass.passkitInstallUrl} target="_blank" rel="noreferrer">
            Open pass
          </a>
        ) : (
          <Text type="secondary">Pending</Text>
        ),
    },
  ];

  return (
    <SiteLayout>
      <Seo
        title="Passes Issued | Ahangama"
        description="Operational view of complimentary guest passes issued by venue."
        canonical={absUrl(PASSES_ISSUED_PATH)}
      />
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <main
        style={{
          minHeight: "100vh",
          padding: "32px 16px 72px",
          background: "#f4f0e8",
          color: "#171412",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 18,
              alignItems: "flex-end",
              marginBottom: 24,
            }}
          >
            <div>
              <Text
                style={{
                  display: "block",
                  color: "#ff6f61",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 1.8,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Complimentary Guest Passes
              </Text>
              <Title
                level={1}
                style={{
                  margin: 0,
                  color: "#171412",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: 42,
                  lineHeight: 0.98,
                  fontWeight: 700,
                }}
              >
                Passes Issued
              </Title>
              <Paragraph
                style={{
                  maxWidth: 620,
                  margin: "14px 0 0",
                  color: "#4b453e",
                  fontSize: 15,
                  lineHeight: 1.65,
                }}
              >
                Showing complimentary hotel guest passes. Use the venue buttons
                to filter the table without reloading the data.
              </Paragraph>
            </div>

            <Button
              icon={<ReloadOutlined />}
              loading={isRefreshing}
              onClick={() => loadPasses({ refreshing: true })}
              style={{ minHeight: 40, fontWeight: 700 }}
            >
              Refresh
            </Button>
          </div>

          {error ? (
            <Alert
              type="error"
              showIcon
              message="Unable to load passes"
              description={error}
              style={{ marginBottom: 18 }}
            />
          ) : null}

          <section
            style={{
              marginBottom: 18,
              padding: "14px 0",
              borderTop: "1px solid rgba(23,20,18,0.14)",
              borderBottom: "1px solid rgba(23,20,18,0.14)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Button
                type={activeVenue === "all" ? "primary" : "default"}
                onClick={() => setActiveVenue("all")}
                style={{
                  minHeight: 38,
                  fontWeight: 700,
                  background: activeVenue === "all" ? "#111" : undefined,
                  borderColor: activeVenue === "all" ? "#111" : undefined,
                }}
              >
                All venues ({passes.length})
              </Button>

              {venueFilters.map((venue) => (
                <Button
                  key={venue.sourceHotelSlug}
                  type={
                    activeVenue === venue.sourceHotelSlug ? "primary" : "default"
                  }
                  onClick={() => setActiveVenue(venue.sourceHotelSlug)}
                  style={{
                    minHeight: 38,
                    fontWeight: 700,
                    background:
                      activeVenue === venue.sourceHotelSlug ? "#111" : undefined,
                    borderColor:
                      activeVenue === venue.sourceHotelSlug ? "#111" : undefined,
                  }}
                >
                  {venue.label} ({venue.count})
                </Button>
              ))}
            </div>
          </section>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <div style={{ padding: "14px 0", borderTop: "1px solid #242424" }}>
              <Text style={{ color: "#6b665f", fontSize: 12 }}>Total</Text>
              <Title level={3} style={{ margin: "4px 0 0" }}>
                {passes.length}
              </Title>
            </div>
            <div style={{ padding: "14px 0", borderTop: "1px solid #242424" }}>
              <Text style={{ color: "#6b665f", fontSize: 12 }}>Filtered</Text>
              <Title level={3} style={{ margin: "4px 0 0" }}>
                {filteredPasses.length}
              </Title>
            </div>
            <div style={{ padding: "14px 0", borderTop: "1px solid #242424" }}>
              <Text style={{ color: "#6b665f", fontSize: 12 }}>Current Venue</Text>
              <Title level={3} style={{ margin: "4px 0 0", fontSize: 22 }}>
                {activeVenueLabel}
              </Title>
            </div>
          </div>

          {isLoading ? (
            <div
              style={{
                display: "grid",
                minHeight: 360,
                placeItems: "center",
                background: "#fff",
                border: "1px solid rgba(23,20,18,0.12)",
              }}
            >
              <Spin />
            </div>
          ) : (
            <Table
              rowKey="id"
              columns={columns}
              dataSource={filteredPasses}
              scroll={{ x: 1420 }}
              pagination={{ pageSize: 25, showSizeChanger: true }}
              bordered
              size="middle"
            />
          )}
        </div>
      </main>
    </SiteLayout>
  );
}
