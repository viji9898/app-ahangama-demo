import React, { useState } from "react";
import { Button, Drawer, Space, Tag, Tooltip, Typography } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import "../../styles/blog-workspace.css";

const { Text, Title } = Typography;

function BlogSidebar({ posts, activeSlug, onSelect }) {
  return (
    <div className="blog-sidebarInner">
      <div className="blog-brandBlock">
        <div className="blog-brandMark">BL</div>
        <div>
          <Text className="blog-eyebrow">Editorial Collection</Text>
          <Title level={4} className="blog-brandTitle">
            Ahangama Blogs
          </Title>
        </div>
      </div>

      <div className="blog-sidebarMeta">
        <Tag className="blog-metaTag">Local Guides</Tag>
        <Tag className="blog-metaTag">SEO Articles</Tag>
      </div>

      <nav className="blog-nav" aria-label="Blog posts">
        {posts.map((post, index) => {
          const isActive = post.slug === activeSlug;

          return (
            <Tooltip
              key={post.slug}
              title={`${post.category} · ${post.readingTime}`}
              placement="right"
              mouseEnterDelay={0.15}
            >
              <button
                className={`blog-navItem${isActive ? " is-active" : ""}`}
                type="button"
                onClick={() => onSelect(post.slug)}
                aria-label={post.title}
              >
                <span className="blog-navIndex">{`0${index + 1}`.slice(-2)}</span>
                <span className="blog-navText">
                  <span className="blog-navLabel">{post.title}</span>
                  <span className="blog-navHint">{post.category}</span>
                </span>
              </button>
            </Tooltip>
          );
        })}
      </nav>
    </div>
  );
}

export default function BlogWorkspaceLayout({
  posts,
  activeSlug,
  onSelectPost,
  lastUpdated,
  children,
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const activePost = posts.find((post) => post.slug === activeSlug) || null;

  const handleSelectPost = (slug) => {
    setMobileNavOpen(false);
    onSelectPost(slug);
  };

  return (
    <div className="blog-shell">
      <aside className="blog-sidebar blog-sidebarDesktop">
        <BlogSidebar
          posts={posts}
          activeSlug={activeSlug}
          onSelect={handleSelectPost}
        />
      </aside>

      <div className="blog-mainPane">
        <header className="blog-topbar">
          <Space size={12} align="center">
            <Button
              className="blog-menuButton"
              icon={<MenuOutlined />}
              onClick={() => setMobileNavOpen(true)}
            >
              Posts
            </Button>
            <div>
              <Text className="blog-topbarLabel">Ahangama stories and guides</Text>
              <div className="blog-topbarStatusRow">
                <Tag className="blog-statusTag">
                  {activePost?.category || "Blog"}
                </Tag>
                <Text className="blog-topbarMeta">Updated {lastUpdated}</Text>
              </div>
            </div>
          </Space>
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
          posts={posts}
          activeSlug={activeSlug}
          onSelect={handleSelectPost}
        />
      </Drawer>
    </div>
  );
}