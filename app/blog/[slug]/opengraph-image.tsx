import { renderOgImage } from "@/lib/og/template";
import { getAllPosts } from "@/lib/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Blog post by Luis Bedoya Sandries.";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = (await getAllPosts()).find((p) => p.slug === slug);
  return renderOgImage({
    eyebrow: post?.publishedDate
      ? `BLOG · ${dateFmt.format(new Date(post.publishedDate)).toUpperCase()}`
      : "BLOG",
    title: (post?.title ?? "Blog").toUpperCase(),
    subtitle: "BY LUIS BEDOYA SANDRIES",
    titleSize: 46,
  });
}
