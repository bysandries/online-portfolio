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

/**
 * Every flyer pinned onto the wallpaper — the desktop IS the designs gallery.
 * Every card is the same FlyerCard with the same logic; only its spawn slot
 * and pin order differ. The grid slot comes from rank (best = top-left) and
 * cards are pinned worst-first, so the last ones added — the best — sit at
 * the front of the pile purely by DOM order, no per-card z overrides.
 */
const WALL_COLS = 8;
const WALL_FLYERS = (flyersConfig as FlyersConfig).flyers
  .map((f) => {
    const slot = f.rank - 1;
    const col = slot % WALL_COLS;
    const row = Math.floor(slot / WALL_COLS);
    // 2-decimal precision, matching FlyerCard: full-precision floats stringify
    // differently between server and client render and trip hydration.
    return {
      flyer: f,
      left: Math.round((3 + col * 10.4 + (rnd(f.rank * 7) - 0.5) * 5) * 100) / 100, // % of width
      top: Math.round((6 + row * 14.5 + (rnd(f.rank * 13) - 0.5) * 6) * 100) / 100, // % of height
    };
  })
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
