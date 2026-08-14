"use client";

import { useRef, useState } from "react";
import type { AppDef } from "@/components/desktop/apps";

export interface WinState {
  key: string;
  app: AppDef;
  x: number;
  y: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
}

/**
 * A macOS-style (Apple HIG) browser window: traffic lights, unified title/
 * toolbar with a centered address pill, hairline border, layered shadows,
 * dimmed controls when inactive. Content is a real iframe of the target URL.
 */
export default function Window({
  win,
  active,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onMove,
}: {
  win: WinState;
  active: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onMove: (x: number, y: number) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const drag = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (win.maximized) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startY: e.clientY, baseX: win.x, baseY: win.y };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const x = drag.current.baseX + (e.clientX - drag.current.startX);
    // Keep the title bar reachable: below the menu bar, above the dock.
    const y = Math.min(
      Math.max(drag.current.baseY + (e.clientY - drag.current.startY), 28),
      window.innerHeight - 120,
    );
    onMove(Math.min(Math.max(x, 64 - win.app.defaultSize.w), window.innerWidth - 64), y);
  };
  const onPointerUp = () => {
    drag.current = null;
    setDragging(false);
  };

  if (win.minimized) return null;

  const lights: Array<[string, string, () => void, string]> = [
    ["close", "#ff5f57", onClose, "Close"],
    ["minimize", "#febc2e", onMinimize, "Minimize"],
    ["zoom", "#28c840", onToggleMaximize, "Zoom"],
  ];

  return (
    <section
      aria-label={win.app.title}
      onPointerDown={onFocus}
      className="absolute flex flex-col overflow-hidden rounded-[10px] border border-white/10 bg-[#1c1c1e]"
      style={
        win.maximized
          ? {
              inset: "40px 10px 92px 10px",
              zIndex: win.z,
              boxShadow: "0 22px 70px 4px rgba(0,0,0,.56), 0 0 0 .5px rgba(255,255,255,.06)",
            }
          : {
              left: win.x,
              top: win.y,
              width: `min(${win.app.defaultSize.w}px, calc(100vw - 16px))`,
              height: `min(${win.app.defaultSize.h}px, calc(100dvh - 130px))`,
              zIndex: win.z,
              boxShadow: active
                ? "0 22px 70px 4px rgba(0,0,0,.56), 0 0 0 .5px rgba(255,255,255,.06)"
                : "0 10px 28px rgba(0,0,0,.35), 0 0 0 .5px rgba(255,255,255,.04)",
            }
      }
    >
      {/* Unified title bar + toolbar */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onToggleMaximize}
        className={`relative flex h-[44px] shrink-0 cursor-default items-center gap-2 border-b border-white/[0.06] px-3 ${
          active ? "bg-[#2a2a2c]" : "bg-[#232325]"
        }`}
        style={{ touchAction: "none" }}
      >
        <div className="group flex shrink-0 items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
          {lights.map(([id, color, action, label]) => (
            <button
              key={id}
              aria-label={`${label} ${win.app.title}`}
              onClick={action}
              className="h-3 w-3 rounded-full border border-black/20 transition-[filter] group-hover:brightness-95 hover:!brightness-75"
              style={{ background: active ? color : "#57575b" }}
            />
          ))}
        </div>
        {/* Address pill */}
        <div className="pointer-events-none mx-auto flex h-7 w-full max-w-[380px] items-center justify-center gap-1.5 rounded-md bg-black/25 px-3">
          <svg width="9" height="11" viewBox="0 0 9 11" aria-hidden className="shrink-0 opacity-60">
            <path d="M1.5 4.5V3a3 3 0 0 1 6 0v1.5H8a1 1 0 0 1 1 1V10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1h.5Zm1.2 0h3.6V3a1.8 1.8 0 0 0-3.6 0v1.5Z" fill="#a1a1a6" />
          </svg>
          <span className="truncate text-[12px] text-[#a1a1a6]">{win.app.address}</span>
        </div>
        {/* Right spacer mirrors the lights so the pill stays centered */}
        <div className="w-[52px] shrink-0" />
      </div>

      {/* Content */}
      <div className="relative min-h-0 flex-1 bg-canvas">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-edge border-t-accent" />
          </div>
        )}
        <iframe
          src={win.app.url}
          title={win.app.title}
          onLoad={() => setLoaded(true)}
          className="h-full w-full border-0"
          style={{ colorScheme: "dark" }}
        />
        {/* iframes swallow pointer events — mask them while dragging or unfocused-click-through */}
        {(dragging || !active) && <div className="absolute inset-0" />}
      </div>
    </section>
  );
}
