"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import LivePreview from "@/components/LivePreview";
import type { PortfolioConfig } from "@/config/types";

/**
 * Master-detail shell: 1/3 sidebar, 2/3 live preview on desktop (lg+).
 * On mobile the two panes become sequential screens — the project list first,
 * then the preview with a back button — so only one iframe ever exists.
 * `?project=<id>` deep-links to a specific project (used by the Education page).
 */
export default function Layout({ config }: { config: PortfolioConfig }) {
  const requested = useSearchParams().get("project");
  const deepLinked = config.projects.some((p) => p.id === requested);
  const [selectedId, setSelectedId] = useState(
    deepLinked ? requested! : config.projects[0].id,
  );
  const [mobilePreview, setMobilePreview] = useState(deepLinked);

  const selected =
    config.projects.find((p) => p.id === selectedId) ?? config.projects[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setMobilePreview(true);
  };

  return (
    <div className="h-full overflow-hidden bg-canvas text-ink lg:grid lg:grid-cols-3">
      <aside
        className={`h-full overflow-hidden border-edge bg-panel lg:col-span-1 lg:block lg:border-r ${
          mobilePreview ? "hidden" : "block"
        }`}
      >
        <Sidebar config={config} selectedId={selectedId} onSelect={handleSelect} />
      </aside>

      <main
        className={`h-full min-w-0 flex-col lg:col-span-2 lg:flex ${
          mobilePreview ? "flex" : "hidden"
        }`}
      >
        <button
          onClick={() => setMobilePreview(false)}
          className="border-b border-edge bg-panel px-4 py-2 text-left text-xs text-accent-soft lg:hidden"
        >
          ← All projects
        </button>
        <div className="min-h-0 flex-1">
          <LivePreview project={selected} />
        </div>
      </main>
    </div>
  );
}
