import React, { useEffect, useState } from "react";
import { Button, Drawer, Space, Tag, Tooltip, Typography } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import "../../styles/concept-workspace.css";

const { Text, Title } = Typography;

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);

  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ConceptSidebar({
  sections,
  activeSection,
  onSelect,
  shortcutActions,
}) {
  return (
    <div className="concept-sidebarInner">
      <div className="concept-brandBlock">
        <div className="concept-brandMark">AP</div>
        <div>
          <Text className="concept-eyebrow">Internal Workspace</Text>
          <Title level={4} className="concept-brandTitle">
            Ahangama Pass
          </Title>
        </div>
      </div>

      <div className="concept-sidebarMeta">
        <Tag className="concept-metaTag">Concept</Tag>
        <Tag className="concept-metaTag">Team Alignment</Tag>
      </div>

      {shortcutActions.length ? (
        <div className="concept-shortcutRow">
          {shortcutActions.map((action) => (
            <a
              key={action.key}
              href={action.href}
              className={`concept-shortcutButton${action.isActive ? " is-active" : ""}`}
            >
              {action.label}
            </a>
          ))}
        </div>
      ) : null}

      <nav className="concept-nav" aria-label="Concept page sections">
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
                onClick={() => onSelect(section.id)}
                aria-label={`${section.label}: ${section.hint}`}
              >
                <span className="concept-navIndex">
                  {`0${index + 1}`.slice(-2)}
                </span>
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
  );
}

export default function ConceptWorkspaceLayout({
  sections,
  children,
  status = "Planning",
  lastUpdated = "Today",
  shortcutActions = [],
}) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  return (
    <div className="concept-shell">
      <aside className="concept-sidebar concept-sidebarDesktop">
        <ConceptSidebar
          sections={sections}
          activeSection={activeSection}
          onSelect={handleSelectSection}
          shortcutActions={shortcutActions}
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
              Sections
            </Button>
            <div>
              <Text className="concept-topbarLabel">Project workspace</Text>
              <div className="concept-topbarStatusRow">
                <Tag className="concept-statusTag">{status}</Tag>
                <Text className="concept-topbarMeta">
                  Updated {lastUpdated}
                </Text>
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
        <ConceptSidebar
          sections={sections}
          activeSection={activeSection}
          onSelect={handleSelectSection}
          shortcutActions={shortcutActions}
        />
      </Drawer>
    </div>
  );
}
