import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, Button, Card, Col, Row, Tag, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import BlogWorkspaceLayout from "../components/layout/BlogWorkspaceLayout";
import { BLOG_POSTS, getBlogPostBySlug } from "../data/blogs";

const { Paragraph, Text, Title } = Typography;

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(value) {
  return dateFormatter.format(new Date(value));
}

function EditorialImage({ src, alt, className = "" }) {
  return (
    <div className={`blog-editorialImage ${className}`.trim()}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}

function ExperienceSection({ experience }) {
  const layoutClass = `blog-experience blog-experience--${experience.layout}`;

  return (
    <section className={layoutClass}>
      <div className="blog-experienceMedia">
        <EditorialImage src={experience.image} alt={experience.title} />
      </div>

      <div className="blog-experienceBody">
        <Text className="blog-experienceIndex">{experience.index}</Text>
        <Title level={2} className="blog-experienceTitle">
          {experience.title}
        </Title>
        <Text className="blog-experienceVenue">{experience.venue}</Text>
        <Paragraph className="blog-sectionCopy">
          {experience.description}
        </Paragraph>

        <div className="blog-pricingStrip">
          <div className="blog-pricingMeta">
            <Text className="blog-pricingLabel">Average experience price</Text>
            <Text className="blog-pricingValue">{experience.retailPrice}</Text>
          </div>
          <div className="blog-pricingDivider" />
          <div className="blog-pricingMeta">
            <Text className="blog-pricingLabel">With the Ahangama Pass</Text>
            <Text className="blog-pricingValue blog-pricingValueAccent">
              {experience.passPrice}
            </Text>
          </div>
        </div>

        <div className="blog-experienceActions">
          <Tag className="blog-passBadge">{experience.passLabel}</Tag>
          <Button className="blog-secondaryButton" href="/partners">
            View Venue
          </Button>
        </div>
      </div>
    </section>
  );
}

function FeaturedEditorialPost({ post }) {
  return (
    <article className="blog-editorialPage">
      <section className="blog-heroPanel">
        <img
          className="blog-heroImage"
          src={post.heroImage}
          alt={post.title}
          loading="eager"
        />
        <div className="blog-heroOverlay" />
        <div className="blog-heroContent">
          <div className="blog-heroMetaRow">
            <Tag className="blog-heroPill">2026 Guide</Tag>
            <Tag className="blog-heroPill">Free Pass • Unlock Local Perks</Tag>
          </div>
          <Title level={1} className="blog-editorialTitle">
            12 Must-Do Things in Ahangama
          </Title>
          <Paragraph className="blog-editorialSubtitle">
            {post.heroSubtitle}
          </Paragraph>
        </div>
      </section>

      <Card className="blog-card blog-introCard" bordered={false}>
        <Breadcrumb className="blog-breadcrumb">
          <Breadcrumb.Item>
            <a href="/">Ahangama</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/blogs">Blogs</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{post.shortTitle || post.title}</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[28, 28]} align="middle">
          <Col xs={24} md={12}>
            <Text className="blog-articleEyebrow">Editorial Guide</Text>
            <Title level={2} className="blog-introTitle">
              {post.introTitle}
            </Title>
            {post.introColumns.map((paragraph) => (
              <Paragraph key={paragraph} className="blog-sectionCopy">
                {paragraph}
              </Paragraph>
            ))}
          </Col>
          <Col xs={24} md={12}>
            <EditorialImage
              src={post.introImage}
              alt={post.introTitle}
              className="blog-introImage"
            />
          </Col>
        </Row>
      </Card>

      <div className="blog-experienceStack">
        {post.experiences.map((experience) => (
          <ExperienceSection key={experience.index} experience={experience} />
        ))}
      </div>

      <section className="blog-passSection">
        <div className="blog-passGradient" />
        <div className="blog-passCopy">
          <Text className="blog-articleEyebrow">Ahangama Pass</Text>
          <Title level={2} className="blog-passTitle">
            {post.passSection.title}
          </Title>
          <Paragraph className="blog-sectionCopy">
            {post.passSection.body}
          </Paragraph>
          <Paragraph className="blog-sectionCopy">
            {post.passSection.supporting}
          </Paragraph>
          <Button type="primary" className="blog-primaryButton" href="/card">
            {post.passSection.ctaLabel}
          </Button>
        </div>
        <div className="blog-passVisual">
          <div className="blog-passMockup">
            <Text className="blog-passMockupLabel">Ahangama Pass</Text>
            <Title level={3} className="blog-passMockupTitle">
              Free Digital Companion
            </Title>
            <div className="blog-passMockupChips">
              <Tag className="blog-pill">Wellness</Tag>
              <Tag className="blog-pill">Dining</Tag>
              <Tag className="blog-pill">Experiences</Tag>
              <Tag className="blog-pill">Shopping</Tag>
            </div>
          </div>
          <div className="blog-passFloatingCard">
            Along the way, the free Ahangama Pass unlocks curated perks and
            benefits across the south coast.
          </div>
        </div>
      </section>

      <section className="blog-closingSection">
        <EditorialImage
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
          alt={post.closingSection.title}
          className="blog-closingImage"
        />
        <div className="blog-closingCopy">
          <Text className="blog-articleEyebrow">Slow Coastal Living</Text>
          <Title level={2} className="blog-closingTitle">
            {post.closingSection.title}
          </Title>
          {post.closingSection.body.map((paragraph) => (
            <Paragraph key={paragraph} className="blog-sectionCopy">
              {paragraph}
            </Paragraph>
          ))}
          <Button className="blog-primaryButton" href="/">
            {post.closingSection.ctaLabel}
          </Button>
        </div>
      </section>

      <footer className="blog-editorialFooter">
        <Text className="blog-footerBrand">Ahangama.com</Text>
        <div className="blog-footerLinks">
          {post.footerLinks.map((link) => (
            <a key={link.label} href={link.href} className="blog-footerLink">
              {link.label}
            </a>
          ))}
        </div>
      </footer>

      <a className="blog-floatingCta" href="/card">
        Unlock Free Pass
      </a>
    </article>
  );
}

function StandardBlogPost({ activePost }) {
  return (
    <article>
      <Card className="blog-card blog-heroCard" bordered={false}>
        <Breadcrumb style={{ marginBottom: 18 }}>
          <Breadcrumb.Item>
            <a href="/">Ahangama</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/blogs">Blogs</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{activePost.title}</Breadcrumb.Item>
        </Breadcrumb>

        <Text className="blog-articleEyebrow">{activePost.category}</Text>
        <Title level={1} className="blog-articleTitle">
          {activePost.title}
        </Title>
        <Paragraph className="blog-articleCopy">{activePost.excerpt}</Paragraph>

        <div className="blog-pillRow">
          <Tag className="blog-pill">{formatDate(activePost.publishDate)}</Tag>
          <Tag className="blog-pill">{activePost.readingTime}</Tag>
          <Tag className="blog-pill">{activePost.author}</Tag>
        </div>
      </Card>

      {activePost.sections.map((section, index) => (
        <section key={section.heading} className="blog-section">
          <Card className="blog-card blog-sectionCard" bordered={false}>
            <Text className="blog-articleEyebrow">Section {index + 1}</Text>
            <Title level={2} className="blog-sectionTitle">
              {section.heading}
            </Title>

            {section.paragraphs.map((paragraph) => (
              <Paragraph key={paragraph} className="blog-sectionCopy">
                {paragraph}
              </Paragraph>
            ))}

            {section.bullets?.length ? (
              <ul className="blog-bulletList">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </Card>
        </section>
      ))}
    </article>
  );
}

export default function BlogsPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const defaultPost = BLOG_POSTS[0] || null;
  const activePost = slug ? getBlogPostBySlug(slug) : defaultPost;
  const isNotFound = Boolean(slug && !activePost);

  const handleSelectPost = (nextSlug) => {
    navigate(`/blogs/${nextSlug}`);
  };

  if (!defaultPost) {
    return null;
  }

  const canonical = !slug || !activePost
    ? absUrl("/blogs")
    : absUrl(`/blogs/${activePost.slug}`);

  const jsonLd =
    slug && activePost
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: activePost.title,
          description: activePost.description,
          datePublished: activePost.publishDate,
          dateModified: activePost.publishDate,
          mainEntityOfPage: canonical,
          url: canonical,
          articleSection: activePost.category,
          author: {
            "@type": "Organization",
            name: activePost.author,
          },
          publisher: {
            "@type": "Organization",
            name: "ahangama.com",
          },
        }
      : null;

  return (
    <>
      <Seo
        title={
          slug && activePost
            ? `${activePost.title} — Ahangama Blogs`
            : "Ahangama Blogs — Stories, Guides, and Local Articles"
        }
        description={
          slug && activePost
            ? activePost.description
            : "Editorial guides, local stories, and practical travel articles about Ahangama."
        }
        canonical={canonical}
        jsonLd={jsonLd}
      />

      <BlogWorkspaceLayout
        posts={BLOG_POSTS}
        activeSlug={activePost?.slug || defaultPost.slug}
        onSelectPost={handleSelectPost}
        lastUpdated={formatDate((activePost || defaultPost).publishDate)}
      >
        {isNotFound ? (
          <Card className="blog-card blog-emptyCard" bordered={false}>
            <Text className="blog-articleEyebrow">Blogs</Text>
            <Title level={1} className="blog-articleTitle">
              Article not found
            </Title>
            <Paragraph className="blog-emptyCopy">
              The article you tried to open does not exist. Choose a post from
              the left navigation or return to the main blog hub.
            </Paragraph>
            <Button type="primary" icon={<ArrowLeftOutlined />} href="/blogs">
              Back to blogs
            </Button>
          </Card>
        ) : (
          activePost.experiences ? (
            <FeaturedEditorialPost post={activePost} />
          ) : (
            <StandardBlogPost activePost={activePost} />
          )
        )}
      </BlogWorkspaceLayout>
    </>
  );
}