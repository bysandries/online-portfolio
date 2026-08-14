import { cookies } from "next/headers";
import InfoLanding from "@/components/home/InfoLanding";
import DesktopShell from "@/components/desktop/DesktopShell";

/**
 * Mode gate: the desktop experience is the default; the "Info Only" toggle
 * (persisted in the ui-mode cookie) swaps in the classic landing page.
 */
export default async function Home() {
  const mode = (await cookies()).get("ui-mode")?.value;
  if (mode === "info") return <InfoLanding />;
  return <DesktopShell />;
}
