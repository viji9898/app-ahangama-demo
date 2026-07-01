import React from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Space, Typography } from "antd";
import { Link } from "react-router-dom";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import guideImage from "../assets/ahangama-scan-to-get-guide.jpg";
import kaffiImage from "../assets/temp/kaffi_image.jpg";

const { Paragraph, Text, Title } = Typography;

const LIVING_ROOM_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/hero-the-living-room-concept-store.jpeg";

export const VENUE_COMING_SOON_PAGES = {
  kaffi: {
    path: "/kaffi",
    title: "Kaffi",
    eyebrow: "Coffee, food and daily rituals",
    image: kaffiImage,
    imageAlt: "Kaffi in Ahangama",
  },
  gusta: {
    path: "/gusta",
    title: "Gusta",
    eyebrow: "Local offer page in progress",
    image: guideImage,
    imageAlt: "Ahangama guide display",
  },
  tahini: {
    path: "/tahini",
    title: "Tahini & Friends",
    eyebrow: "Restaurant guide coming soon",
    image: guideImage,
    imageAlt: "Ahangama guide display",
  },
  livingRoom: {
    path: "/living-Room",
    title: "Living Room",
    eyebrow: "Concept store page in progress",
    image: LIVING_ROOM_IMAGE,
    imageAlt: "The Living Room Concept Store showroom",
  },
};

export default function VenueComingSoonPage({ venue }) {
  const canonical = absUrl(venue.path);
  const description = `${venue.title} is coming soon to Ahangama.com, with venue details, local context, and guest pass information.`;

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title={`${venue.title} | Coming Soon`}
        description={description}
        canonical={canonical}
        ogImage={venue.image}
      />

      <style>{`
        @media (max-width: 820px) {
          .venue-coming-soon-grid {
            grid-template-columns: 1fr !important;
          }

          .venue-coming-soon-copy {
            padding: 92px 24px 40px !important;
          }

          .venue-coming-soon-media {
            min-height: 42svh !important;
            order: -1;
          }
        }
      `}</style>

      <main
        style={{
          minHeight: "100svh",
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
          background: "#F7F3EC",
        }}
      >
        <section
          className="venue-coming-soon-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.92fr) minmax(0, 1.08fr)",
            minHeight: "100svh",
          }}
        >
          <div
            className="venue-coming-soon-copy"
            style={{
              display: "flex",
              alignItems: "center",
              padding:
                "clamp(92px, 11vw, 148px) clamp(24px, 6vw, 86px) clamp(44px, 7vw, 88px)",
              background: "#FFFFFF",
            }}
          >
            <div style={{ maxWidth: 620 }}>
              <Text
                style={{
                  display: "block",
                  marginBottom: 18,
                  color: "#9B4E3F",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 1.8,
                  textTransform: "uppercase",
                }}
              >
                {venue.eyebrow}
              </Text>

              <Title
                style={{
                  margin: 0,
                  color: "#231F20",
                  fontFamily:
                    '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                  fontSize: "clamp(56px, 9vw, 116px)",
                  fontWeight: 500,
                  lineHeight: 0.92,
                  letterSpacing: 0,
                }}
              >
                {venue.title}
              </Title>

              <Title
                level={2}
                style={{
                  margin: "18px 0 0",
                  color: "#231F20",
                  fontFamily:
                    '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                  fontSize: "clamp(30px, 4.8vw, 58px)",
                  fontWeight: 500,
                  lineHeight: 1.02,
                  letterSpacing: 0,
                }}
              >
                Coming soon
              </Title>

              <Paragraph
                style={{
                  maxWidth: 520,
                  margin: "24px 0 0",
                  color: "#4B463F",
                  fontSize: 18,
                  lineHeight: 1.7,
                }}
              >
                We are preparing a dedicated Ahangama.com page with the right
                details, imagery, local context, and pass information.
              </Paragraph>

              <Space size={12} wrap style={{ marginTop: 32 }}>
                <Button
                  type="primary"
                  size="large"
                  href="/map"
                  icon={<ArrowRightOutlined />}
                  style={{
                    background: "#231F20",
                    borderColor: "#231F20",
                    borderRadius: 0,
                    fontWeight: 800,
                  }}
                >
                  Open Map
                </Button>
                <Link to="/guide">
                  <Button
                    size="large"
                    style={{
                      borderColor: "#231F20",
                      borderRadius: 0,
                      color: "#231F20",
                      fontWeight: 800,
                    }}
                  >
                    View Guide
                  </Button>
                </Link>
              </Space>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="venue-coming-soon-media"
            style={{
              position: "relative",
              minHeight: "100svh",
              overflow: "hidden",
              background: "#231F20",
            }}
          >
            <img
              src={venue.image}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                opacity: 0.9,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(35,31,32,0.08) 0%, rgba(35,31,32,0.48) 100%)",
              }}
            />
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
