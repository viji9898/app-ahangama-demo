import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Input, Spin, Table, Tag, Typography } from "antd";
import { Helmet } from "react-helmet-async";
import { LinkOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";

const { Paragraph, Text, Title } = Typography;

export const INTERACTIONS_PATH = "/interactions";

const INTERACTIONS_ENDPOINT = "/.netlify/functions/interactions";

const VENUE_LABELS = {
  "lighthouse-hotel": "Lighthouse Hotel",
  kaffi: "Kaffi",
  gusta: "Gusta",
  tahini: "Tahini & Friends",
  "living-room": "Living Room",
  unknown: "Unknown Venue",
};

const TYPE_LABELS = {
  email_sent: "Email Sent",
  email_click: "Email Click",
  venue_interaction: "Venue",
  article_interaction: "Article",
  experience_interaction: "Experience",
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

function formatType(type) {
  return TYPE_LABELS[type] || type || "Unknown";
}

function formatDetail(interaction) {
  return [
    interaction.interactionType,
    interaction.contentType,
    interaction.contentId,
  ]
    .filter(Boolean)
    .join(" / ");
}

function buildFilterOptions(items, key, formatter) {
  const counts = new Map();

  items.forEach((item) => {
    const value = item[key] || "unknown";
    counts.set(value, (counts.get(value) || 0) + 1);
  });

  return [...counts.entries()]
    .map(([value, count]) => ({ value, count, label: formatter(value) }))
    .sort(
      (left, right) =>
        right.count - left.count || left.label.localeCompare(right.label),
    );
}

function buildGuestProfiles(interactions) {
  const profileMap = new Map();

  interactions.forEach((interaction) => {
    const guestId = interaction.guest?.id || "unknown";
    const current = profileMap.get(guestId) || {
      id: guestId,
      guest: interaction.guest,
      sourceHotelSlug: interaction.sourceHotelSlug,
      passIds: new Set(),
      verificationCodes: new Set(),
      totalInteractions: 0,
      emailSends: 0,
      emailClicks: 0,
      contentInteractions: 0,
      lastInteractionAt: null,
      lastInteractionType: null,
      campaigns: new Set(),
      content: new Set(),
    };

    current.totalInteractions += 1;

    if (interaction.type === "email_sent") {
      current.emailSends += 1;
    } else if (interaction.type === "email_click") {
      current.emailClicks += 1;
    } else {
      current.contentInteractions += 1;
    }

    if (interaction.pass?.id) {
      current.passIds.add(interaction.pass.id);
    }

    if (interaction.pass?.verificationCode) {
      current.verificationCodes.add(interaction.pass.verificationCode);
    }

    if (interaction.campaign) {
      current.campaigns.add(interaction.campaign);
    }

    if (interaction.contentId) {
      current.content.add(interaction.contentId);
    }

    if (
      interaction.eventAt &&
      (!current.lastInteractionAt ||
        new Date(interaction.eventAt) > new Date(current.lastInteractionAt))
    ) {
      current.lastInteractionAt = interaction.eventAt;
      current.lastInteractionType = interaction.type;
    }

    profileMap.set(guestId, current);
  });

  return [...profileMap.values()]
    .map((profile) => ({
      ...profile,
      passIds: [...profile.passIds],
      verificationCodes: [...profile.verificationCodes],
      campaigns: [...profile.campaigns],
      content: [...profile.content],
    }))
    .sort((left, right) => {
      const leftTime = left.lastInteractionAt
        ? new Date(left.lastInteractionAt).getTime()
        : 0;
      const rightTime = right.lastInteractionAt
        ? new Date(right.lastInteractionAt).getTime()
        : 0;

      return rightTime - leftTime;
    });
}

function textMatches(value, query) {
  return String(value || "").toLowerCase().includes(query);
}

export default function InteractionsPage() {
  const [interactions, setInteractions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [activeVenue, setActiveVenue] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [activeGuestId, setActiveGuestId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadInteractions = async ({ refreshing = false } = {}) => {
    if (refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError(null);

    try {
      const response = await fetch(INTERACTIONS_ENDPOINT);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to load interactions");
      }

      setInteractions(Array.isArray(data.interactions) ? data.interactions : []);
      setSummary(data.summary || null);
    } catch (nextError) {
      setError(nextError.message || "Unable to load interactions");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadInteractions();
  }, []);

  const venueFilters = useMemo(
    () => buildFilterOptions(interactions, "sourceHotelSlug", formatVenueLabel),
    [interactions],
  );

  const typeFilters = useMemo(
    () => buildFilterOptions(interactions, "type", formatType),
    [interactions],
  );

  const filteredInteractions = useMemo(
    () =>
      interactions.filter((interaction) => {
        const venueMatches =
          activeVenue === "all" ||
          (interaction.sourceHotelSlug || "unknown") === activeVenue;
        const typeMatches =
          activeType === "all" || (interaction.type || "unknown") === activeType;

        return venueMatches && typeMatches;
      }),
    [activeType, activeVenue, interactions],
  );

  const guestProfiles = useMemo(
    () => buildGuestProfiles(filteredInteractions),
    [filteredInteractions],
  );

  const searchedGuestProfiles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return guestProfiles;
    }

    return guestProfiles.filter((profile) => {
      const searchableValues = [
        profile.guest?.fullName,
        profile.guest?.email,
        profile.guest?.phone,
        profile.sourceHotelSlug,
        ...profile.verificationCodes,
        ...profile.campaigns,
        ...profile.content,
      ];

      return searchableValues.some((value) => textMatches(value, normalizedQuery));
    });
  }, [guestProfiles, searchQuery]);

  useEffect(() => {
    if (searchedGuestProfiles.length === 0) {
      setActiveGuestId(null);
      return;
    }

    if (!searchedGuestProfiles.some((profile) => profile.id === activeGuestId)) {
      setActiveGuestId(searchedGuestProfiles[0].id);
    }
  }, [activeGuestId, searchedGuestProfiles]);

  const selectedGuest = useMemo(
    () =>
      searchedGuestProfiles.find((profile) => profile.id === activeGuestId) ||
      searchedGuestProfiles[0] ||
      null,
    [activeGuestId, searchedGuestProfiles],
  );

  const selectedGuestInteractions = useMemo(() => {
    if (!selectedGuest) {
      return [];
    }

    return filteredInteractions.filter(
      (interaction) => (interaction.guest?.id || "unknown") === selectedGuest.id,
    );
  }, [filteredInteractions, selectedGuest]);

  const guestColumns = [
    {
      title: "Guest",
      key: "guest",
      fixed: "left",
      width: 260,
      render: (_, profile) => (
        <div>
          <Text strong>{profile.guest?.fullName || "Unknown guest"}</Text>
          <Text style={{ display: "block", color: "#6b665f", fontSize: 12 }}>
            {profile.guest?.email || "No email"}
          </Text>
          {profile.guest?.phone ? (
            <Text style={{ display: "block", color: "#8a8178", fontSize: 12 }}>
              {profile.guest.phone}
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
      render: formatVenueLabel,
    },
    {
      title: "Engagement",
      key: "engagement",
      width: 250,
      render: (_, profile) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <Tag color="blue">{profile.totalInteractions} total</Tag>
          <Tag>{profile.emailSends} sent</Tag>
          <Tag color={profile.emailClicks > 0 ? "green" : "default"}>
            {profile.emailClicks} clicks
          </Tag>
          <Tag color={profile.contentInteractions > 0 ? "purple" : "default"}>
            {profile.contentInteractions} content
          </Tag>
        </div>
      ),
    },
    {
      title: "Last Interaction",
      key: "lastInteraction",
      width: 220,
      render: (_, profile) => (
        <div>
          <Text>{formatDate(profile.lastInteractionAt)}</Text>
          <Text style={{ display: "block", color: "#6b665f", fontSize: 12 }}>
            {formatType(profile.lastInteractionType)}
          </Text>
        </div>
      ),
    },
    {
      title: "Signals",
      key: "signals",
      width: 280,
      render: (_, profile) => (
        <div>
          <Text style={{ display: "block", color: "#4b453e", fontSize: 12 }}>
            Campaigns: {profile.campaigns.slice(0, 3).join(", ") || "-"}
          </Text>
          <Text style={{ display: "block", color: "#6b665f", fontSize: 12 }}>
            Content: {profile.content.slice(0, 3).join(", ") || "-"}
          </Text>
        </div>
      ),
    },
  ];

  const eventColumns = [
    {
      title: "Time",
      dataIndex: "eventAt",
      key: "eventAt",
      width: 170,
      render: formatDate,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (type) => <Tag>{formatType(type)}</Tag>,
    },
    {
      title: "Interaction",
      key: "interaction",
      width: 320,
      render: (_, interaction) => (
        <div>
          <Text>{formatDetail(interaction) || "-"}</Text>
          {interaction.campaign || interaction.source ? (
            <Text style={{ display: "block", color: "#6b665f", fontSize: 12 }}>
              {[interaction.campaign, interaction.source].filter(Boolean).join(" / ")}
            </Text>
          ) : null}
        </div>
      ),
    },
    {
      title: "Pass",
      key: "pass",
      width: 190,
      render: (_, interaction) => (
        <div>
          <Tag color={interaction.pass?.status === "active" ? "green" : "default"}>
            {interaction.pass?.status || "unmatched"}
          </Tag>
          <Text style={{ display: "block", color: "#6b665f", fontSize: 12 }}>
            {interaction.pass?.verificationCode || interaction.pass?.id || "No pass"}
          </Text>
        </div>
      ),
    },
    {
      title: "Destination",
      dataIndex: "destinationUrl",
      key: "destinationUrl",
      width: 240,
      render: (destinationUrl) =>
        destinationUrl ? (
          <a href={destinationUrl} target="_blank" rel="noreferrer">
            <LinkOutlined /> Open click target
          </a>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
  ];

  return (
    <SiteLayout>
      <Seo
        title="Guest Interactions | Ahangama"
        description="Guest-level view of email clicks and pass interactions."
        canonical={absUrl(INTERACTIONS_PATH)}
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
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
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
                Guest Intelligence
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
                Guest Interactions
              </Title>
              <Paragraph
                style={{
                  maxWidth: 700,
                  margin: "14px 0 0",
                  color: "#4b453e",
                  fontSize: 15,
                  lineHeight: 1.65,
                }}
              >
                Recognise each guest by their issued pass and see how they are
                engaging with emails, offers, venue links, articles, and guides.
              </Paragraph>
            </div>

            <Button
              icon={<ReloadOutlined />}
              loading={isRefreshing}
              onClick={() => loadInteractions({ refreshing: true })}
              style={{ minHeight: 40, fontWeight: 700 }}
            >
              Refresh
            </Button>
          </div>

          {error ? (
            <Alert
              type="error"
              showIcon
              message="Unable to load interactions"
              description={error}
              style={{ marginBottom: 18 }}
            />
          ) : null}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <div style={{ padding: "14px 0", borderTop: "1px solid #242424" }}>
              <Text style={{ color: "#6b665f", fontSize: 12 }}>Guests</Text>
              <Title level={3} style={{ margin: "4px 0 0" }}>
                {summary?.uniqueGuests || guestProfiles.length}
              </Title>
            </div>
            <div style={{ padding: "14px 0", borderTop: "1px solid #242424" }}>
              <Text style={{ color: "#6b665f", fontSize: 12 }}>Events</Text>
              <Title level={3} style={{ margin: "4px 0 0" }}>
                {summary?.total || interactions.length}
              </Title>
            </div>
            <div style={{ padding: "14px 0", borderTop: "1px solid #242424" }}>
              <Text style={{ color: "#6b665f", fontSize: 12 }}>Email Clicks</Text>
              <Title level={3} style={{ margin: "4px 0 0" }}>
                {summary?.emailClicks || 0}
              </Title>
            </div>
            <div style={{ padding: "14px 0", borderTop: "1px solid #242424" }}>
              <Text style={{ color: "#6b665f", fontSize: 12 }}>
                Visible Guests
              </Text>
              <Title level={3} style={{ margin: "4px 0 0" }}>
                {searchedGuestProfiles.length}
              </Title>
            </div>
          </div>

          <section
            style={{
              marginBottom: 18,
              padding: "14px 0",
              borderTop: "1px solid rgba(23,20,18,0.14)",
              borderBottom: "1px solid rgba(23,20,18,0.14)",
            }}
          >
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Search guest, email, phone, pass code, campaign, or content"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              style={{ maxWidth: 520, minHeight: 40, marginBottom: 12 }}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
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
                All venues ({interactions.length})
              </Button>
              {venueFilters.map((venue) => (
                <Button
                  key={venue.value}
                  type={activeVenue === venue.value ? "primary" : "default"}
                  onClick={() => setActiveVenue(venue.value)}
                  style={{
                    minHeight: 38,
                    fontWeight: 700,
                    background: activeVenue === venue.value ? "#111" : undefined,
                    borderColor: activeVenue === venue.value ? "#111" : undefined,
                  }}
                >
                  {venue.label} ({venue.count})
                </Button>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 12,
              }}
            >
              <Button
                type={activeType === "all" ? "primary" : "default"}
                onClick={() => setActiveType("all")}
                style={{
                  minHeight: 38,
                  fontWeight: 700,
                  background: activeType === "all" ? "#111" : undefined,
                  borderColor: activeType === "all" ? "#111" : undefined,
                }}
              >
                All interactions ({interactions.length})
              </Button>
              {typeFilters.map((type) => (
                <Button
                  key={type.value}
                  type={activeType === type.value ? "primary" : "default"}
                  onClick={() => setActiveType(type.value)}
                  style={{
                    minHeight: 38,
                    fontWeight: 700,
                    background: activeType === type.value ? "#111" : undefined,
                    borderColor: activeType === type.value ? "#111" : undefined,
                  }}
                >
                  {type.label} ({type.count})
                </Button>
              ))}
            </div>
          </section>

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
            <div style={{ display: "grid", gap: 18 }}>
              <section>
                <Title level={2} style={{ fontSize: 24, margin: "0 0 12px" }}>
                  Guests
                </Title>
                <Table
                  rowKey="id"
                  columns={guestColumns}
                  dataSource={searchedGuestProfiles}
                  scroll={{ x: 1180 }}
                  pagination={{ pageSize: 10, showSizeChanger: true }}
                  bordered
                  size="middle"
                  rowClassName={(profile) =>
                    profile.id === selectedGuest?.id ? "ant-table-row-selected" : ""
                  }
                  onRow={(profile) => ({
                    onClick: () => setActiveGuestId(profile.id),
                    style: { cursor: "pointer" },
                  })}
                />
              </section>

              <section>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "flex-end",
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <Title level={2} style={{ fontSize: 24, margin: 0 }}>
                      {selectedGuest?.guest?.fullName || "Guest Timeline"}
                    </Title>
                    <Text style={{ color: "#6b665f" }}>
                      {selectedGuest?.guest?.email ||
                        "Select a guest to inspect their activity."}
                    </Text>
                  </div>
                  {selectedGuest ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      <Tag color="blue">
                        {selectedGuest.totalInteractions} interactions
                      </Tag>
                      <Tag color="green">
                        {selectedGuest.emailClicks} email clicks
                      </Tag>
                      <Tag>{formatVenueLabel(selectedGuest.sourceHotelSlug)}</Tag>
                    </div>
                  ) : null}
                </div>
                <Table
                  rowKey="id"
                  columns={eventColumns}
                  dataSource={selectedGuestInteractions}
                  scroll={{ x: 1080 }}
                  pagination={{ pageSize: 10, showSizeChanger: true }}
                  bordered
                  size="middle"
                />
              </section>
            </div>
          )}
        </div>
      </main>
    </SiteLayout>
  );
}