"use client";

/**
 * The "Info Only" switch. ON = classic info site, OFF = the desktop.
 * Persisted in the ui-mode cookie read by app/page.tsx; toggling always
 * lands on / so the gate can re-render the chosen experience.
 */
export default function ModeToggle({ mode }: { mode: "desktop" | "info" }) {
  const on = mode === "info";

  const toggle = () => {
    const next = on ? "desktop" : "info";
    document.cookie = `ui-mode=${next};path=/;max-age=31536000;samesite=lax`;
    // Full reload on purpose: the server-side mode gate must re-read the
    // cookie, and the desktop/info swap should boot fresh (client-side
    // push+refresh races and can leave the old mode mounted).
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/");
  };

  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={toggle}
      title={on ? "Switch to the desktop experience" : "Switch to the plain info site"}
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-edge bg-panel py-0.5 pl-2 pr-1 text-[11px] text-muted transition-colors hover:border-accent hover:text-ink"
    >
      Info Only
      <span
        className={`flex h-3.5 w-6 items-center rounded-full p-0.5 transition-colors ${
          on ? "justify-end bg-accent" : "justify-start bg-panel-raised"
        }`}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-white shadow-sm" />
      </span>
    </button>
  );
}
