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
import HashNode from "@/components/Applications/HashNode";
import Skills from "@/components/Applications/Skills";
import Contact from "@/components/Applications/Contact";
import { ChevronLeft } from "lucide-react";
import Achievements from "../Utilities/Achievements";

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
    case "hashnode":
      return <HashNode />;
    case "skills":
      return <Skills />;
    case "contact":
      return <Contact />;
    case "achievements":
      return <Achievements />;
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
          className="flex-shrink-0 bg-gray-900 border-b border-white/5 flex items-center px-4 py-3 gap-3"
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
        >
          {/* Home text button — left */}
          <motion.button
            onTap={onClose}
            whileTap={{ scale: 0.9 }}
            className="flex items-center space-x-1 text-blue-400 active:opacity-70"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Home</span>
          </motion.button>

          {/* App name + icon — centered */}
          {/* <div className="flex-1 flex items-center justify-center space-x-2">
            <Image
              src={`/icons/breeze/${meta.icon}`}
              alt={meta.title}
              width={20}
              height={20}
              className="object-contain"
            />
            <span className="text-white text-sm font-semibold">
              {meta.title}
            </span>
          </div> */}

          {/* Spacer to keep title centered */}
          <div className="shrink-0 w-10" />
        </div>

        {/* App content */}
        <div className="flex-1 overflow-hidden min-h-0">
          <AppErrorBoundary appName={meta.title}>
            <AppContent appId={appId} />
          </AppErrorBoundary>
        </div>

        {/* Home indicator */}
        <div className="flex-shrink-0 flex justify-center py-2 bg-gray-900/80">
          <div className="w-32 h-1 bg-white/20 rounded-full" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
