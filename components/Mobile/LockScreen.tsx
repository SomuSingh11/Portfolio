"use client";

import { useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useCurrentTime } from "@/hooks/ui/useCurrentTime";
import { PERSONAL_INFO } from "@/config/constants";
import { usePreferences } from "@/store/preferences-store";

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const time = useCurrentTime();
  const [unlocked, setUnlocked] = useState(false);

  const { prefs, previewWallpaper } = usePreferences();
  const activeWallpaper = previewWallpaper ?? prefs.wallpaper;

  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, -200], [1, 0]);

  const timeStr = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const dateStr = time.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
      if (info.offset.y < -80 || info.velocity.y < -400) {
        setUnlocked(true);
        setTimeout(onUnlock, 350);
      } else {
        y.set(0);
      }
    },
    [onUnlock, y],
  );

  return (
    <AnimatePresence>
      {!unlocked && (
        <motion.div
          className="absolute inset-0 overflow-hidden select-none"
          style={{ opacity }}
          exit={{
            y: "-100%",
            opacity: 0,
            transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
          }}
        >
          {/* Wallpaper */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${activeWallpaper}')` }}
          />
          <div className="absolute inset-0 bg-black/40" />

          {/* Draggable content */}
          <motion.div
            className="absolute inset-0 flex flex-col"
            drag="y"
            dragConstraints={{ top: -300, bottom: 0 }}
            dragElastic={0.15}
            style={{ y }}
            onDragEnd={handleDragEnd}
          >
            {/* Clock — centered, pushes away from real status bar naturally */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="text-center"
              >
                {/* Big time */}
                <div
                  className="text-white font-extralight tracking-tight"
                  style={{
                    fontSize: "clamp(80px, 24vw, 104px)",
                    lineHeight: 1,
                  }}
                >
                  {timeStr}
                </div>

                {/* Date */}
                <div className="text-white/75 text-lg font-light mt-2 tracking-wide">
                  {dateStr}
                </div>

                {/* Name tag */}
                <div className="mt-10 flex flex-col items-center">
                  <div className="w-12 h-px bg-white/25 mb-5" />
                  <p className="text-white/50 text-xs font-light tracking-[0.25em] uppercase">
                    Codex OS
                  </p>
                  <p className="text-white text-xl font-medium mt-1.5">
                    {PERSONAL_INFO.name}
                  </p>
                  <p className="text-white/45 text-sm mt-0.5 font-light">
                    Full Stack Developer
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Swipe up indicator */}
            <motion.div
              className="flex flex-col items-center pb-12"
              animate={{ y: [0, -7, 0] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="flex flex-col items-center space-y-[-7px] mb-2.5">
                {[0.25, 0.55, 1].map((op, i) => (
                  <svg
                    key={i}
                    width="20"
                    height="12"
                    viewBox="0 0 20 12"
                    fill="none"
                  >
                    <path
                      d="M2 10 L10 2 L18 10"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={op}
                    />
                  </svg>
                ))}
              </div>
              <p className="text-white/40 text-[11px] tracking-widest uppercase font-light">
                Swipe up
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
