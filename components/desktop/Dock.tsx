"use client";

import type { AppDef } from "@/components/desktop/apps";
import AppIcon from "@/components/desktop/AppIcon";

/**
 * Bottom dock: floating translucent shelf of section apps. Open apps get a
 * running-indicator dot; clicking an open app focuses (or restores) it.
 */
export default function Dock({
  apps,
  openKeys,
  onOpen,
}: {
  apps: AppDef[];
  openKeys: string[];
  onOpen: (app: AppDef) => void;
}) {
  return (
    <nav
      aria-label="Apps"
      className="absolute bottom-3 left-1/2 z-[500] flex -translate-x-1/2 items-end gap-1 rounded-2xl border border-white/10 bg-[#101a2e]/70 px-2 pb-1.5 pt-2 shadow-[0_18px_50px_rgba(0,0,0,.5)] backdrop-blur-xl"
    >
      {apps.map((app) => {
        const open = openKeys.includes(app.id);
        return (
          <button
            key={app.id}
            onClick={() => onOpen(app)}
            title={app.title}
            className="group relative flex flex-col items-center gap-0.5 px-1"
          >
            <span className="pointer-events-none absolute -top-8 hidden whitespace-nowrap rounded-md border border-edge bg-panel px-2 py-0.5 text-[11px] text-ink shadow-lg group-hover:block">
              {app.title}
            </span>
            <span
              className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-white/10 text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,.15),0_2px_6px_rgba(0,0,0,.35)] transition-transform duration-150 group-hover:-translate-y-1.5 group-hover:scale-105"
              style={{ background: app.tint }}
            >
              <AppIcon name={app.icon} size={22} />
            </span>
            <span className={`h-1 w-1 rounded-full ${open ? "bg-accent-soft" : "bg-transparent"}`} />
          </button>
        );
      })}
    </nav>
  );
}
