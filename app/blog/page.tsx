import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog — Luis Bedoya Sandries",
  description:
    "Writing on automation, process optimization, and the international-student experience.",
};

const fmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <div className="h-full overflow-y-auto bg-canvas">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Notes on automation, process optimization, and navigating school and
          work as an international student.
        </p>

        <div className="mt-8 space-y-5">
          {posts.map((p) => (
            <article key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group block rounded-xl border border-edge bg-panel p-6 transition-colors hover:border-accent"
              >
                <p className="font-mono text-[11px] text-accent-soft">
                  {fmt.format(new Date(p.publishedDate))}
                </p>
                <h2 className="mt-2 text-base font-semibold leading-snug group-hover:text-accent">
                  {p.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {p.summary}
                </p>
                {p.tags.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded border border-edge bg-panel-raised px-1.5 py-0.5 font-mono text-[10px] text-accent-soft"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
