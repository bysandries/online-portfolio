import type { Metadata } from "next";
import Link from "next/link";
import config from "@/config/education.json";
import coursesConfig from "@/config/courses.json";
import projectsConfig from "@/config/projects.json";
import type {
  CourseInfo,
  CoursesConfig,
  EducationConfig,
  PortfolioConfig,
} from "@/config/types";

export const metadata: Metadata = {
  title: "Education — Luis Bedoya Sandries",
  description:
    "Edmonds College (four associate degrees, Dec 2026), Ulloa Technical High School, and professional certifications — with links to course-related projects.",
};

export default function EducationPage() {
  const { summary, schools, courseLinks, certifications } =
    config as EducationConfig;
  const projects = (projectsConfig as PortfolioConfig).projects;
  const titleOf = (id: string) =>
    projects.find((p) => p.id === id)?.title ?? id;
  // Projects hidden from the /projects explorer must not be deep-linked from
  // here either — the link would land on the fallback project instead.
  const isVisible = (id: string) => {
    const p = projects.find((x) => x.id === id);
    return !!p && !p.hidden;
  };
  const linkedCourses = courseLinks
    .map((c) => ({ ...c, projectIds: c.projectIds.filter(isVisible) }))
    .filter((c) => c.projectIds.length > 0);

  // Group the imported courses by quarter, preserving chronological order.
  const terms: { term: string; list: CourseInfo[] }[] = [];
  for (const c of (coursesConfig as CoursesConfig).courses) {
    const t = terms.find((x) => x.term === c.termKey);
    if (t) t.list.push(c);
    else terms.push({ term: c.termKey, list: [c] });
  }

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

        {linkedCourses.length > 0 && (
        <>
        <h2 className="mb-2 mt-12 text-[11px] font-semibold uppercase tracking-widest text-muted">
          Courses → Projects
        </h2>
        <p className="mb-6 text-xs text-muted">
          Coursework with hands-on work you can open in the projects view.
        </p>
        <div className="space-y-5">
          {linkedCourses.map((c) => (
            <article key={c.course} className="border-l-2 border-edge pl-5">
              <h3 className="text-sm font-semibold">{c.course}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{c.description}</p>
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {c.projectIds.map((id) => (
                  <li key={id}>
                    <Link
                      href={`/projects?project=${id}`}
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
        </>
        )}

        <h2 className="mb-2 mt-12 text-[11px] font-semibold uppercase tracking-widest text-muted">
          Coursework &amp; Grades
        </h2>
        <p className="mb-6 text-xs text-muted">
          Every class at Edmonds College, standardized from its syllabus and the
          official transcript — expand a course to see what I learned in it.
        </p>
        <div className="space-y-8">
          {terms.map(({ term, list }) => (
            <section key={term}>
              <h3 className="mb-3 font-mono text-xs text-accent-soft">{term}</h3>
              <div className="space-y-2">
                {list.map((c) => (
                  <details
                    key={c.code}
                    className="rounded-lg border border-edge bg-panel"
                  >
                    {/* Fixed-width code column so every title starts at the
                        same x regardless of code length (CIS 244 vs CMST& 210);
                        the title column wraps instead of clipping. */}
                    <summary className="grid cursor-pointer list-none grid-cols-[4.5rem_minmax(0,1fr)_auto] items-baseline gap-x-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                      <span className="font-mono text-xs text-muted">
                        {c.code}
                      </span>
                      <span className="text-sm font-medium">{c.title}</span>
                      <span className="font-mono text-xs text-accent-soft">
                        {c.grade.startsWith("S") ? "Pass" : c.grade} ·{" "}
                        {c.credits} cr
                      </span>
                    </summary>
                    <div className="space-y-3 border-t border-edge px-4 py-4">
                      {c.description ? (
                        <p className="text-xs leading-relaxed text-muted">
                          {c.description}
                        </p>
                      ) : (
                        <p className="text-xs italic text-muted">
                          Syllabus not on file yet — course details coming once
                          the college provides it.
                        </p>
                      )}
                      {c.outcomes.length > 0 && (
                        <div>
                          <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted">
                            What I learned
                          </h4>
                          <ul className="list-disc space-y-1 pl-4 marker:text-muted">
                            {c.outcomes.map((o) => (
                              <li key={o} className="text-xs leading-relaxed">
                                {o}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {c.topics.length > 0 && (
                        <ul className="flex flex-wrap gap-1.5">
                          {c.topics.map((t) => (
                            <li
                              key={t}
                              className="rounded-full border border-edge px-2.5 py-0.5 text-[11px] text-muted"
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                      )}
                      {c.tools.length > 0 && (
                        <p className="text-xs text-muted">
                          <span className="font-medium text-ink">Tools:</span>{" "}
                          {c.tools.join(" · ")}
                        </p>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </section>
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
