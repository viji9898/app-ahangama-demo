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

function JournalExperienceSection({ experience }) {
	return (
		<section className="blog-journalSection blog-journalExperienceSection">
			<div className="blog-journalExperienceHeader">
				<Text className="blog-journalSectionEyebrow">{`${experience.index} · ${experience.venue}`}</Text>
				<Title level={2} className="blog-journalSectionTitle">
					{experience.title}
				</Title>
			</div>

			<figure className="blog-journalFigure">
				<EditorialImage src={experience.image} alt={experience.title} />
			</figure>

			<Paragraph className="blog-journalCopy">
				{experience.description}
			</Paragraph>

			<div className="blog-journalPriceRow">
				<div className="blog-journalPriceItem">
					<Text className="blog-pricingLabel">Average experience price</Text>
					<Text className="blog-pricingValue">{experience.retailPrice}</Text>
				</div>
				<div className="blog-journalPriceItem">
					<Text className="blog-pricingLabel">With the Ahangama Pass</Text>
					<Text className="blog-pricingValue blog-pricingValueAccent">
						{experience.passPrice}
					</Text>
				</div>
			</div>

			<div className="blog-journalExperienceFooter">
				<Tag className="blog-passBadge">{experience.passLabel}</Tag>
				<Button className="blog-secondaryButton" href="/partners">
					View Venue
				</Button>
			</div>
		</section>
	);
}

function FeaturedEditorialPost({ post }) {
	return (
		<article className="blog-editorialPage blog-journalPage">
			<section className="blog-heroPanel blog-journalHero">
				<img
					className="blog-heroImage"
					src={post.heroImage}
					alt={post.title}
					loading="eager"
				/>
				<div className="blog-heroOverlay" />
				<div className="blog-heroContent blog-journalHeroContent">
					<div className="blog-heroMetaRow">
						<Tag className="blog-heroPill">Blog</Tag>
						<Tag className="blog-heroPill">2026 Guide</Tag>
					</div>
					<Title level={1} className="blog-editorialTitle blog-editorialTitleWide">
						{post.title}
					</Title>
					<Paragraph className="blog-editorialSubtitle">
						{post.heroSubtitle}
					</Paragraph>
					<div className="blog-journalMetaBar">
						<Text>{formatDate(post.publishDate)}</Text>
						<span className="blog-journalMetaDot" />
						<Text>{post.readingTime}</Text>
						<span className="blog-journalMetaDot" />
						<Text>{post.author}</Text>
					</div>
				</div>
			</section>

			<Card className="blog-card blog-introCard blog-journalIntroCard" bordered={false}>
				<Breadcrumb className="blog-breadcrumb">
					<Breadcrumb.Item>
						<a href="/">Ahangama</a>
					</Breadcrumb.Item>
					<Breadcrumb.Item>
						<a href="/blogs">Blogs</a>
					</Breadcrumb.Item>
					<Breadcrumb.Item>{post.shortTitle || post.title}</Breadcrumb.Item>
				</Breadcrumb>

				<Row gutter={[30, 30]} align="middle">
					<Col xs={24} md={14}>
						<Text className="blog-articleEyebrow">From the journal</Text>
						<Title level={2} className="blog-introTitle">
							{post.introTitle}
						</Title>
						{post.introColumns.map((paragraph) => (
							<Paragraph key={paragraph} className="blog-journalCopy">
								{paragraph}
							</Paragraph>
						))}
					</Col>
					<Col xs={24} md={10}>
						<EditorialImage
							src={post.introImage}
							alt={post.introTitle}
							className="blog-introImage blog-journalIntroImage"
						/>
					</Col>
				</Row>

				{post.pullQuote ? (
					<div className="blog-pullQuote blog-journalPullQuote">{post.pullQuote}</div>
				) : null}
			</Card>

			<div className="blog-journalBody">
				{post.experiences.map((experience) => (
					<JournalExperienceSection
						key={experience.index}
						experience={experience}
					/>
				))}
			</div>

			<section className="blog-journalAside">
				<Text className="blog-journalAsideEyebrow">Ahangama Pass</Text>
				<Title level={3} className="blog-journalAsideTitle">
					{post.passSection.title}
				</Title>
				<Paragraph className="blog-journalCopy">{post.passSection.body}</Paragraph>
				<Paragraph className="blog-journalCopy">
					{post.passSection.supporting}
				</Paragraph>
				<Button type="link" className="blog-journalLinkButton" href="/card">
					{post.passSection.ctaLabel}
				</Button>
			</section>

			<section className="blog-journalClosing">
				<Text className="blog-journalSectionEyebrow">Closing thought</Text>
				<Title level={2} className="blog-journalSectionTitle">
					{post.closingSection.title}
				</Title>
				{post.closingSection.body.map((paragraph) => (
					<Paragraph key={paragraph} className="blog-journalCopy">
						{paragraph}
					</Paragraph>
				))}
				<div className="blog-journalClosingActions">
					<Button className="blog-primaryButton" href="/">
						{post.closingSection.ctaLabel}
					</Button>
					<Button className="blog-secondaryButton" href="/blogs">
						More articles
					</Button>
				</div>
			</section>

			<footer className="blog-editorialFooter blog-journalFooter">
				<Text className="blog-footerBrand">Ahangama.com</Text>
				<div className="blog-footerLinks">
					{post.footerLinks.map((link) => (
						<a key={link.label} href={link.href} className="blog-footerLink">
							{link.label}
						</a>
					))}
				</div>
			</footer>
		</article>
	);
}

