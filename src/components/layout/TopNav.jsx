import React, { useMemo, useState } from "react";
import { Button, Drawer, Grid, Space, Typography } from "antd";
import { HeartOutlined, MenuOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { trackPassCtaClick } from "../../analytics";
import { buildPassCtaUrl } from "../../lib/passAttribution";
import palmTreeIcon from "../../assets/receipt_icons/palm-tree-icon.svg";

const { Text } = Typography;
const { useBreakpoint } = Grid;

export default function TopNav() {
  const loc = useLocation();
  const passCtaUrl = buildPassCtaUrl();
  const screens = useBreakpoint();
  const isDesktop = !!screens.xl;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { label: "Eat & Drink", to: "/eat" },
      { label: "Stays", to: "/stays" },
      { label: "Experiences", to: "/12-things" },
      { label: "Surf", to: "/12-things" },
      { label: "Wellness", to: "/wellness" },
      { label: "Guides", to: "/blogs" },
      { label: "Local Life", to: "/master-index" },
      { label: "Offers", to: "/offers" },
    ],
    [],
  );

  const isActive = (to) => {
    if (to === "/") return loc.pathname === "/";
    return loc.pathname === to || loc.pathname.startsWith(`${to}/`);
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(255,251,246,0.94)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(47,62,58,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: isDesktop ? "18px 28px" : "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: isDesktop ? 22 : 14,
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#1F1D1A",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <img
              src={palmTreeIcon}
              alt="Ahangama palm mark"
              style={{
                width: isDesktop ? 28 : 22,
                height: isDesktop ? 28 : 22,
                objectFit: "contain",
                display: "block",
              }}
            />
            <span
              style={{
                fontFamily: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                fontSize: isDesktop ? 29 : 22,
                letterSpacing: isDesktop ? 1.8 : 1.2,
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              AHANGAMA
            </span>
          </Link>

          {isDesktop ? (
            <nav
              aria-label="Primary"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
                flex: 1,
                minWidth: 0,
              }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  style={{
                    textDecoration: "none",
                    color: isActive(item.to) ? "#1F1D1A" : "#2D2B28",
                    fontSize: 14,
                    fontWeight: isActive(item.to) ? 700 : 600,
                    letterSpacing: 0.1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : (
            <div style={{ flex: 1 }} />
          )}

          <Space size={isDesktop ? 14 : 10} align="center" style={{ flexShrink: 0 }}>
            <Button
              href={passCtaUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackPassCtaClick({
                  ctaLocation: "top_nav",
                  destinationUrl: passCtaUrl,
                });
              }}
              style={{
                height: isDesktop ? 52 : 42,
                paddingInline: isDesktop ? 26 : 16,
                borderRadius: 999,
                border: "none",
                background: "#E9D9BF",
                color: "#1F1D1A",
                boxShadow: "none",
                fontWeight: 700,
                fontSize: isDesktop ? 15 : 14,
              }}
            >
              Ahangama Pass
            </Button>

            <Link
              to="/offers"
              aria-label="Offers"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: isDesktop ? 40 : 38,
                height: isDesktop ? 40 : 38,
                color: "#1F1D1A",
              }}
            >
              <HeartOutlined style={{ fontSize: isDesktop ? 22 : 21 }} />
            </Link>

            <Button
              type="text"
              aria-label="Open menu"
              icon={<MenuOutlined style={{ fontSize: isDesktop ? 26 : 22 }} />}
              onClick={() => setMobileNavOpen(true)}
              style={{
                width: isDesktop ? 40 : 38,
                height: isDesktop ? 40 : 38,
                color: "#1F1D1A",
              }}
            />
          </Space>
        </div>
      </header>

      <Drawer
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src={palmTreeIcon}
              alt="Ahangama palm mark"
              style={{ width: 20, height: 20, objectFit: "contain" }}
            />
            <Text style={{ color: "#1F1D1A", fontWeight: 700 }}>Ahangama</Text>
          </div>
        }
        placement="right"
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        width={320}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setMobileNavOpen(false)}
              style={{
                textDecoration: "none",
                color: "#1F1D1A",
                fontSize: 16,
                fontWeight: isActive(item.to) ? 700 : 600,
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </Drawer>
    </>
  );
}
