"use client";

import { useState, useCallback, ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowLeft } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

interface SidebarLayoutProps {
  title: string;
  nav: NavItem[];
  renderSection: (id: string) => ReactNode;
  defaultSection?: string;
}

export default function SidebarLayout({
  title,
  nav,
  renderSection,
  defaultSection,
}: SidebarLayoutProps) {
  const [active, setActive] = useState<string | null>(defaultSection ?? null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768;
      if (isMobile && active === defaultSection) {
        setActive(null);
      }
    }
  }, []);

  const handleSelect = useCallback((id: string) => setActive(id), []);
  const handleBack = useCallback(() => setActive(null), []);

  return (
    <div className="h-full bg-gray-900 text-white flex overflow-hidden">
      {/* Desktop */}
      <div className="hidden md:flex h-full w-full overflow-hidden">
        <div className="w-52 flex-shrink-0 bg-gray-800/40 border-r border-gray-700/60 flex flex-col py-3">
          <p className="px-4 text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-2">
            {title}
          </p>
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors mx-2 rounded-lg ${
                active === id
                  ? "bg-[hsl(var(--accent-hsl))]/15 text-[hsl(var(--accent-hsl))]"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto min-w-0 flex justify-center">
          <div className="w-full max-w-4xl">
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="p-6 w-full"
                >
                  {renderSection(active)}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex items-center justify-center p-8 text-center"
                >
                  <p className="text-gray-500 text-sm">
                    Select a section to explore
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden h-full w-full flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {!active ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }}
              className="flex-1 overflow-y-auto"
            >
              <div className="px-4 pt-4 pb-2 border-b border-gray-800">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  {title}
                </p>
              </div>
              <div className="py-2">
                {nav.map(({ id, label, description, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleSelect(id)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-800/60 transition-colors border-b border-gray-800/50 last:border-0"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[hsl(var(--accent-hsl))]" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-white">{label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {description}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.18 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex-shrink-0 border-b border-gray-800 px-4 py-3 flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-[hsl(var(--accent-hsl))] text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {title}
                </button>
                <span className="text-white text-sm font-semibold ml-auto">
                  {nav.find((n) => n.id === active)?.label}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {renderSection(active)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
