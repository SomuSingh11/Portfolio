"use client";

import { useState, useEffect, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { DesktopProvider } from "@/store/desktop-store";
import { useDevice } from "@/provider/device-provider";
import { PreferencesProvider } from "@/store/preferences-store";
import Desktop from "@/components/Desktop/Desktop";
import MobileLayout from "@/components/Mobile/MobileLayout";
import SetupScreen from "@/components/Utilities/SetupScreen";
import { WALLPAPERS } from "@/config/constants";

function AppContent() {
  const { isMobile } = useDevice();

  if (isMobile) {
    return (
      <Suspense fallback={null}>
        <MobileLayout />
      </Suspense>
    );
  }

  return <Desktop />;
}

export default function Home() {
  const { isMobile } = useDevice();
  const [isSettingUp, setIsSettingUp] = useState(true);

  // Skip boot on mobile — useIsMobile starts as false (SSR) and flips to true
  // after mount, so we catch it here and immediately dismiss the boot screen
  useEffect(() => {
    if (isMobile) setIsSettingUp(false);
  }, [isMobile]);

  // Preload the default wallpaper during boot so it's ready when Desktop mounts
  useEffect(() => {
    if (!isSettingUp || isMobile) return;
    const img = new window.Image();
    img.src = WALLPAPERS[0];
  }, [isSettingUp, isMobile]);

  return (
    <AnimatePresence mode="wait">
      {isSettingUp ? (
        <SetupScreen key="setup" onComplete={() => setIsSettingUp(false)} />
      ) : (
        <PreferencesProvider key="prefs">
          <DesktopProvider key="app">
            <AppContent />
          </DesktopProvider>
        </PreferencesProvider>
      )}
    </AnimatePresence>
  );
}

