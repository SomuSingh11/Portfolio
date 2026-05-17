"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { AppId } from "@/types/desktop";
import type { MobileScreen } from "@/config/mobileConfig";
import LockScreen from "@/components/Mobile/LockScreen";
import HomeScreen from "@/components/Mobile/HomeScreen";
import AppWindow from "@/components/Mobile/AppWindow";

export default function MobileLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const urlAppId = searchParams.get("app") as AppId | null;

  const [screen, setScreen] = useState<MobileScreen>("lockscreen");
  const [openAppId, setOpenAppId] = useState<AppId | null>(null);

  // Sync state with URL params
  useEffect(() => {
    if (urlAppId) {
      setOpenAppId(urlAppId);
      if (screen !== "app") setScreen("app");
    } else {
      // User pressed back or we have no app query
      if (screen === "app") {
        setScreen("home");
        setTimeout(() => setOpenAppId(null), 400); // Wait for the close animation
      }
    }
  }, [urlAppId, screen]);

  const handleUnlock = useCallback(() => {
    if (urlAppId) {
      setScreen("app");
    } else {
      setScreen("home");
    }
  }, [urlAppId]);

  const handleOpenApp = useCallback(
    (id: AppId) => {
      // Pushing to URL instead of manually setting state.
      // The useEffect will handle the state update!
      router.push(`${pathname}?app=${id}`);
    },
    [router, pathname]
  );

  const handleCloseApp = useCallback(() => {
    // Going back triggers popstate, which clears the query param 
    // and lets our useEffect close the app.
    router.back();
  }, [router]);

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
