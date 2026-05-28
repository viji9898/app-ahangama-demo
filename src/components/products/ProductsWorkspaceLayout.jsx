import React, { useEffect, useMemo, useState } from "react";
import { Button, Drawer, Space, Tag, Tooltip, Typography } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/concept-workspace.css";

const { Text, Title } = Typography;

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);

  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ProductsSidebar({
  products,
  activeProductSlug,
  sections,
  activeSection,
  onSelectSection,
  onSelectProduct,
}) {
  return (
    <div className="concept-sidebarInner">
      <div className="concept-brandBlock">
        <div className="concept-brandMark">AH</div>
        <div>
          <Text className="concept-eyebrow">Products</Text>
          <Title level={4} className="concept-brandTitle">
            Ahangama
          </Title>
        </div>
      </div>

      <div>
        <Text className="concept-sectionEyebrow">Product list</Text>
        <nav className="concept-nav" aria-label="Products">
          {products.map((product, index) => {
            const isActive = product.slug === activeProductSlug;

            return (
              <Tooltip
                key={product.key}
                title={product.description}
                placement="right"
                mouseEnterDelay={0.15}
              >
                <button
                  className={`concept-navItem${isActive ? " is-active" : ""}`}
                  type="button"
                  onClick={() => onSelectProduct(product.href)}
                  aria-label={`${product.navLabel}: ${product.description}`}
                >
                  <span className="concept-navIndex">{`0${index + 1}`.slice(-2)}</span>
                  <span className="concept-navText">
                    <span className="concept-navLabel">{product.navLabel}</span>
                    <span className="concept-navHint">{product.description}</span>
                  </span>
                </button>
              </Tooltip>
            );
          })}
        </nav>
      </div>

      <div>
        <Text className="concept-sectionEyebrow">Sections</Text>
        <nav className="concept-nav" aria-label="Product page sections">
          {sections.map((section, index) => {
            const isActive = section.id === activeSection;

            return (
              <Tooltip
                key={section.id}
                title={section.hint}
                placement="right"
                mouseEnterDelay={0.15}
              >
                <button
                  className={`concept-navItem${isActive ? " is-active" : ""}`}
                  type="button"
                  onClick={() => onSelectSection(section.id)}
                  aria-label={`${section.label}: ${section.hint}`}
                >
                  <span className="concept-navIndex">{`0${index + 1}`.slice(-2)}</span>
                  <span className="concept-navText">
                    <span className="concept-navLabel">{section.label}</span>
                    <span className="concept-navHint">{section.hint}</span>
                  </span>
                </button>
              </Tooltip>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default function ProductsWorkspaceLayout({
  products,
  sections,
  children,
  status = "Active",
  lastUpdated = "Today",
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeProductSlug = useMemo(() => {
    const prefix = "/product/";

    if (!location.pathname.startsWith(prefix)) {
      return "";
    }

    const slug = location.pathname.slice(prefix.length).split("/")[0] || "";
    return slug;
  }, [location.pathname]);

  useEffect(() => {
    setActiveSection(sections[0]?.id || "");
  }, [sections]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    if (targets.length === 0) {
      return undefined;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) => right.intersectionRatio - left.intersectionRatio,
          )[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-18% 0px -56% 0px",
        threshold: [0.15, 0.4, 0.7],
      },
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [sections]);

  const handleSelectSection = (sectionId) => {
    setActiveSection(sectionId);
    setMobileNavOpen(false);
    scrollToSection(sectionId);
  };

  const handleSelectProduct = (href) => {
    setMobileNavOpen(false);
    navigate(href);
  };

  return (
    <div className="concept-shell">
      <aside className="concept-sidebar concept-sidebarDesktop">
        <ProductsSidebar
          products={products}
          activeProductSlug={activeProductSlug}
          sections={sections}
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
          onSelectProduct={handleSelectProduct}
        />
      </aside>

      <div className="concept-mainPane">
        <header className="concept-topbar">
          <Space size={12} align="center">
            <Button
              className="concept-menuButton"
              icon={<MenuOutlined />}
              onClick={() => setMobileNavOpen(true)}
            >
              Menu
            </Button>
            <div>
              <Text className="concept-topbarLabel">Product details</Text>
              <div className="concept-topbarStatusRow">
                <Tag className="concept-statusTag">{status}</Tag>
                <Text className="concept-topbarMeta">Updated {lastUpdated}</Text>
              </div>
            </div>
          </Space>
        </header>

        <main className="concept-content">{children}</main>
      </div>

      <Drawer
        placement="left"
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        className="concept-drawer"
        width={320}
        title={null}
      >
        <ProductsSidebar
          products={products}
          activeProductSlug={activeProductSlug}
          sections={sections}
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
          onSelectProduct={handleSelectProduct}
        />
      </Drawer>
    </div>
  );
}
