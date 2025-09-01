import Desktop from "@/components/Desktop/Desktop";
import { DesktopProvider } from "@/lib/desktop-store";

export default function Home() {
  return (
    <div>
      <DesktopProvider>
        <Desktop />
      </DesktopProvider>
    </div>
  );
}
