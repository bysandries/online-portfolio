"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { DESKTOP_APPS, DOCK_APPS, type AppDef } from "@/components/desktop/apps";
import MenuBar from "@/components/desktop/MenuBar";
import Dock from "@/components/desktop/Dock";
import DesktopIcon from "@/components/desktop/DesktopIcon";
import Window, { type WinState } from "@/components/desktop/Window";
import FlyerCard from "@/components/corkboard/FlyerCard";
import Lightbox from "@/components/corkboard/Lightbox";
import flyersConfig from "@/config/flyers.json";
import type { FlyerItem, FlyersConfig } from "@/config/types";

/** Deterministic pseudo-random in [0,1) — same recipe as the cork board. */
function rnd(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/** A dozen flyers pinned straight onto the wallpaper, seeded scatter. */
const WALL_FLYERS = (flyersConfig as FlyersConfig).flyers
  .filter((_, i) => i % 3 === 0)
  .slice(0, 12)
  .map((f) => ({
    flyer: f,
    left: 4 + rnd(f.rank * 7) * 76, // % of width
    top: 10 + rnd(f.rank * 13) * 58, // % of height
  }));

/**
 * The "sandriesOS" desktop: cork wallpaper with pinned flyer designs, a menu
 * bar with the Info Only toggle, section apps in the dock, and featured
 * project demos as desktop shortcuts — each opening a HIG-style browser
 * window whose content is the real page / live demo in an iframe.
 */
export default function DesktopShell() {
  const [wins, setWins] = useState<WinState[]>([]);
  const [openFlyer, setOpenFlyer] = useState<FlyerItem | null>(null);
  const zCounter = useRef(1000);
  const flyerZ = useRef(10);

  const open = (app: AppDef) => {
    setWins((prev) => {
      const existing = prev.find((w) => w.key === app.id);
      if (existing) {
        return prev.map((w) =>
          w.key === app.id ? { ...w, minimized: false, z: ++zCounter.current } : w,
        );
      }
      const n = prev.length;
      return [
        ...prev,
        {
          key: app.id,
          app,
          x: Math.max(12, 90 + n * 36),
          y: 64 + (n % 5) * 32,
          z: ++zCounter.current,
          minimized: false,
          maximized: false,
        },
      ];
    });
  };
  const patch = (key: string, p: Partial<WinState>) =>
    setWins((prev) => prev.map((w) => (w.key === key ? { ...w, ...p } : w)));
  const close = (key: string) => setWins((prev) => prev.filter((w) => w.key !== key));
  const focus = (key: string) => patch(key, { z: ++zCounter.current });

  const visible = wins.filter((w) => !w.minimized);
  const activeKey = visible.length
    ? visible.reduce((a, b) => (a.z > b.z ? a : b)).key
    : null;

  return (
    <div className="cork-surface fixed inset-0 z-[100] overflow-hidden">
      {/* Real links for crawlers and no-JS visitors */}
      <nav className="sr-only" aria-label="Site sections">
        {DOCK_APPS.map((a) => (
          <Link key={a.id} href={a.url}>
            {a.title}
          </Link>
        ))}
      </nav>

      <MenuBar />

      {/* Pinned flyer designs — the wallpaper is the design portfolio */}
      <div className="absolute inset-0" aria-hidden>
        {WALL_FLYERS.map(({ flyer, left, top }) => (
          <div key={flyer.rank} className="absolute" style={{ left: `${left}%`, top: `${top}%` }}>
            <FlyerCard flyer={flyer} onOpen={setOpenFlyer} nextZ={() => ++flyerZ.current} />
          </div>
        ))}
      </div>

      {/* Desktop shortcuts — featured project demos */}
      <div className="absolute right-3 top-10 z-[400] flex flex-col items-end gap-4">
        {DESKTOP_APPS.map((app) => (
          <DesktopIcon key={app.id} app={app} onOpen={open} />
        ))}
      </div>

      {/* Windows */}
      {wins.map((w) => (
        <Window
          key={w.key}
          win={w}
          active={w.key === activeKey}
          onFocus={() => focus(w.key)}
          onClose={() => close(w.key)}
          onMinimize={() => patch(w.key, { minimized: true })}
          onToggleMaximize={() => patch(w.key, { maximized: !w.maximized, z: ++zCounter.current })}
          onMove={(x, y) => patch(w.key, { x, y })}
        />
      ))}

      <Dock
        apps={DOCK_APPS}
        openKeys={wins.map((w) => w.key)}
        onOpen={open}
      />

      <Lightbox flyer={openFlyer} onClose={() => setOpenFlyer(null)} />
    </div>
  );
}
