import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { getAllPosts, getPost } from "@/lib/posts";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Luis Bedoya Sandries`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.publishedDate ?? undefined,
    },
  };
}

const fmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

/** Prose styling in theme tokens — the MDX renders through this map. */
const components = {
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="mt-10 text-lg font-semibold tracking-tight" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="mt-8 text-base font-semibold" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="mt-4 text-sm leading-relaxed text-ink/90" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
      {...props}
    />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mt-4 space-y-2 pl-1 text-sm leading-relaxed text-ink/90" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol
      className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink/90"
      {...props}
    />
  ),
  li: (props: React.ComponentProps<"li">) => <li {...props} />,
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="mt-4 border-l-2 border-accent pl-4 text-sm italic leading-relaxed text-accent-soft"
      {...props}
    />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code
      className="rounded bg-panel-raised px-1.5 py-0.5 font-mono text-[0.85em]"
      {...props}
    />
  ),
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="mt-4 overflow-x-auto rounded-xl border border-edge bg-panel p-4 text-xs leading-relaxed"
      {...props}
    />
  ),
  hr: (props: React.ComponentProps<"hr">) => (
    <hr className="mt-8 border-edge" {...props} />
  ),
  img: (props: React.ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="mt-4 h-auto max-w-full rounded-xl" alt="" {...props} />
  ),
};

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const content = await post.content();

  return (
    <div className="h-full overflow-y-auto bg-canvas">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/blog"
          className="text-xs text-accent-soft transition-colors hover:text-ink"
        >
          ← All posts
        </Link>
        <header className="mt-6">
          {post.publishedDate && (
            <p className="font-mono text-[11px] text-accent-soft">
              {fmt.format(new Date(post.publishedDate))}
            </p>
          )}
          <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight">
            {post.title}
          </h1>
          {post.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <li
                  key={t}
                  className="rounded border border-edge bg-panel-raised px-1.5 py-0.5 font-mono text-[10px] text-accent-soft"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}
        </header>
        <div className="mt-8 border-t border-edge pt-2">
          <MDXRemote source={content} components={components} />
        </div>
      </article>
    </div>
  );
}
