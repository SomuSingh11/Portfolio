"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { WindowData } from "@/types/desktop";

interface TaskbarProps {
  windows: WindowData[];
  onWindowClick: (windowId: string) => void;
}

export default function Taskbar({ windows, onWindowClick }: TaskbarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getWindowIcon = (windowId: string) => {
    const icons: Record<string, string> = {
      terminal: "🖥️",
      projects: "📁",
      about: "👤",
      skills: "⚡",
      contact: "📧",
      github: "🐙",
      resume: "📄",
      blog: "📝",
    };
    return icons[windowId] || "🪟";
  };

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-12 bg-gray-800 border-t border-gray-600 flex items-center justify-between px-4 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Start Menu */}
      <div className="flex items-center space-x-4">
        <motion.button
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-white text-sm font-medium transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>🐧</span>
          <span>Portfolio OS</span>
        </motion.button>
      </div>

      {/* Open Windows */}
      <div className="flex items-center space-x-2 flex-1 mx-4">
        {windows
          .filter((w) => !w.isMinimized)
          .map((window) => (
            <motion.button
              key={window.id}
              onClick={() => onWindowClick(window.id)}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded text-white text-sm transition-colors max-w-48"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              whileHover={{ scale: 1.02 }}
            >
              <span>{getWindowIcon(window.id)}</span>
              <span className="truncate">{window.title}</span>
            </motion.button>
          ))}
      </div>

      {/* System Tray */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-gray-300 text-sm">
          <span>🔊</span>
          <span>📶</span>
          <span>🔋</span>
        </div>

        <div className="text-white text-sm font-mono">
          {currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </motion.div>
  );
}
