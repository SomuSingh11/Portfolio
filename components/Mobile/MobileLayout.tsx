"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Terminal,
  FileText,
  GithubIcon,
  Briefcase,
  Book,
  Code,
  Mail,
  Trophy,
} from "lucide-react";
import type { AppId } from "@/types/desktop";
import { useCurrentTime } from "@/hooks/ui/useCurrentTime";
import { APP_META } from "@/config/constants";

// Application components
import About from "@/components/Applications/About";
import Terminal_App from "@/components/Applications/Terminal";
import Resume from "@/components/Applications/Resume";
import GitHub from "@/components/Applications/GitHub";
import Projects from "@/components/Applications/Projects";
import HashNode from "@/components/Applications/HashNode";
import Skills from "@/components/Applications/Skills";
import Contact from "@/components/Applications/Contact";
import GifWindow from "@/components/Utilities/GifWindow";
import { AppErrorBoundary } from "@/components/Utilities/ErrorBoundary";

type MobileSection = AppId;

const NAV_ITEMS: Array<{
  id: MobileSection;
  icon: React.ReactNode;
  label: string;
}> = [
  { id: "about", icon: <User className="w-5 h-5" />, label: "whoami" },
  { id: "terminal", icon: <Terminal className="w-5 h-5" />, label: "Terminal" },
  { id: "resume", icon: <FileText className="w-5 h-5" />, label: "Resume" },
  { id: "github", icon: <GithubIcon className="w-5 h-5" />, label: "GitHub" },
  {
    id: "projects",
    icon: <Briefcase className="w-5 h-5" />,
    label: "Projects",
  },
  { id: "hashnode", icon: <Book className="w-5 h-5" />, label: "Blogs" },
  { id: "skills", icon: <Code className="w-5 h-5" />, label: "Skills" },
  { id: "contact", icon: <Mail className="w-5 h-5" />, label: "Contact" },
  { id: "achievements", icon: <Trophy className="w-5 h-5" />, label: "Awards" },
];

function renderSection(section: MobileSection) {
  switch (section) {
    case "about":
      return <About />;
    case "terminal":
      return <Terminal_App />;
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
    default:
      return <About />;
  }
}

export default function MobileLayout() {
  const [currentSection, setCurrentSection] = useState<MobileSection>("about");
  const currentTime = useCurrentTime();

  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden">
      {/* Mobile Status Bar */}
      <div className="flex-shrink-0 h-10 bg-black/40 backdrop-blur-sm flex items-center justify-between px-4 border-b border-white/10">
        <GifWindow />
        <span className="text-white text-xs font-medium">
          {APP_META[currentSection]?.title ?? currentSection}
        </span>
        <span className="text-gray-300 text-xs font-semibold">
          {currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <AppErrorBoundary appName={APP_META[currentSection]?.title ?? ""}>
              {renderSection(currentSection)}
            </AppErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="flex-shrink-0 bg-black/40 backdrop-blur-xl border-t border-white/10 safe-area-pb">
        <div className="flex items-center overflow-x-auto scrollbar-none px-1 py-1.5 space-x-0.5">
          {NAV_ITEMS.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setCurrentSection(id)}
              className={`flex flex-col items-center flex-shrink-0 px-3 py-1.5 rounded-lg transition-colors min-w-[60px] ${
                currentSection === id
                  ? "bg-blue-600/20 text-blue-400"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              aria-label={label}
              aria-current={currentSection === id ? "page" : undefined}
            >
              {icon}
              <span className="text-[10px] mt-0.5 font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
