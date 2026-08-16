"use client";

import { useEffect, useRef, useState } from "react";
import type { FlyerItem } from "@/config/types";

const STORAGE_KEY = "corkboard-positions-v1";
/** Pointer travel below this many px counts as a tap (opens the lightbox). */
const TAP_THRESHOLD = 6;
/** Presses longer than this are a hold (pick up), not a tap (open). */
const HOLD_MS = 400;

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
  widthClass = "w-28 sm:w-36 md:w-40",
  initialZ,
  isFront,
  onFront,
}: {
  flyer: FlyerItem;
  onOpen: (flyer: FlyerItem) => void;
  /** Hands out an increasing z-index so the last-touched card stays on top. */
  nextZ: () => number;
  /** Card width utilities — the desktop wall uses smaller cards than the board. */
  widthClass?: string;
  /** Starting stack position — the desktop wall layers the best designs on top. */
  initialZ?: number;
  /** When provided, a tap on a buried card only lifts it to the front; the
   *  lightbox opens on tapping the card that is already front-most. */
  isFront?: boolean;
  onFront?: () => void;
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [z, setZ] = useState<number | undefined>(initialZ);
  const [lifted, setLifted] = useState(false);
  const wasFront = useRef(true);
  const pressAt = useRef(0);
  const drag = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);
  const moved = useRef(false);

  useEffect(() => {
    const saved = readSaved()[String(flyer.rank)];
    // localStorage is only readable post-mount; applying it in an effect keeps
    // the server and first client render identical (no hydration mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setOffset(saved);
  }, [flyer.rank]);

  // 2-decimal precision so server and client stringify the transform
  // identically (full-precision floats hydrate-mismatch).
  const jx = Math.round((rnd(flyer.rank) - 0.5) * 2000) / 100;
  const jy = Math.round((rnd(flyer.rank + 1) - 0.5) * 2000) / 100;
  const rot = Math.round((rnd(flyer.rank + 2) * 12 - 6) * 100) / 100;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startY: e.clientY, baseX: offset.x, baseY: offset.y };
    moved.current = false;
    wasFront.current = isFront ?? true;
    pressAt.current = performance.now();
    onFront?.();
    // Press = pick up: the card lifts and comes to the front immediately,
    // ready to be dragged anywhere.
    setLifted(true);
    setZ(nextZ());
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    if (Math.abs(dx) > TAP_THRESHOLD || Math.abs(dy) > TAP_THRESHOLD) {
      moved.current = true;
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
    } else if (wasFront.current && performance.now() - pressAt.current < HOLD_MS) {
      // Only a quick tap opens the lightbox — a click-and-hold is a "pick up"
      // gesture (bring to front / start moving), not an open.
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
      // A native HTML drag (of an image or an active text selection) would
      // fire pointercancel mid-move and freeze the card — never allow one.
      onDragStart={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(flyer);
        }
      }}
      className={`pointer-events-auto relative -m-2 shrink-0 cursor-grab touch-none select-none rounded-[2px] bg-white p-2 pb-3 transition-shadow active:cursor-grabbing ${widthClass} ${
        lifted
          ? "shadow-[0_18px_36px_rgba(0,0,0,.45),0_4px_8px_rgba(0,0,0,.3)]"
          : "shadow-[0_6px_14px_rgba(0,0,0,.32),0_2px_4px_rgba(0,0,0,.2)]"
      }`}
      style={{
        transform: `translate(${jx + offset.x}px, ${jy + offset.y}px) rotate(${rot}deg)${
          lifted ? " scale(1.04)" : ""
        }`,
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
