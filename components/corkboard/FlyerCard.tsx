"use client";

import { useEffect, useRef, useState } from "react";
import type { FlyerItem } from "@/config/types";

const STORAGE_KEY = "corkboard-positions-v1";
/** Pointer travel below this many px counts as a tap (opens the lightbox). */
const TAP_THRESHOLD = 6;

/** Deterministic pseudo-random in [0,1) — same recipe as the original board,
 *  so the initial scatter is identical between server and client render. */
function rnd(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function readSaved(): Record<string, { x: number; y: number }> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/**
 * One pinned polaroid. Flows in the board's flex-wrap layout with a seeded
 * jitter/rotation; dragging adds a translate offset persisted per-rank in
 * localStorage (applied post-mount to avoid hydration mismatch).
 */
export default function FlyerCard({
  flyer,
  onOpen,
  nextZ,
}: {
  flyer: FlyerItem;
  onOpen: (flyer: FlyerItem) => void;
  /** Hands out an increasing z-index so the last-touched card stays on top. */
  nextZ: () => number;
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [z, setZ] = useState<number | undefined>(undefined);
  const [lifted, setLifted] = useState(false);
  const drag = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);
  const moved = useRef(false);

  useEffect(() => {
    const saved = readSaved()[String(flyer.rank)];
    // localStorage is only readable post-mount; applying it in an effect keeps
    // the server and first client render identical (no hydration mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setOffset(saved);
  }, [flyer.rank]);

  const jx = (rnd(flyer.rank) - 0.5) * 20;
  const jy = (rnd(flyer.rank + 1) - 0.5) * 20;
  const rot = rnd(flyer.rank + 2) * 12 - 6;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startY: e.clientY, baseX: offset.x, baseY: offset.y };
    moved.current = false;
    setZ(nextZ());
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    if (Math.abs(dx) > TAP_THRESHOLD || Math.abs(dy) > TAP_THRESHOLD) {
      moved.current = true;
      setLifted(true);
    }
    if (moved.current) {
      setOffset({ x: drag.current.baseX + dx, y: drag.current.baseY + dy });
    }
  };

  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    setLifted(false);
    if (moved.current) {
      const saved = readSaved();
      saved[String(flyer.rank)] = offset;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      } catch {
        /* private mode etc. — the drag still works, it just won't persist */
      }
    } else {
      onOpen(flyer);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${flyer.title} — open flyer`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(flyer);
        }
      }}
      className={`relative -m-2 w-28 shrink-0 cursor-grab touch-none select-none rounded-[2px] bg-white p-2 pb-3 transition-shadow active:cursor-grabbing sm:w-36 md:w-40 ${
        lifted
          ? "shadow-[0_18px_36px_rgba(0,0,0,.45),0_4px_8px_rgba(0,0,0,.3)]"
          : "shadow-[0_6px_14px_rgba(0,0,0,.32),0_2px_4px_rgba(0,0,0,.2)]"
      }`}
      style={{
        transform: `translate(${jx + offset.x}px, ${jy + offset.y}px) rotate(${rot}deg)`,
        zIndex: z,
      }}
    >
      <div className="cork-pin absolute -top-2 left-1/2 z-[2] h-4 w-4 -translate-x-1/2 rounded-full" />
      {/* Plain <img>: assets are pre-optimized webp thumbs and the cards are
          transformed/overlapped, which next/image sizing handles poorly. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={flyer.thumb}
        alt={flyer.title}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="pointer-events-none block h-auto w-full bg-neutral-200"
      />
    </div>
  );
}
