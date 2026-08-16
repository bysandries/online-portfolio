import Link from "next/link";
import config from "@/config/projects.json";
import flyersConfig from "@/config/flyers.json";
import type { FlyersConfig, PortfolioConfig } from "@/config/types";
import { getAllPosts } from "@/lib/posts";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

/** Personal values from the Focus board — worn as pixel badges. */
const VALUES = ["Kindness", "Authentic", "Resilience", "Innovative"];

/** Little decorative pixel squares for the player-card corners. */
function CornerPixels() {
  return (
    <>
      {["left-3 top-3", "right-3 top-3", "left-3 bottom-3", "right-3 bottom-3"].map(
        (pos) => (
          <span
            key={pos}
            aria-hidden
            className={`absolute ${pos} h-2 w-2 bg-accent/80`}
          />
        ),
      )}
    </>
  );
}

/**
 * "Info Only" landing page — pixel-art × neumorphism system. The hero is a
 * retro player card: pixel name, value badges, honest XP bars. The desktop
 * experience lives in components/desktop/; the explorer stays at /projects.
 */
export default async function InfoLanding() {
  const { profile, projects } = config as PortfolioConfig;
  const featured = projects.filter((p) => p.category === "featured");
  const featuredFlyers = (flyersConfig as FlyersConfig).flyers.filter(
    (f) => f.featured,
  );
  const latestPosts = (await getAllPosts()).slice(0, 3);

  return (
    <div className="h-full overflow-y-auto bg-canvas">
      {/* Hero — the player card */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-12 sm:pt-16">
        <div className="neo relative px-6 py-8 sm:px-10 sm:py-10">
          <CornerPixels />
          {profile.tagline && (
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              {profile.tagline}
            </p>
          )}
          <h1 className="px-cursor mt-4 font-pixel text-2xl font-bold leading-snug sm:text-4xl">
            LUIS <span className="text-accent">BEDOYA SANDRIES</span>
          </h1>
          <p className="mt-3 text-lg text-accent-soft">
            {profile.headline} · {profile.location}
          </p>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
            {profile.bio}
          </p>

          {/* Values — from the Focus board */}
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
            {VALUES.map((v) => (
              <li
                key={v}
                className="pixel-border m-[3px] bg-panel-raised px-2.5 py-1 font-pixel text-[9px] uppercase text-green [--px-border:var(--panel-raised)]"
              >
                {v}
              </li>
            ))}
          </ul>

          <ul className="mt-5 flex flex-wrap gap-2">
            {profile.credentials.map((c) => (
              <li
                key={c}
                className="neo-inset px-3 py-1.5 font-mono text-[11px] text-accent-soft"
              >
                {c}
              </li>
            ))}
          </ul>

          {/* XP — real numbers from the transcript */}
          <div className="mt-7 grid max-w-2xl gap-4 sm:grid-cols-2">
            <div>
              <div className="flex items-baseline justify-between font-pixel text-[9px] uppercase">
                <span className="text-muted">XP · College credits</span>
                <span className="text-accent">163</span>
              </div>
              <div className="px-bar mt-1.5" role="presentation">
                <span style={{ width: "90%" }} />
              </div>
              <p className="mt-1 font-mono text-[10px] text-muted">
                Two AAS-T degrees land Dec 2026
              </p>
            </div>
            <div>
              <div className="flex items-baseline justify-between font-pixel text-[9px] uppercase">
                <span className="text-muted">GPA</span>
                <span className="text-green">3.58 / 4.0</span>
              </div>
              <div className="px-bar mt-1.5" role="presentation">
                <span className="[--px-fill:var(--green)]" style={{ width: "89.5%" }} />
              </div>
              <p className="mt-1 font-mono text-[10px] text-muted">
                Cumulative, Edmonds College
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/projects"
              className="pixel-border m-[3px] bg-accent px-4 py-2.5 font-pixel text-[10px] font-bold uppercase text-canvas transition-colors [--px-border:var(--accent)] hover:bg-accent-hover hover:[--px-border:var(--accent-hover)]"
            >
              Explore the projects →
            </Link>
            {[
              { href: profile.links.github, label: "GitHub", ext: true },
              { href: profile.links.linkedin, label: "LinkedIn", ext: true },
              { href: profile.links.email, label: "Email", ext: false },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...(l.ext ? { target: "_blank", rel: "noreferrer" } : {})}
                className="pixel-border m-[3px] bg-panel-raised px-4 py-2.5 font-pixel text-[10px] uppercase text-accent-soft transition-colors [--px-border:var(--panel-raised)] hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured dev projects */}
      <section className="border-t border-edge/60">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-pixel text-[10px] uppercase tracking-wider text-muted">
              Featured Projects
            </h2>
            <Link
              href="/projects"
              className="text-xs text-accent-soft transition-colors hover:text-ink"
            >
              All projects →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <Link
                key={p.id}
                href={`/projects?project=${p.id}`}
                className="neo group flex flex-col p-5 transition-transform hover:-translate-y-0.5"
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
                      className="neo-inset px-1.5 py-0.5 font-mono text-[10px] text-accent-soft"
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
          <h2 className="font-pixel text-[10px] uppercase tracking-wider text-muted">
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

      {/* Latest writing */}
      <section className="border-t border-edge/60">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-pixel text-[10px] uppercase tracking-wider text-muted">
              Latest Writing
            </h2>
            <Link
              href="/blog"
              className="text-xs text-accent-soft transition-colors hover:text-ink"
            >
              All posts →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {latestPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="neo group flex flex-col p-5 transition-transform hover:-translate-y-0.5"
              >
                <p className="font-mono text-[11px] text-accent-soft">
                  {dateFmt.format(new Date(p.publishedDate))}
                </p>
                <h3 className="mt-2 text-sm font-semibold leading-snug group-hover:text-accent">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">
                  {p.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section links */}
      <section className="border-t border-edge/60">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="font-pixel text-[10px] uppercase tracking-wider text-muted">
            More
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {[
              {
                href: "/experience",
                title: "Experience",
                blurb:
                  "Roles across design, finance automation and IT — P&G, Edmonds College and more.",
              },
              {
                href: "/education",
                title: "Education",
                blurb:
                  "Two AAS-T degrees in progress (Dec 2026), certifications, and course-linked projects.",
              },
              {
                href: "/about",
                title: "About Me",
                blurb:
                  "The longer story — background, interests, and what I'm looking for next.",
              },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="neo group p-5 transition-transform hover:-translate-y-0.5"
              >
                <h3 className="text-sm font-semibold group-hover:text-accent">
                  {s.title} →
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {s.blurb}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <footer className="border-t border-edge/60">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-10">
          <div>
            <p className="font-pixel text-xs font-bold">
              LET&apos;S BUILD <span className="text-accent">SOMETHING.</span>
            </p>
            <p className="mt-1.5 text-xs text-muted">
              Open to full-stack, cloud &amp; applied-AI opportunities.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href={profile.links.email}
              className="pixel-border m-[3px] bg-accent px-4 py-2.5 font-pixel text-[10px] font-bold uppercase text-canvas transition-colors [--px-border:var(--accent)] hover:bg-accent-hover hover:[--px-border:var(--accent-hover)]"
            >
              Contact me
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="pixel-border m-[3px] bg-panel-raised px-4 py-2.5 font-pixel text-[10px] uppercase text-accent-soft transition-colors [--px-border:var(--panel-raised)] hover:text-ink"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
