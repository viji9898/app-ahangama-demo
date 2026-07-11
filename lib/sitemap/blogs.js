import { BLOG_POSTS } from "../../src/data/blogs.js";
import { createSitemapEntry, extractImageUrls, fileLastmod } from "./utils.js";

export async function generateBlogsSitemap({ siteUrl, rootDir }) {
  const fallbackLastmod = fileLastmod(rootDir, "src/data/blogs.js");

  return BLOG_POSTS.filter((post) => post.slug).map((post) =>
    createSitemapEntry({
      pathname: `/blogs/${post.slug}`,
      siteUrl,
      lastmod: post.updatedAt || post.updated_at || post.publishDate || fallbackLastmod,
      images: extractImageUrls(post, siteUrl),
    }),
  );
}
