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

/**
 * Every flyer pinned onto the wallpaper — the desktop IS the designs gallery.
 * Every card is the same FlyerCard with the same logic; only its spawn slot
 * and pin order differ. The starter layout is a tidy exhibition grid: straight
 * cards in even rows, best rank at the top-left, nothing buried — every one of
 * the 40 designs is visible. Cards are pinned worst-first so any that later
 * get dragged into a pile stack best-on-top purely by DOM order.
 */
const WALL_COLS = 8;
// Slot by list position, NOT by rank — ranks are the sparse original curation
// numbers (1…91), so rank-derived rows would push half the designs off-screen.
// The config is already sorted best-first, so position order = quality order.
const WALL_FLYERS = (flyersConfig as FlyersConfig).flyers
  .map((f, i) => ({
    flyer: f,
    left: 1.5 + (i % WALL_COLS) * 9.7, // % of width — right edge stays clear for shortcuts
    top: 3 + Math.floor(i / WALL_COLS) * 18.8, // % of height
  }))
  .sort((a, b) => b.flyer.rank - a.flyer.rank);
/** Interacted cards get z-indexes above the whole unclicked pile. */
const WALL_BASE_Z = WALL_FLYERS.length + 1;

/**
 * The "sandriesOS" desktop: cork wallpaper with pinned flyer designs, a menu
 * bar with the Info Only toggle, section apps in the dock, and featured
 * project demos as desktop shortcuts — each opening a HIG-style browser
 * window whose content is the real page / live demo in an iframe.
 */
export default function DesktopShell() {
  const [wins, setWins] = useState<WinState[]>([]);
  const [openFlyer, setOpenFlyer] = useState<FlyerItem | null>(null);
  const [frontRank, setFrontRank] = useState<number | null>(null);
  const zCounter = useRef(1000);
  const flyerZ = useRef(WALL_BASE_Z);

  const open = (app: AppDef) => {
    setWins((prev) => {
      const existing = prev.find((w) => w.key === app.id);
      if (existing) {
        return prev.map((w) =>
          w.key === app.id ? { ...w, minimized: false, z: ++zCounter.current } : w,
        );
      }
      const n = prev.length;
      // Cascade from a centered origin, clamped so the window opens fully
      // on-screen (the Window itself caps its size to the viewport).
      const w = Math.min(app.defaultSize.w, window.innerWidth - 16);
      const x = Math.min(
        Math.max((window.innerWidth - w) / 2 + (n % 4) * 40 - 60, 8),
        Math.max(window.innerWidth - w - 8, 8),
      );
      return [
        ...prev,
        {
          key: app.id,
          app,
          x,
          y: 52 + (n % 4) * 32,
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
    // select-none: the desktop is an app surface — a document-wide Cmd+A
    // selection would otherwise turn card drags into native selection-drags
    // that cancel our pointer events.
    <div className="cork-surface fixed inset-0 z-[100] select-none overflow-hidden">
      {/* Real links for crawlers and no-JS visitors */}
      <nav className="sr-only" aria-label="Site sections">
        {DOCK_APPS.map((a) => (
          <Link key={a.id} href={a.url}>
            {a.title}
          </Link>
        ))}
        {/* Not a dock app (the wall shows every design), but still a page */}
        <Link href="/designs">Designs</Link>
      </nav>

      {/* Soft vignette settles the cork texture behind the content */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, transparent 55%, rgba(45,28,10,0.28) 100%)",
        }}
      />

      <MenuBar />

      {/* Pinned flyer designs — the wallpaper is the design portfolio.
          pointer-events-none keeps the slot wrappers from hijacking clicks:
          a dragged card's transform moves its visible hitbox, but the
          untransformed wrapper box would otherwise sit invisibly at the old
          slot and eat clicks meant for cards beneath it. FlyerCard re-enables
          its own events with pointer-events-auto. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {WALL_FLYERS.map(({ flyer, left, top }) => (
          <div key={flyer.rank} className="absolute" style={{ left: `${left}%`, top: `${top}%` }}>
            <FlyerCard
              flyer={flyer}
              onOpen={setOpenFlyer}
              nextZ={() => ++flyerZ.current}
              tidy
              isFront={frontRank === flyer.rank}
              onFront={() => setFrontRank(flyer.rank)}
            />
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
