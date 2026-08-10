"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import type { Project } from "@/config/types";

/**
 * 2/3 panel: renders exactly one iframe at a time, in one of two modes:
 * - "preview": the project's deployed demo
 * - "code":    the project's source in VS Code for the Web via github1s.com
 *              (github.dev sends `frame-ancestors 'none'` and cannot be
 *              embedded; github1s runs the same microsoft/vscode web build
 *              and allows framing) — public repos only
 *
 * Memory management strategy:
 * - The iframe's `key` is bound to `${project.id}:${mode}:${instance}`.
 *   Switching projects, toggling Preview/Code, or hitting Reload changes the
 *   key, so React unmounts the old iframe entirely — the browser discards
 *   that document's JS heap (CheerpJ VMs, Leaflet tiles, VS Code workbench,
 *   WASM memory) and garbage-collects it, rather than accumulating hidden
 *   live documents.
 * - Projects flagged `embed: "click"` never mount their demo iframe until the
 *   user asks, so navigating the portfolio never pays the WASM boot cost. The
 *   Code view is inherently click-to-load: it only mounts on toggle.
 */

type ViewMode = "preview" | "code";

class PreviewErrorBoundary extends Component<
  { resetKey: string; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prev: { resetKey: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full items-center justify-center p-8">
          <p className="text-sm text-muted">
            The preview crashed. Pick another project or hit Reload.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

function TechChips({ tech }: { tech: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tech.map((t) => (
        <li
          key={t}
          className="rounded-full border border-edge bg-canvas px-2.5 py-0.5 font-mono text-[11px] text-accent-soft"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

function DetailCard({
  project,
  onActivate,
}: {
  project: Project;
  onActivate?: () => void;
}) {
  return (
    <div className="flex h-full items-center justify-center overflow-y-auto p-6">
      <div className="max-w-xl rounded-xl border border-edge bg-panel p-8">
        <h2 className="text-lg font-semibold">{project.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>
        <div className="mt-5">
          <TechChips tech={project.tech} />
        </div>
        {project.embedNote && (
          <p className="mt-5 border-l-2 border-accent pl-3 text-xs leading-relaxed text-muted">
            {project.embedNote}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          {onActivate && (
            <button
              onClick={onActivate}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              ▶ Load live demo
            </button>
          )}
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-edge px-4 py-2 text-sm text-ink transition-colors hover:border-accent"
            >
              View source on GitHub ↗
            </a>
          ) : (
            <span className="self-center text-xs text-muted">source private</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LivePreview({ project }: { project: Project }) {
  const [mode, setMode] = useState<ViewMode>("preview");
  const [activated, setActivated] = useState(project.embed === "auto");
  const [loaded, setLoaded] = useState(false);
  const [instance, setInstance] = useState(0);

  // Reset per-project state on every selection change: heavy demos must never
  // stay "activated" across navigation, and the spinner must re-arm.
  useEffect(() => {
    setMode("preview");
    setActivated(project.embed === "auto");
    setLoaded(false);
    setInstance(0);
  }, [project.id, project.embed]);

  const codeUrl = project.repoUrl
    ? project.repoUrl.replace("github.com", "github1s.com")
    : null;

  const frameKey = `${project.id}:${mode}:${instance}`;
  const frameSrc = mode === "code" ? codeUrl : project.demoUrl;
  const showFrame =
    mode === "code" ? codeUrl !== null : activated && project.demoUrl !== null;

  const switchMode = (next: ViewMode) => {
    if (next === mode) return;
    setMode(next);
    setLoaded(false);
    setInstance(0);
  };

  const reload = () => {
    setLoaded(false);
    setInstance((i) => i + 1); // new key → full unmount/remount of the iframe
  };

  return (
    <section className="flex h-full min-w-0 flex-col" aria-label="Live preview">
      <header className="flex items-center gap-3 border-b border-edge bg-panel px-4 py-3">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold">{project.title}</h1>
          <p className="truncate text-xs text-muted">{project.tagline}</p>
        </div>

        {codeUrl && (
          <div
            role="tablist"
            aria-label="View mode"
            className="flex overflow-hidden rounded-md border border-edge text-xs"
          >
            {(["preview", "code"] as const).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => switchMode(m)}
                className={`px-3 py-1.5 capitalize transition-colors ${
                  mode === m
                    ? "bg-accent font-medium text-white"
                    : "text-muted hover:text-ink"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {showFrame && (
          <button
            onClick={reload}
            title="Force a full iframe remount"
            className="rounded-md border border-edge px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-ink"
          >
            ⟳ Reload
          </button>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-edge px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-ink"
          >
            Open ↗
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-edge px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-ink"
          >
            GitHub
          </a>
        )}
      </header>

      <div className="relative min-h-0 flex-1 bg-canvas">
        <PreviewErrorBoundary resetKey={frameKey}>
          {!showFrame ? (
            <DetailCard
              project={project}
              onActivate={
                mode === "preview" && project.embed === "click" && project.demoUrl
                  ? () => setActivated(true)
                  : undefined
              }
            />
          ) : (
            <>
              {!loaded && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-canvas">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-edge border-t-accent" />
                    <p className="text-xs text-muted">
                      {mode === "code"
                        ? "Booting VS Code for the Web…"
                        : `Loading ${project.title}…`}
                    </p>
                  </div>
                </div>
              )}
              {/* No sandbox attr: demos are my own deployed apps, and CheerpJ/
                  WASM + the VS Code workbench need workers and same-origin
                  storage that sandboxing breaks. */}
              <iframe
                key={frameKey}
                src={frameSrc!}
                title={
                  mode === "code"
                    ? `Source code: ${project.title}`
                    : `Live demo: ${project.title}`
                }
                className="h-full w-full border-0"
                allow="fullscreen; clipboard-read; clipboard-write"
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => setLoaded(true)}
              />
            </>
          )}
        </PreviewErrorBoundary>
      </div>

      <footer className="border-t border-edge bg-panel px-4 py-2.5">
        <TechChips tech={project.tech} />
      </footer>
    </section>
  );
}
