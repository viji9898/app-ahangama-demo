import React, { useState, useRef, useEffect } from "react";
import { Card, Typography } from "antd";
import japaneseTeaRoomImage from "../../assets/namikaze/japanese-tea-room.jpg";
import primeAndVineImage from "../../assets/namikaze/prime-and-vine.jpg";
import sushiAtLastLightImage from "../../assets/namikaze/sushi-at-last-light.jpg";
import christmasEve01Image from "../../assets/namikaze/Christmas Eve 1080px x 1350px promo-01.jpg";
import christmasEve02Image from "../../assets/namikaze/Christmas Eve 1080px x 1350px promo-02.jpg";
import christmasEve03Image from "../../assets/namikaze/Christmas Eve 1080px x 1350px promo-03.jpg";
import christmasEve04Image from "../../assets/namikaze/Christmas Eve 1080px x 1350px promo-04.jpg";

const { Title, Paragraph, Text } = Typography;

const flyers = [
  {
    src: japaneseTeaRoomImage,
    alt: "Namikaze Japanese Tea Room promotional flyer",
  },
  {
    src: primeAndVineImage,
    alt: "Namikaze Prime & Vine promotional flyer",
  },
  {
    src: sushiAtLastLightImage,
    alt: "Namikaze Sushi at Last Light promotional flyer",
  },
  {
    src: christmasEve01Image,
    alt: "Namikaze Christmas Eve promotional flyer 1",
  },
  {
    src: christmasEve02Image,
    alt: "Namikaze Christmas Eve promotional flyer 2",
  },
  {
    src: christmasEve03Image,
    alt: "Namikaze Christmas Eve promotional flyer 3",
  },
  {
    src: christmasEve04Image,
    alt: "Namikaze Christmas Eve promotional flyer 4",
  },
];

const NamikazePartnerSpotlight = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const goTo = (index) => {
    setActiveIndex((index + flyers.length) % flyers.length);
  };

  const goNext = () => goTo(activeIndex + 1);
  const goPrev = () => goTo(activeIndex - 1);

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0].clientX;
    const difference = touchStartX.current - touchEndX;

    if (Math.abs(difference) > 40) {
      if (difference > 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    touchStartX.current = null;
  };

  useEffect(() => {
    if (isPaused) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % flyers.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <div
      data-home-section-view="partner_spotlight_namikaze"
      style={{ marginTop: 16, marginBottom: 16 }}
    >
      <Card
        style={{
          borderRadius: 20,
          border: "1px solid rgba(32,30,27,0.08)",
          background:
            "linear-gradient(180deg, rgba(251,248,242,0.96) 0%, rgba(247,243,236,0.96) 100%)",
        }}
        bodyStyle={{ padding: 20 }}
      >
        <div style={{ marginBottom: 12 }}>
          <Text
            style={{
              color: "#8B7B63",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            PARTNER SPOTLIGHT
          </Text>
          <Title
            level={3}
            style={{
              color: "#2F2A24",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginTop: 6,
              marginBottom: 4,
              fontSize: "clamp(22px, 2.4vw, 30px)",
              lineHeight: 1.05,
            }}
          >
            Namikaze Restaurant & Bar
          </Title>
          <Paragraph
            style={{
              color: "#5F574E",
              fontSize: 15,
              lineHeight: 1.6,
              marginBottom: 0,
              maxWidth: 520,
            }}
          >
            A taste of Japanese dining in Ahangama.
          </Paragraph>
        </div>

        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            position: "relative",
            maxWidth: 420,
            margin: "0 auto",
          }}
        >
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
              overflow: "hidden",
              borderRadius: 16,
              border: "1px solid rgba(32,30,27,0.08)",
              background: "#F7F3EC",
              boxShadow: "0 18px 40px rgba(32,30,27,0.12)",
            }}
          >
            <div
              style={{
                display: "flex",
                transform: `translateX(-${activeIndex * 100}%)`,
                transition: "transform 0.35s ease",
              }}
            >
              {flyers.map((flyer, index) => (
                <div
                  key={flyer.alt}
                  style={{
                    flex: "0 0 100%",
                    width: "100%",
                    aspectRatio: "4 / 5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={flyer.src}
                    alt={flyer.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous flyer"
            style={{
              position: "absolute",
              top: "50%",
              left: 8,
              transform: "translateY(-50%)",
              width: 36,
              height: 36,
              borderRadius: 999,
              border: "1px solid rgba(32,30,27,0.12)",
              background: "rgba(255,255,255,0.88)",
              color: "#2F2A24",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ‹
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next flyer"
            style={{
              position: "absolute",
              top: "50%",
              right: 8,
              transform: "translateY(-50%)",
              width: 36,
              height: 36,
              borderRadius: 999,
              border: "1px solid rgba(32,30,27,0.12)",
              background: "rgba(255,255,255,0.88)",
              color: "#2F2A24",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ›
          </button>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginTop: 12,
            }}
          >
            {flyers.map((flyer, index) => (
              <button
                key={flyer.alt}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to flyer ${index + 1}`}
                aria-current={index === activeIndex}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  background:
                    index === activeIndex
                      ? "#2F2A24"
                      : "rgba(47,42,36,0.25)",
                }}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NamikazePartnerSpotlight;