function StorySection({ section }) {
	const layoutClass = `blog-storySection blog-storySection--${section.layout}`;

	return (
		<section className={layoutClass}>
			{section.image ? (
				<div className="blog-storyMedia">
					<EditorialImage src={section.image} alt={section.title} />
				</div>
			) : null}

			<div className="blog-storyBody">
				<Text className="blog-articleEyebrow">{section.eyebrow}</Text>
				<Title level={2} className="blog-storyTitle">
					{section.title}
				</Title>

				{section.paragraphs.map((paragraph) => (
					<Paragraph key={paragraph} className="blog-sectionCopy">
						{paragraph}
					</Paragraph>
				))}

				{section.quote ? (
					<blockquote className="blog-storyQuote">{section.quote}</blockquote>
				) : null}

				{section.stats?.length ? (
					<div className="blog-storyStats">
						{section.stats.map((stat) => (
							<div key={stat} className="blog-storyStatCard">
								{stat}
							</div>
						))}
					</div>
				) : null}

				{section.gallery?.length ? (
					<div className="blog-storyGallery">
						{section.gallery.map((item) => (
							<figure key={item.label} className="blog-storyGalleryItem">
								<EditorialImage src={item.image} alt={item.label} />
								<figcaption>{item.label}</figcaption>
							</figure>
						))}
					</div>
				) : null}
			</div>
		</section>
	);
}

function JournalStorySection({ section }) {
	return (
		<section className="blog-journalSection">
			<Text className="blog-journalSectionEyebrow">{section.eyebrow}</Text>
			<Title level={2} className="blog-journalSectionTitle">
				{section.title}
			</Title>

			{section.image ? (
				<figure className="blog-journalFigure">
					<EditorialImage src={section.image} alt={section.title} />
				</figure>
			) : null}

			{section.paragraphs.map((paragraph) => (
				<Paragraph key={paragraph} className="blog-journalCopy">
					{paragraph}
				</Paragraph>
			))}

			{section.quote ? (
				<blockquote className="blog-journalQuote">{section.quote}</blockquote>
			) : null}

			{section.stats?.length ? (
				<div className="blog-journalNotes">
					<Text className="blog-journalNotesLabel">Scene notes</Text>
					<p className="blog-journalNotesCopy">{section.stats.join(" · ")}</p>
				</div>
			) : null}

			{section.gallery?.length ? (
				<div className="blog-journalGallery">
					{section.gallery.map((item) => (
						<figure key={item.label} className="blog-journalGalleryItem">
							<EditorialImage src={item.image} alt={item.label} />
							<figcaption>{item.label}</figcaption>
						</figure>
					))}
				</div>
			) : null}
		</section>
	);
}

