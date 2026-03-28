"use client";
import { motion } from "framer-motion";

import About from "@/components/Applications/About";
import Contact from "@/components/Applications/Contact";
import GitHub from "@/components/Applications/GitHub";
import Projects from "@/components/Applications/Projects";
import Resume from "@/components/Applications/Resume";
import Skills from "@/components/Applications/Skills";
import Terminal from "@/components/Applications/Terminal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GifWindow from "@/components/Utilities/GifWindow";
import { createContext, useContext, useEffect, useState } from "react";
import Achievements from "@/components/Utilities/Achievements";
import {
  Book,
  Briefcase,
  Code,
  FileText,
  GithubIcon,
  Mail,
  TerminalSquare,
  Trophy,
  User,
} from "lucide-react";
import HashNode from "@/components/Applications/HashNode";

// type
type Section =
  | "terminal"
  | "about"
  | "skills"
  | "projects"
  | "hashnode"
  | "contact"
  | "github"
  | "resume"
  | "achievements";

// Context
interface DeviceContextProps {
  isMobile: boolean;
}

const DeviceContext = createContext<DeviceContextProps | undefined>(undefined);

// Provider
export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section>("about");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const renderSection = () => {
    switch (currentSection) {
      case "terminal":
        return <Terminal />;
      case "about":
        return <About />;
      case "skills":
        return <Skills />;
      case "projects":
        return <Projects />;
      case "hashnode":
        return <HashNode />;
      case "contact":
        return <Contact />;
      case "github":
        return <GitHub />;
      case "resume":
        return <Resume />;
      case "achievements":
        return <Achievements />;
      default:
        return <About />;
    }
  };

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex-1 overflow-y-auto">{renderSection()}</div>
        <div className="fixed bottom-0 left-0 right-0 h-14 bg-black/30 backdrop-blur-lg border-t border-white/20 flex items-center justify-between px-4 z-50">
          {/* Start Menu */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <GifWindow />
          </motion.div>

          {/* Vertical Divider */}
          <div className="h-8 w-px bg-white/20 mx-4" />

          <div>
            <Select
              value={currentSection}
              onValueChange={(value: Section) => setCurrentSection(value)}
            >
              <SelectTrigger className="w-[135px] text-gray-300 text-sm bg-white/10 border-white/20 backdrop-blur-sm shadow-lg rounded-lg ">
                <SelectValue placeholder="Select Section" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-white border-white/20 backdrop-blur-md rounded-lg">
                <SelectItem value="about">
                  <User className="w-4 h-4" />
                  <span className="mt-0.5 font-medium text-sm">whoami</span>
                </SelectItem>
                <SelectItem value="terminal">
                  <TerminalSquare className="w-4 h-4" />
                  <span className="mt-0.5 font-medium text-sm">Terminal</span>
                </SelectItem>
                <SelectItem value="resume">
                  <FileText className="w-4 h-4" />
                  <span className="mt-0.5 font-medium text-sm">Resume</span>
                </SelectItem>
                <SelectItem value="github">
                  <GithubIcon className="w-4 h-4" />
                  <span className="mt-0.5 font-medium text-sm">GitHub</span>
                </SelectItem>
                <SelectItem value="projects">
                  <Briefcase className="w-4 h-4" />
                  <span className="mt-0.5 font-medium text-sm">Projects</span>
                </SelectItem>
                <SelectItem value="hashnode">
                  <Book className="w-4 h-4" />
                  <span className="mt-0.5 font-medium text-sm">Blogs</span>
                </SelectItem>
                <SelectItem value="skills">
                  <Code className="w-4 h-4" />
                  <span className="mt-0.5 font-medium text-sm">Skills</span>
                </SelectItem>
                <SelectItem value="contact">
                  <Mail className="w-4 h-4" />
                  <span className="mt-0.5 font-medium text-sm">Contact</span>
                </SelectItem>
                <SelectItem value="achievements">
                  <Trophy className="w-4 h-4" />
                  <span className="mt-0.5 font-medium text-sm">
                    Achievements
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vertical Divider */}
          <div className="h-8 w-px bg-white/20 mx-4" />

          {/* System Tray */}
          <div className="flex items-center">
            {/* Time & Date Stack */}
            <div className="flex flex-col items-end">
              <span className="font-semibold text-white">
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="text-xs text-gray-400">
                {currentTime.toLocaleDateString([], {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DeviceContext.Provider value={{ isMobile }}>
      {children}
    </DeviceContext.Provider>
  );
}

// Hook for usage
export function useDevice() {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }
  return context;
}
