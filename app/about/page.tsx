import type { Metadata } from "next";
import config from "@/config/about.json";
import projectsConfig from "@/config/projects.json";
import type { AboutConfig, PortfolioConfig } from "@/config/types";

export const metadata: Metadata = {
  title: "About Me — Luis Bedoya Sandries",
  description:
    "Designer first, developer by obsession — from Heredia, Costa Rica to Seattle, WA.",
};

export default function AboutPage() {
  const { headline, paragraphs, facts, interests } = config as AboutConfig;
  const { profile } = projectsConfig as PortfolioConfig;

  return (
    <div className="h-full overflow-y-auto bg-canvas">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight">About Me</h1>
        <p className="mt-3 text-base text-accent-soft">{headline}</p>

        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_240px]">
          <div className="space-y-5">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="text-sm leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>

          <aside className="h-fit space-y-6 md:sticky md:top-6">
            <div className="rounded-xl border border-edge bg-panel p-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                Quick facts
              </h2>
              <dl className="mt-3 space-y-2.5">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-[11px] text-muted">{f.label}</dt>
                    <dd className="text-xs text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-xl border border-edge bg-panel p-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                Things I like
              </h2>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {interests.map((i) => (
                  <li
                    key={i}
                    className="rounded-full border border-edge px-2.5 py-1 text-[11px] text-accent-soft"
                  >
                    {i}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-edge bg-panel p-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                Say hi
              </h2>
              <div className="mt-3 flex flex-col gap-1.5 text-xs">
                <a href={profile.links.email} className="text-accent-soft transition-colors hover:text-accent">
                  contact@sandries.com
                </a>
                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-accent-soft transition-colors hover:text-accent">
                  linkedin.com/in/sandries
                </a>
                <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="text-accent-soft transition-colors hover:text-accent">
                  github.com/bysandries
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
