"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AppId } from "@/types/desktop";
import type { MobileScreen } from "@/config/mobileConfig";
import LockScreen from "@/components/Mobile/LockScreen";
import HomeScreen from "@/components/Mobile/HomeScreen";
import AppWindow from "@/components/Mobile/AppWindow";

export default function MobileLayout() {
  const [screen, setScreen] = useState<MobileScreen>("lockscreen");
  const [openAppId, setOpenAppId] = useState<AppId | null>(null);

  const handleUnlock = useCallback(() => {
    setScreen("home");
  }, []);

  const handleOpenApp = useCallback((id: AppId) => {
    setOpenAppId(id);
    setScreen("app");
  }, []);

  const handleCloseApp = useCallback(() => {
    setScreen("home");
    setTimeout(() => setOpenAppId(null), 400);
  }, []);

  return (
    <div className="h-dvh w-screen overflow-hidden relative bg-black">
      {/* Lock Screen */}
      <AnimatePresence>
        {screen === "lockscreen" && (
          <motion.div
            key="lock"
            className="absolute inset-0"
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <LockScreen onUnlock={handleUnlock} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Home Screen */}
      <AnimatePresence>
        {(screen === "home" || screen === "app") && (
          <motion.div
            key="home"
            className="absolute inset-0"
            initial={screen === "home" ? { opacity: 0, scale: 1.05 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <HomeScreen onOpenApp={handleOpenApp} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* App Window */}
      <AnimatePresence>
        {screen === "app" && openAppId && (
          <AppWindow
            key={`app-${openAppId}`}
            appId={openAppId}
            onClose={handleCloseApp}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
