import { cookies, headers } from "next/headers";
import InfoLanding from "@/components/home/InfoLanding";
import DesktopShell from "@/components/desktop/DesktopShell";
import { MOBILE_UA } from "@/lib/ui-mode";

/**
 * Mode gate: an explicit ui-mode cookie always wins (the toggle works both
 * ways on every device). With no choice saved, phones get the Info page —
 * the desktop metaphor wants a pointer and room — and larger screens boot
 * the desktop experience.
 */
export default async function Home() {
  const mode = (await cookies()).get("ui-mode")?.value;
  if (mode === "info") return <InfoLanding />;
  if (mode === "desktop") return <DesktopShell />;
  const ua = (await headers()).get("user-agent") ?? "";
  return MOBILE_UA.test(ua) ? <InfoLanding /> : <DesktopShell />;
}
