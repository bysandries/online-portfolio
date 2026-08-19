import type { Metadata } from "next";
import config from "@/config/experience.json";
import type { ExperienceConfig, ExperienceRole } from "@/config/types";

export const metadata: Metadata = {
  title: "Experience — Luis Bedoya Sandries",
  description:
    "Professional experience across design, finance, supply chain, and IT — Edmonds College, Procter & Gamble, and more.",
};

function RoleCard({ role }: { role: ExperienceRole }) {
  return (
    <article className="relative border-l-2 border-edge pb-8 pl-6 last:pb-0">
      <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-accent bg-canvas" />
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
        <h3 className="text-base font-semibold">{role.role}</h3>
        <span className="font-mono text-xs text-muted">{role.period}</span>
      </div>
      <p className="mt-0.5 text-sm text-accent-soft">
        {role.org} · {role.location}
        {role.note && <span className="text-muted"> — {role.note}</span>}
      </p>
      <ul className="mt-3 space-y-1.5">
        {role.bullets.map((b) => (
          <li key={b} className="flex gap-2 text-sm leading-relaxed text-muted">
            <span className="mt-px shrink-0 text-accent">▹</span>
            {b}
          </li>
        ))}
      </ul>
      {role.tags && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {role.tags.map((t) => (
            <li
              key={t}
              className="rounded-full border border-edge px-2.5 py-0.5 font-mono text-[11px] text-accent-soft"
            >
              {t}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function ExperiencePage() {
  const { intro, roles, volunteer } = config as ExperienceConfig;

  return (
    <div className="h-full overflow-y-auto bg-canvas">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight">Experience</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{intro}</p>

        <h2 className="mb-6 mt-10 text-[11px] font-semibold uppercase tracking-widest text-muted">
          Professional Experience
        </h2>
        <div>
          {roles.map((r) => (
            <RoleCard key={`${r.role}-${r.period}`} role={r} />
          ))}
        </div>

        <h2 className="mb-6 mt-12 text-[11px] font-semibold uppercase tracking-widest text-muted">
          Volunteer & Leadership
        </h2>
        <div>
          {volunteer.map((r) => (
            <RoleCard key={`${r.role}-${r.period}`} role={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
