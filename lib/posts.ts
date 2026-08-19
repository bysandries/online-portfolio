import { cache } from "react";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "@/keystatic.config";

/** File-system reader over content/posts/*.mdx — works with or without the CMS. */
const reader = createReader(process.cwd(), keystaticConfig);

export interface PostListing {
  slug: string;
  title: string;
  publishedDate: string;
  summary: string;
  tags: readonly string[];
}

export const getAllPosts = cache(async (): Promise<PostListing[]> => {
  const posts = await reader.collections.posts.all();
  return posts
    .map(({ slug, entry }) => ({
      slug,
      title: entry.title,
      publishedDate: entry.publishedDate ?? "",
      summary: entry.summary,
      tags: entry.tags,
    }))
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
});

export const getPost = cache(async (slug: string) => {
  return reader.collections.posts.read(slug);
});
