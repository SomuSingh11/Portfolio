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

// type
type Section =
  | "terminal"
  | "about"
  | "skills"
  | "projects"
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
              <SelectTrigger className="w-[120px] text-gray-300 text-sm bg-white/10 border-white/20 backdrop-blur-sm shadow-lg rounded-full ">
                <SelectValue placeholder="Select Section" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-white  border-white/20 backdrop-blur-md rounded-lg">
                <SelectItem value="about">About</SelectItem>
                <SelectItem value="terminal">Terminal</SelectItem>
                <SelectItem value="resume">Resume</SelectItem>
                <SelectItem value="github">GitHub</SelectItem>
                <SelectItem value="projects">Projects</SelectItem>
                <SelectItem value="skills">Skills</SelectItem>
                <SelectItem value="contact">Contact</SelectItem>
                <SelectItem value="achievements">Achievements</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vertical Divider */}
          <div className="h-8 w-px bg-white/20 mx-4" />

          {/* System Tray */}
          <div className="text-white text-sm font-semibold">
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
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
