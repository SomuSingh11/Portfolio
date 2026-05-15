"use client";

import { useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import type { AppId } from "@/types/desktop";
import { APP_META } from "@/config/constants";
import { AppErrorBoundary } from "@/components/Utilities/ErrorBoundary";

// App components
import About from "@/components/Applications/About";
import Terminal from "@/components/Applications/Terminal";
import Resume from "@/components/Applications/Resume";
import GitHub from "@/components/Applications/GitHub";
import Projects from "@/components/Applications/Projects";
import Skills from "@/components/Applications/Skills";
import Contact from "@/components/Applications/Contact";
import Preferences from "@/components/Applications/Preferences";
import Achievements from "../Utilities/Achievements";
import { Home } from "lucide-react";

function AppContent({ appId }: { appId: AppId }) {
  switch (appId) {
    case "about":
      return <About />;
    case "terminal":
      return <Terminal />;
    case "resume":
      return <Resume />;
    case "github":
      return <GitHub />;
    case "projects":
      return <Projects />;
    case "skills":
      return <Skills />;
    case "contact":
      return <Contact />;
    case "achievements":
      return <Achievements />;
    case "preferences":
      return <Preferences />;
    default:
      return <About />;
  }
}

interface AppWindowProps {
  appId: AppId;
  onClose: () => void;
}

export default function AppWindow({ appId, onClose }: AppWindowProps) {
  const meta = APP_META[appId];

  // Drag down fast to go home
  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.y > 80 && info.velocity.y > 200) {
        onClose();
      }
    },
    [onClose],
  );

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 z-30 flex flex-col bg-gray-900 overflow-hidden"
        initial={{ y: "100%", borderRadius: "24px", scale: 0.96 }}
        animate={{ y: 0, borderRadius: "0px", scale: 1 }}
        exit={{ y: "100%", borderRadius: "24px", scale: 0.96, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 40 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.25 }}
        onDragEnd={handleDragEnd}
        dragListener={false}
      >
        {/* App header — no status bar, just a slim nav bar */}
        <div
          className="flex-shrink-0 bg-gray-900 border-b border-white/5 flex items-center px-4 gap-3"
          // This area is draggable to close
          onPointerDown={(e) => {
            // allow framer drag on this element
            e.currentTarget.dispatchEvent(
              new PointerEvent("pointerdown", {
                bubbles: true,
                clientX: e.clientX,
                clientY: e.clientY,
              }),
            );
          }}
        ></div>

        {/* App content */}
        <div className="flex-1 overflow-hidden min-h-0">
          <AppErrorBoundary appName={meta.title}>
            <AppContent appId={appId} />
          </AppErrorBoundary>
        </div>

        {/* Bottom nav bar */}
        <div className="flex-shrink-0 bg-gray-900 border-t border-gray-700/50 flex items-center justify-center py-2.5 safe-area-pb">
          <motion.button
            onTap={onClose}
            whileTap={{ scale: 0.93 }}
            className="flex items-center gap-1.5 bg-gray-800/80 active:bg-gray-700 text-white/70 active:text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            <Home size={15} />
            Home
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
