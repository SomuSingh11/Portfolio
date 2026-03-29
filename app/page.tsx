"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { DesktopProvider } from "@/store/desktop-store";
import { useDevice } from "@/provider/device-provider";
import Desktop from "@/components/Desktop/Desktop";
import MobileLayout from "@/components/Mobile/MobileLayout";
import SetupScreen from "@/components/Utilities/SetupScreen";

function AppContent() {
  const { isMobile } = useDevice();

  if (isMobile) {
    return <MobileLayout />;
  }

  return <Desktop />;
}

export default function Home() {
  const [isSettingUp, setIsSettingUp] = useState(true);

  return (
    <AnimatePresence mode="wait">
      {isSettingUp ? (
        <SetupScreen key="setup" onComplete={() => setIsSettingUp(false)} />
      ) : (
        // DesktopProvider wraps BOTH desktop and mobile so store is always available
        <DesktopProvider key="app">
          <AppContent />
        </DesktopProvider>
      )}
    </AnimatePresence>
  );
}
