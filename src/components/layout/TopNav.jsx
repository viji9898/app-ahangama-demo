import React, { useMemo, useState } from "react";
import { Button, Drawer, Grid, Space, Typography } from "antd";
import { HeartOutlined, MenuOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { trackPassCtaClick } from "../../analytics";
import { buildPassCtaUrl } from "../../lib/passAttribution";
import palmTreeIcon from "../../assets/receipt_icons/palm-tree-icon.svg";
import ahangamaPassLogo from "../../assets/ahangama-pass-logo.png";

const { Text } = Typography;
const { useBreakpoint } = Grid;

export default function TopNav() {
  const loc = useLocation();
  const passCtaUrl = buildPassCtaUrl();
  const screens = useBreakpoint();
  const isDesktop = !!screens.xl;
  const isMobile = !screens.md;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = useMemo(() => [{ label: "Offers", to: "/offers" }], []);

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
          background: "rgba(247,243,236,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(32,30,27,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: isDesktop ? "18px 28px" : "14px 16px",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            justifyContent: "space-between",
            gap: isDesktop ? 22 : 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
              width: "100%",
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
                minWidth: 0,
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
                  fontFamily:
                    '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                  fontSize: isDesktop ? 29 : 20,
                  letterSpacing: isDesktop ? 1.8 : 1.1,
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
                  justifyContent: "flex-end",
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
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Link
                  to="/offers"
                  aria-label="Offers"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 38,
                    height: 38,
                    color: "#1F1D1A",
                    flexShrink: 0,
                  }}
                >
                  <HeartOutlined style={{ fontSize: 21 }} />
                </Link>

                <Button
                  type="text"
                  aria-label="Open menu"
                  icon={<MenuOutlined style={{ fontSize: 22 }} />}
                  onClick={() => setMobileNavOpen(true)}
                  style={{
                    width: 38,
                    height: 38,
                    color: "#1F1D1A",
                    flexShrink: 0,
                  }}
                />
              </div>
            )}
          </div>

          {isDesktop ? (
            <Space size={14} align="center" style={{ flexShrink: 0 }}>
              <a
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
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={ahangamaPassLogo}
                  alt="Ahangama Pass"
                  style={{
                    display: "block",
                    height: 52,
                    width: "auto",
                  }}
                />
              </a>

              <Link
                to="/offers"
                aria-label="Offers"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  color: "#1F1D1A",
                }}
              >
                <HeartOutlined style={{ fontSize: 22 }} />
              </Link>

              <Button
                type="text"
                aria-label="Open menu"
                icon={<MenuOutlined style={{ fontSize: 26 }} />}
                onClick={() => setMobileNavOpen(true)}
                style={{
                  width: 40,
                  height: 40,
                  color: "#1F1D1A",
                }}
              />
            </Space>
          ) : null}
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
