"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import AppIcon from "@/components/Mobile/AppIcon";
import NotificationPanel from "@/components/Mobile/NotificationPanel";
import RecentActivityWidget from "@/components/Utilities/RecentActivityWidget";
import { MOBILE_APPS, DOCK_APPS } from "@/config/mobileConfig";
import type { AppId } from "@/types/desktop";
import { usePreferences } from "@/store/preferences-store";

const APPS_PER_PAGE = 8;
const homeApps = MOBILE_APPS.filter((a) => !DOCK_APPS.includes(a.id));
const dockApps = MOBILE_APPS.filter((a) => DOCK_APPS.includes(a.id));

function chunkApps<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

const appPages = chunkApps(homeApps, APPS_PER_PAGE);

interface HomeScreenProps {
  onOpenApp: (id: AppId) => void;
}

export default function HomeScreen({ onOpenApp }: HomeScreenProps) {
  const [page, setPage] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const { prefs, previewWallpaper } = usePreferences();

  const activeWallpaper = previewWallpaper ?? prefs.wallpaper;

  const handlePageSwipe = useCallback(
    (_: unknown, info: PanInfo) => {
      const threshold = 60;
      if (info.offset.x < -threshold && page < appPages.length - 1) {
        setPage((p) => p + 1);
      } else if (info.offset.x > threshold && page > 0) {
        setPage((p) => p - 1);
      }
    },
    [page],
  );

  // Swipe down anywhere on home screen opens notification panel
  const handleVerticalSwipe = useCallback((_: unknown, info: PanInfo) => {
    if (info.offset.y > 50) {
      setNotifOpen(true);
    }
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden select-none">
      {/* Wallpaper */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${activeWallpaper}')` }}
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* App grid — handles both horizontal page swipe and vertical pull-down */}
      <motion.div
        className="flex-1 relative z-10 flex flex-col"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={handlePageSwipe}
      >
        {/* Pull-down zone at top for notification panel */}
        <motion.div
          className="h-16 w-full absolute top-0 left-0 z-20"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.3}
          onDragEnd={handleVerticalSwipe}
        />

        {/* Live Coding Activity Widget */}
        <div className="pt-14 flex-shrink-0 relative z-30">
          <RecentActivityWidget layout="mobile" />
        </div>

        <div className="flex-1 flex flex-col justify-center pt-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.18 }}
              className="px-5"
            >
              {/* 4-col grid */}
              <div className="grid grid-cols-4 gap-x-3 gap-y-7">
                {appPages[page]?.map((app, i) => (
                  <div key={app.id} className="flex justify-center">
                    <AppIcon
                      app={app}
                      onTap={onOpenApp}
                      layoutId={`icon-${app.id}`}
                      animationDelay={i * 0.035}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Page dots */}
        {appPages.length > 1 && (
          <div className="flex justify-center space-x-1.5 py-4">
            {appPages.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setPage(i)}
                className="rounded-full bg-white"
                animate={{
                  width: i === page ? 20 : 6,
                  height: 6,
                  opacity: i === page ? 1 : 0.35,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Dock */}
      <div className="relative z-10 px-4 pb-10">
        <div className="bg-white/15 backdrop-blur-2xl rounded-[28px] p-3 flex justify-around items-center border border-white/15 shadow-2xl">
          {dockApps.map((app, i) => (
            <AppIcon
              key={app.id}
              app={app}
              onTap={onOpenApp}
              layoutId={`icon-${app.id}`}
              size="dock"
              animationDelay={0.25 + i * 0.06}
            />
          ))}
        </div>
      </div>

      {/* Notification panel */}
      {/* <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} /> */}
    </div>
  );
}
