import type { Metadata } from "next";
import Link from "next/link";
import config from "@/config/education.json";
import projectsConfig from "@/config/projects.json";
import type { EducationConfig, PortfolioConfig } from "@/config/types";

export const metadata: Metadata = {
  title: "Education — Luis Bedoya Sandries",
  description:
    "Edmonds College (two AAS-T degrees, Dec 2026), Ulloa Technical High School, and professional certifications — with links to course-related projects.",
};

export default function EducationPage() {
  const { summary, schools, courseLinks, certifications } =
    config as EducationConfig;
  const projects = (projectsConfig as PortfolioConfig).projects;
  const titleOf = (id: string) =>
    projects.find((p) => p.id === id)?.title ?? id;

  return (
    <div className="h-full overflow-y-auto bg-canvas">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight">Education</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{summary}</p>

        <div className="mt-8 space-y-6">
          {schools.map((s) => (
            <article key={s.name} className="rounded-xl border border-edge bg-panel p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <h2 className="text-base font-semibold">{s.name}</h2>
                <span className="font-mono text-xs text-muted">
                  {s.location} · {s.period}
                </span>
              </div>
              <ul className="mt-4 space-y-2">
                {s.degrees.map((d) => (
                  <li key={d.title} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-sm">
                    <span>{d.title}</span>
                    <span className="font-mono text-xs text-accent-soft">{d.status}</span>
                  </li>
                ))}
              </ul>
              {s.details && (
                <div className="mt-4 space-y-2 border-t border-edge pt-4">
                  {s.details.map((d) => (
                    <p key={d} className="text-xs leading-relaxed text-muted">
                      {d}
                    </p>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        <h2 className="mb-2 mt-12 text-[11px] font-semibold uppercase tracking-widest text-muted">
          Courses → Projects
        </h2>
        <p className="mb-6 text-xs text-muted">
          Coursework with hands-on work you can open in the projects view.
        </p>
        <div className="space-y-5">
          {courseLinks.map((c) => (
            <article key={c.course} className="border-l-2 border-edge pl-5">
              <h3 className="text-sm font-semibold">{c.course}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{c.description}</p>
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {c.projectIds.map((id) => (
                  <li key={id}>
                    <Link
                      href={`/?project=${id}`}
                      className="inline-block rounded-md border border-edge bg-panel px-3 py-1.5 text-xs text-accent-soft transition-colors hover:border-accent hover:text-ink"
                    >
                      {titleOf(id)} →
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <h2 className="mb-6 mt-12 text-[11px] font-semibold uppercase tracking-widest text-muted">
          Certifications
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {certifications.map((c) => (
            <li key={c.title} className="rounded-lg border border-edge bg-panel p-4">
              <p className="text-sm font-medium leading-snug">{c.title}</p>
              <p className="mt-1 text-xs text-muted">{c.issuer}</p>
              <p className="mt-0.5 font-mono text-[11px] text-accent-soft">{c.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