function CoastalTownEditorialPost({ post }) {
	return (
		<article className="blog-editorialPage blog-journalPage">
			<section className="blog-heroPanel blog-journalHero">
				<img
					className="blog-heroImage"
					src={post.heroImage}
					alt={post.title}
					loading="eager"
				/>
				<div className="blog-heroOverlay" />
				<div className="blog-heroContent blog-journalHeroContent">
					<div className="blog-heroMetaRow">
						<Tag className="blog-heroPill">Blog</Tag>
						<Tag className="blog-heroPill">Ahangama Journal</Tag>
					</div>
					<Title level={1} className="blog-editorialTitle blog-editorialTitleWide">
						{post.title}
					</Title>
					<Paragraph className="blog-editorialSubtitle">
						{post.heroSubtitle}
					</Paragraph>
					<div className="blog-journalMetaBar">
						<Text>{formatDate(post.publishDate)}</Text>
						<span className="blog-journalMetaDot" />
						<Text>{post.readingTime}</Text>
						<span className="blog-journalMetaDot" />
						<Text>{post.author}</Text>
					</div>
				</div>
			</section>

			<Card className="blog-card blog-introCard blog-journalIntroCard" bordered={false}>
				<Breadcrumb className="blog-breadcrumb">
					<Breadcrumb.Item>
						<a href="/">Ahangama</a>
					</Breadcrumb.Item>
					<Breadcrumb.Item>
						<a href="/blogs">Blogs</a>
					</Breadcrumb.Item>
					<Breadcrumb.Item>{post.shortTitle || post.title}</Breadcrumb.Item>
				</Breadcrumb>

				<Row gutter={[30, 30]} align="middle">
					<Col xs={24} md={14}>
						<Text className="blog-articleEyebrow">From the journal</Text>
						<Title level={2} className="blog-introTitle">
							{post.introTitle}
						</Title>
						{post.introColumns.map((paragraph) => (
							<Paragraph key={paragraph} className="blog-journalCopy">
								{paragraph}
							</Paragraph>
						))}
					</Col>
					<Col xs={24} md={10}>
						<EditorialImage
							src={post.introImage}
							alt={post.introTitle}
							className="blog-introImage blog-journalIntroImage"
						/>
					</Col>
				</Row>

				<div className="blog-pullQuote blog-journalPullQuote">{post.pullQuote}</div>
			</Card>

			<div className="blog-journalBody">
				{post.storySections.map((section) => (
					<JournalStorySection key={section.title} section={section} />
				))}
			</div>

			<section className="blog-journalAside">
				<Text className="blog-journalAsideEyebrow">Ahangama Pass</Text>
				<Title level={3} className="blog-journalAsideTitle">
					{post.passSection.title}
				</Title>
				<Paragraph className="blog-journalCopy">{post.passSection.body}</Paragraph>
				<Paragraph className="blog-journalCopy">
					{post.passSection.supporting}
				</Paragraph>
				<Button type="link" className="blog-journalLinkButton" href="/card">
					{post.passSection.ctaLabel}
				</Button>
			</section>

			<section className="blog-journalClosing">
				<Text className="blog-journalSectionEyebrow">Closing thought</Text>
				<Title level={2} className="blog-journalSectionTitle">
					{post.closingSection.title}
				</Title>
				{post.closingSection.body.map((paragraph) => (
					<Paragraph key={paragraph} className="blog-journalCopy">
						{paragraph}
					</Paragraph>
				))}
				<div className="blog-journalClosingActions">
					<Button className="blog-primaryButton" href="/">
						{post.closingSection.ctaLabel}
					</Button>
					<Button className="blog-secondaryButton" href="/blogs">
						More articles
					</Button>
				</div>
			</section>

			<footer className="blog-editorialFooter blog-journalFooter">
				<Text className="blog-footerBrand">Ahangama.com</Text>
				<div className="blog-footerLinks">
					{post.footerLinks.map((link) => (
						<a key={link.label} href={link.href} className="blog-footerLink">
							{link.label}
						</a>
					))}
				</div>
			</footer>
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
				) : activePost.editorialType === "coastal-town-story" ? (
					<CoastalTownEditorialPost post={activePost} />
				) : activePost.experiences ? (
					<FeaturedEditorialPost post={activePost} />
				) : (
					<StandardBlogPost activePost={activePost} />
				)}
			</BlogWorkspaceLayout>
		</>
	);
}
