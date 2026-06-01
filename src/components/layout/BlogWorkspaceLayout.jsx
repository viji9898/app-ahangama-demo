import React, { useState } from "react";
import { Button, Drawer, Typography } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import "../../styles/blog-workspace.css";

const { Text, Title } = Typography;

function BlogSidebar({ issueItems, activeSlug, onSelect }) {
  return (
    <div className="blog-sidebarInner">
      <div className="blog-brandBlock">
        <div className="blog-brandMark">AS</div>
        <div>
          <Text className="blog-eyebrow">Ahangama Stories</Text>
          <Title level={4} className="blog-brandTitle">
            Issue Index
          </Title>
        </div>
      </div>

      <Text className="blog-sidebarIntro">
        A more editorial contents page of slow guides, visitor journals, local
        profiles, and travel features from Ahangama.
      </Text>

      <div className="blog-sidebarSectionHeader">
        <Text className="blog-sidebarSectionLabel">Contents</Text>
        <Text className="blog-sidebarSectionCount">
          {`${issueItems.length}`.padStart(2, "0")} stories
        </Text>
      </div>

      <nav className="blog-contentsList" aria-label="Story index">
        {issueItems.map((item) => {
          const isActive = item.slug === activeSlug;

          return (
            <button
              key={item.slug}
              className={`blog-contentsItem${isActive ? " is-active" : ""}`}
              type="button"
              onClick={() => onSelect(item.slug)}
              aria-label={item.title}
            >
              <span className="blog-contentsNumber">{item.number}</span>
              <span className="blog-contentsThumbWrap">
                <img
                  className="blog-contentsThumb"
                  src={item.thumbnail}
                  alt=""
                  aria-hidden="true"
                />
              </span>
              <span className="blog-contentsMeta">
                <span className="blog-contentsCategory">{item.category}</span>
                <span className="blog-contentsTitle">{item.title}</span>
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function BlogFilterBar({ filters, activeFilter, onSelectFilter }) {
  return (
    <div className="blog-filterBar" role="tablist" aria-label="Story filters">
      {filters.map((filter) => {
        const isActive = filter.key === activeFilter;

        return (
          <button
            key={filter.key}
            type="button"
            className={`blog-filterChip${isActive ? " is-active" : ""}`}
            onClick={() => onSelectFilter(filter.key)}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

export default function BlogWorkspaceLayout({
  issueItems,
  filteredIssueItems,
  activeSlug,
  filters,
  activeFilter,
  onSelectFilter,
  onSelectPost,
  lastUpdated,
  children,
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const activePost =
    issueItems.find((post) => post.slug === activeSlug) || null;

  const handleSelectPost = (slug) => {
    setMobileNavOpen(false);
    onSelectPost(slug);
  };

  return (
    <div className="blog-shell">
      <aside className="blog-sidebar blog-sidebarDesktop">
        <BlogSidebar
          issueItems={filteredIssueItems}
          activeSlug={activeSlug}
          onSelect={handleSelectPost}
        />
      </aside>

      <div className="blog-mainPane">
        <header className="blog-topbar">
          <div className="blog-topbarRow">
            <Button
              className="blog-menuButton"
              icon={<MenuOutlined />}
              onClick={() => setMobileNavOpen(true)}
            >
              Issue Index
            </Button>
            <div>
              <Text className="blog-topbarLabel">Ahangama Stories</Text>
              <div className="blog-topbarStatusRow">
                <Text className="blog-topbarCategory">
                  {activePost?.category || "Editorial archive"}
                </Text>
                <span className="blog-topbarDivider" />
                <Text className="blog-topbarMeta">Updated {lastUpdated}</Text>
              </div>
            </div>
          </div>

          <BlogFilterBar
            filters={filters}
            activeFilter={activeFilter}
            onSelectFilter={onSelectFilter}
          />
        </header>

        <main className="blog-content">{children}</main>
      </div>

      <Drawer
        placement="left"
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        className="blog-drawer"
        width={320}
        title={null}
      >
        <BlogSidebar
          issueItems={filteredIssueItems}
          activeSlug={activeSlug}
          onSelect={handleSelectPost}
        />
      </Drawer>
    </div>
  );
}
