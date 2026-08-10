"use client";

import type { PortfolioConfig, Project } from "@/config/types";

function NavItem({
  project,
  selected,
  onSelect,
}: {
  project: Project;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <li>
      <button
        onClick={() => onSelect(project.id)}
        aria-current={selected ? "true" : undefined}
        className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
          selected
            ? "border-l-2 border-accent bg-panel-raised"
            : "border-l-2 border-transparent hover:bg-panel-raised/60"
        }`}
      >
        <span className="flex items-center gap-2">
          <span className="block truncate text-sm font-medium">{project.title}</span>
          {project.embed === "click" && (
            <span className="shrink-0 rounded border border-accent/40 px-1 font-mono text-[10px] text-accent">
              WASM
            </span>
          )}
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted">{project.tagline}</span>
      </button>
    </li>
  );
}

export default function Sidebar({
  config,
  selectedId,
  onSelect,
}: {
  config: PortfolioConfig;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const { profile, categories, projects } = config;

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-edge px-5 pb-5 pt-6">
        <h1 className="text-xl font-bold tracking-tight">{profile.name}</h1>
        <p className="mt-1 text-sm text-accent-soft">
          {profile.headline} · {profile.location}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted">{profile.bio}</p>
        <ul className="mt-3 space-y-1">
          {profile.credentials.map((c) => (
            <li key={c} className="flex items-start gap-1.5 text-xs text-muted">
              <span className="mt-px text-accent">✓</span>
              {c}
            </li>
          ))}
        </ul>
      </header>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4" aria-label="Projects">
        {categories.map((cat) => {
          const items = projects.filter((p) => p.category === cat.id);
          if (items.length === 0) return null;
          return (
            <section key={cat.id} className="mb-5">
              <h2 className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-muted">
                {cat.label}
              </h2>
              <ul className="space-y-0.5">
                {items.map((p) => (
                  <NavItem
                    key={p.id}
                    project={p}
                    selected={p.id === selectedId}
                    onSelect={onSelect}
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </nav>

      <footer className="border-t border-edge px-5 py-4">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="text-accent-soft transition-colors hover:text-accent">
            GitHub
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-accent-soft transition-colors hover:text-accent">
            LinkedIn
          </a>
          <a href={profile.links.email} className="text-accent-soft transition-colors hover:text-accent">
            Email
          </a>
          <a href={profile.links.site} target="_blank" rel="noopener noreferrer" className="text-accent-soft transition-colors hover:text-accent">
            sandries.com
          </a>
        </div>
        <p className="mt-2 text-[11px] text-muted">
          Open to full-stack, cloud & applied-AI opportunities.
        </p>
      </footer>
    </div>
  );
}
