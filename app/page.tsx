import Link from "next/link";
import config from "@/config/projects.json";
import flyersConfig from "@/config/flyers.json";
import type { FlyersConfig, PortfolioConfig } from "@/config/types";

/**
 * Landing page: hero + featured work + section links. The full project
 * explorer (master-detail with live demos) lives at /projects.
 */
export default function Home() {
  const { profile, projects } = config as PortfolioConfig;
  const featured = projects.filter((p) => p.category === "featured");
  const featuredFlyers = (flyersConfig as FlyersConfig).flyers.filter(
    (f) => f.featured,
  );

  return (
    <div className="h-full overflow-y-auto bg-canvas">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-24">
        {profile.tagline && (
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            {profile.tagline}
          </p>
        )}
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Luis <span className="text-accent">Bedoya Sandries</span>
        </h1>
        <p className="mt-3 text-lg text-accent-soft">
          {profile.headline} · {profile.location}
        </p>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
          {profile.bio}
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {profile.credentials.map((c) => (
            <li
              key={c}
              className="rounded-md border border-edge bg-panel px-3 py-1.5 font-mono text-[11px] text-accent-soft"
            >
              {c}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/projects"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-canvas transition-colors hover:bg-accent-hover"
          >
            Explore the projects →
          </Link>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-edge bg-panel px-4 py-2 text-sm text-accent-soft transition-colors hover:border-accent hover:text-ink"
          >
            GitHub
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-edge bg-panel px-4 py-2 text-sm text-accent-soft transition-colors hover:border-accent hover:text-ink"
          >
            LinkedIn
          </a>
          <a
            href={profile.links.email}
            className="rounded-md border border-edge bg-panel px-4 py-2 text-sm text-accent-soft transition-colors hover:border-accent hover:text-ink"
          >
            Email
          </a>
        </div>
      </section>

      {/* Featured dev projects */}
      <section className="border-t border-edge bg-panel/40">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted">
              Featured Projects
            </h2>
            <Link
              href="/projects"
              className="text-xs text-accent-soft transition-colors hover:text-ink"
            >
              All projects →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <Link
                key={p.id}
                href={`/projects?project=${p.id}`}
                className="group flex flex-col rounded-xl border border-edge bg-panel p-5 transition-colors hover:border-accent"
              >
                <h3 className="text-sm font-semibold leading-snug group-hover:text-accent">
                  {p.title}
                </h3>
                <p className="mt-1 text-xs text-accent-soft">{p.tagline}</p>
                <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted">
                  {p.description}
                </p>
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
                  {p.tech.slice(0, 4).map((t) => (
                    <li
                      key={t}
                      className="rounded border border-edge bg-panel-raised px-1.5 py-0.5 font-mono text-[10px] text-accent-soft"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured designs */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted">
            Featured Designs
          </h2>
          <Link
            href="/designs"
            className="text-xs text-accent-soft transition-colors hover:text-ink"
          >
            Open the board →
          </Link>
        </div>
        <Link
          href="/designs"
          className="group mt-6 flex flex-wrap items-start justify-center gap-6 sm:justify-between"
        >
          {featuredFlyers.map((f, i) => (
            <span
              key={f.rank}
              className="relative w-32 rounded-[2px] bg-white p-2 pb-3 shadow-[0_6px_14px_rgba(0,0,0,.32),0_2px_4px_rgba(0,0,0,.2)] transition-transform group-hover:scale-[1.03] sm:w-40"
              style={{ transform: `rotate(${[-4, 3, -2, 5][i % 4]}deg)` }}
            >
              <span className="cork-pin absolute -top-2 left-1/2 z-[2] h-4 w-4 -translate-x-1/2 rounded-full" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.thumb}
                alt={f.title}
                loading="lazy"
                className="block h-auto w-full bg-neutral-200"
              />
            </span>
          ))}
        </Link>
        <p className="mt-6 text-xs leading-relaxed text-muted">
          Flyer design for Edmonds College events and student clubs — Adobe
          Certified Professional work. Drag them around on the full board.
        </p>
      </section>

      {/* Section links */}
      <section className="border-t border-edge">
        <div className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted">
          More
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              href: "/experience",
              title: "Experience",
              blurb: "Roles across design, finance automation and IT — P&G, Edmonds College and more.",
            },
            {
              href: "/education",
              title: "Education",
              blurb: "Two AAS-T degrees in progress (Dec 2026), certifications, and course-linked projects.",
            },
            {
              href: "/about",
              title: "About Me",
              blurb: "The longer story — background, interests, and what I'm looking for next.",
            },
          ].map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-xl border border-edge bg-panel p-5 transition-colors hover:border-accent"
            >
              <h3 className="text-sm font-semibold group-hover:text-accent">
                {s.title} →
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">{s.blurb}</p>
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* Contact strip */}
      <footer className="border-t border-edge bg-panel/40">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-10">
          <div>
            <p className="text-sm font-semibold">Let&apos;s build something.</p>
            <p className="mt-1 text-xs text-muted">
              Open to full-stack, cloud &amp; applied-AI opportunities.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={profile.links.email}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-canvas transition-colors hover:bg-accent-hover"
            >
              Contact me
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-edge bg-panel px-4 py-2 text-sm text-accent-soft transition-colors hover:border-accent hover:text-ink"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
