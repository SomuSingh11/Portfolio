"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Minus, Square, RotateCcw } from "lucide-react";
import { WindowData } from "@/types/desktop";
import { useDesktopStore } from "@/lib/desktop-store";

// Import application components
import Terminal from "@/components/Applications/Terminal";
import Projects from "@/components/Applications/Projects";
import About from "@/components/Applications/About";
import Skills from "@/components/Applications/Skills";
import Contact from "@/components/Applications/Contact";
import GitHub from "@/components/Applications/GitHub";

interface WindowProps {
  window: WindowData;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
}

export default function Window({
  window,
  onClose,
  onMinimize,
  onFocus,
}: WindowProps) {
  const { updateWindow } = useDesktopStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleMaximize = () => {
    const newWindow = {
      ...window,
      isMaximized: !window.isMaximized,
      position: window.isMaximized ? { x: 200, y: 100 } : { x: 0, y: 0 },
      size: window.isMaximized
        ? { width: 800, height: 600 }
        : {
            width: window.innerWidth || 1200,
            height: (window.innerHeight || 800) - 60,
          },
    };
    updateWindow(newWindow);
  };

  const renderContent = () => {
    switch (window.content) {
      case "terminal":
        return <Terminal />;
      case "projects":
        return <Projects />;
      case "about":
        return <About />;
      case "skills":
        return <Skills />;
      case "contact":
        return <Contact />;
      case "github":
        return <GitHub />;
      default:
        return <div className="p-4 text-white">Application not found</div>;
    }
  };

  if (window.isMinimized) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="absolute bg-gray-900 border border-gray-600 rounded-lg shadow-2xl overflow-hidden"
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
      }}
      onClick={onFocus}
      drag
      dragMomentum={false}
      dragConstraints={{
        left: 0,
        right: (window.innerWidth || 1200) - window.size.width,
        top: 0,
        bottom: (window.innerHeight || 800) - window.size.height - 60,
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e, info) => {
        setIsDragging(false);
        updateWindow({
          ...window,
          position: {
            x: Math.max(0, window.position.x + info.offset.x),
            y: Math.max(0, window.position.y + info.offset.y),
          },
        });
      }}
      dragElastic={0}
    >
      {/* Window Header */}
      <div
        ref={dragRef}
        className={`h-10 bg-gray-800 border-b border-gray-600 flex items-center justify-between px-4 cursor-move ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <button
              onClick={onClose}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            />
            <button
              onClick={onMinimize}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
            />
            <button
              onClick={handleMaximize}
              className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
            />
          </div>
          <span className="text-white text-sm font-medium select-none">
            {window.title}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onMinimize}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={handleMaximize}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          >
            {window.isMaximized ? (
              <RotateCcw className="w-3 h-3" />
            ) : (
              <Square className="w-3 h-3" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white hover:bg-red-600 rounded transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="h-full overflow-hidden">{renderContent()}</div>

      {/* Resize Handle */}
      {!window.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 hover:opacity-100 transition-opacity"
          style={{
            background:
              "linear-gradient(-45deg, transparent 0%, transparent 40%, #666 40%, #666 60%, transparent 60%)",
          }}
        />
      )}
    </motion.div>
  );
}
