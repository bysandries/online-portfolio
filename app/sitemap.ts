import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

const BASE = "https://sandries.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    "/",
    "/projects",
    "/designs",
    "/blog",
    "/experience",
    "/education",
    "/about",
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const posts = (await getAllPosts()).map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.publishedDate ? new Date(p.publishedDate) : undefined,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...pages, ...posts];
}
