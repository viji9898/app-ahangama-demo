import React, { useRef } from "react";
import { Button, Card, Row, Space, Tag, Typography } from "antd";
import {
  ArrowRightOutlined,
  CarOutlined,
  EnvironmentOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

const { Paragraph, Text, Title } = Typography;

const GUIDE_PATH = "/getting-around-ahangama-scooters-tuk-tuks-airport-transfers";

const cards = [
  {
    key: "gik",
    title: "GIK Bike Rentals",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/gik_bike_rental.jpg",
    copy:
      "Rental-led option for scooters, bikes, and independent day-to-day movement around Ahangama.",
    pricing: "Recommended: LKR 2,500-4,500 per day",
  },
  {
    key: "happy-tours",
    title: "Happy Tours",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/happy_tours.jpeg",
    copy:
      "Convenience-first local transport support for simple rides, short planning help, and nearby moves.",
    pricing: "Recommended: LKR 500-1,500 in-town hops",
  },
  {
    key: "nova",
    title: "Nova Rent a Car",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/nova_rental.jpeg",
    copy:
      "Best fit for Galle day trips, Hiriketiya runs, and longer south-coast travel where a car makes more sense than a scooter.",
    pricing: "Recommended: LKR 12,000-20,000+ per day",
  },
  {
    key: "scooty",
    title: "Scooty Rental & Taxi Service",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/scooty_rental_and_taxi.jpeg",
    copy:
      "Strong local-mobility choice for scooter-led stays, quick surf checks, and easy movement around town.",
    pricing: "Recommended: LKR 2,500-4,500 per day",
  },
  {
    key: "airport",
    title: "Taxi and Transport Tours",
    image:
      "https://ahangama-pass.s3.eu-west-2.amazonaws.com/venues/taxi-and-transport-tours/image.jpg",
    copy:
      "Clearest airport-transfer and private-trip specialist in the current Ahangama transport set.",
    pricing: "Recommended: LKR 18,000-30,000 airport transfer",
  },
];

export default function GettingAroundSection() {
  const railRef = useRef(null);

  function scrollRail(direction) {
    if (!railRef.current) return;

    railRef.current.scrollBy({
      left: direction * 320,
      behavior: "smooth",
    });
  }

  return (
    <div
      style={{
        borderRadius: 28,
        border: "1px solid rgba(47,62,58,0.08)",
        background: "linear-gradient(180deg, #fffdf9 0%, #f6efe5 100%)",
        boxShadow: "0 18px 40px rgba(47,62,58,0.05)",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: 26 }}>
        <Space wrap size={[10, 10]} style={{ marginBottom: 10 }}>
          <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>New Guide</Tag>
          <Text style={{ color: "#7A746B", fontSize: 13 }}>
            Practical transport editorial
          </Text>
        </Space>

        <Row gutter={[18, 18]} align="middle" justify="space-between">
          <div style={{ flex: 1, minWidth: 0 }}>
            <Title level={2} style={{ margin: 0, color: "#2F3E3A" }}>
              Getting Around Ahangama: Scooters, Tuk Tuks & Airport Transfers
            </Title>
            <Paragraph
              style={{
                margin: "10px 0 0",
                color: "#5B564E",
                fontSize: 15,
                maxWidth: 760,
              }}
            >
              A practical guide to how transport actually works here, from scooter
              rentals and tuk-tuk pricing to airport transfers, Galle day trips,
              and when it makes sense to book a car instead.
            </Paragraph>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Space size={10} wrap>
              <Button
                aria-label="Scroll transport cards left"
                icon={<LeftOutlined />}
                onClick={() => scrollRail(-1)}
                style={{ borderRadius: 999 }}
              />
              <Button
                aria-label="Scroll transport cards right"
                icon={<RightOutlined />}
                onClick={() => scrollRail(1)}
                style={{ borderRadius: 999 }}
              />
              <Button
                type="primary"
                size="large"
                href={GUIDE_PATH}
                icon={<ArrowRightOutlined />}
                style={{
                  borderRadius: 999,
                  height: 44,
                  paddingInline: 18,
                  background: "#2F3E3A",
                  borderColor: "#2F3E3A",
                  boxShadow: "none",
                }}
              >
                View full guide
              </Button>
            </Space>
          </div>
        </Row>
      </div>

      <div style={{ padding: "0 26px 26px" }}>
        <div
          ref={railRef}
          style={{
            display: "flex",
            gap: 18,
            overflowX: "auto",
            paddingBottom: 8,
            scrollSnapType: "x proximity",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "thin",
          }}
        >
          {cards.map((card) => (
            <div
              key={card.key}
              style={{
                flex: "0 0 clamp(220px, calc((100% - 54px) / 3.5), 320px)",
                scrollSnapAlign: "start",
              }}
            >
              <Card
                hoverable
                bodyStyle={{ padding: 0 }}
                style={{
                  height: "100%",
                  borderRadius: 22,
                  overflow: "hidden",
                  border: "1px solid rgba(47,62,58,0.08)",
                  background: "#fffaf3",
                  boxShadow: "0 14px 28px rgba(47,62,58,0.08)",
                }}
              >
                <a
                  href={GUIDE_PATH}
                  style={{ display: "block", color: "inherit", textDecoration: "none", height: "100%" }}
                >
                  <div
                    style={{
                      height: 220,
                      backgroundImage: `linear-gradient(180deg, rgba(18,25,24,0.04) 0%, rgba(18,25,24,0.42) 100%), url(${card.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div style={{ padding: 18 }}>
                    <Space align="center" size={8} style={{ marginBottom: 10 }}>
                      {card.key === "airport" ? (
                        <EnvironmentOutlined style={{ color: "#8B5A3C" }} />
                      ) : (
                        <CarOutlined style={{ color: "#8B5A3C" }} />
                      )}
                      <Text
                        style={{
                          color: "#8B5A3C",
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 1.3,
                        }}
                      >
                        Recommended pricing
                      </Text>
                    </Space>
                    <Title level={3} style={{ marginTop: 0, marginBottom: 10, color: "#2F3E3A", fontSize: 22 }}>
                      {card.title}
                    </Title>
                    <Paragraph style={{ color: "#59534B", minHeight: 96, marginBottom: 10 }}>
                      {card.copy}
                    </Paragraph>
                    <Text style={{ color: "#2F3E3A", fontWeight: 700 }}>
                      {card.pricing}
                    </Text>
                  </div>
                </a>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}