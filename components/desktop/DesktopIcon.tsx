"use client";

import type { AppDef } from "@/components/desktop/apps";

/** A desktop shortcut: app tile + label. Single click opens (it's the web). */
export default function DesktopIcon({ app, onOpen }: { app: AppDef; onOpen: (app: AppDef) => void }) {
  return (
    <button
      onClick={() => onOpen(app)}
      title={`Open ${app.title}`}
      className="group flex w-[104px] flex-col items-center gap-1.5"
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-[14px] border border-white/15 text-[26px] shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_4px_10px_rgba(0,0,0,.35)] transition-transform duration-150 group-hover:scale-105"
        style={{ background: app.tint }}
      >
        {app.emoji}
      </span>
      <span className="line-clamp-2 rounded bg-black/45 px-1.5 py-0.5 text-center text-[11px] leading-tight text-white shadow-sm">
        {app.title}
      </span>
    </button>
  );
}
