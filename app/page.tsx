"use client";

import Desktop from "@/components/Desktop/Desktop";
import SetupScreen from "@/components/Utilities/SetupScreen";
import { DesktopProvider } from "@/lib/desktop-store";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [isSettingUp, setIsSettingUp] = useState(true);
  return (
    <div>
      <AnimatePresence mode="wait">
        {isSettingUp ? (
          <SetupScreen key="setup" onComplete={() => setIsSettingUp(false)} />
        ) : (
          <DesktopProvider key="desktop">
            <Desktop />
          </DesktopProvider>
        )}
      </AnimatePresence>
    </div>
  );
}
