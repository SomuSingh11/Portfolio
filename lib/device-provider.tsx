"use client";
import { createContext, useContext, useEffect, useState } from "react";

// Context
interface DeviceContextProps {
  isMobile: boolean;
}

const DeviceContext = createContext<DeviceContextProps | undefined>(undefined);

// Provider
export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-black via-gray-900 to-black text-gray-200 px-6 text-center">
        {/* Icon */}
        <div className="mb-6">
          <span className="text-5xl animate-pulse">📱</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          Best Viewed on Larger Screens
        </h1>

        {/* Message */}
        <p className="text-gray-400 max-w-md mb-6 leading-relaxed">
          Hey there 👋, my portfolio is currently designed as a{" "}
          <strong className="text-white">desktop OS–style experience</strong>{" "}
          and isn’t fully optimized for smaller screens yet.
          <br />
          For the best experience, please check it out on a laptop or desktop.
        </p>

        {/* Quick Links */}
        <div className="flex space-x-6">
          <a
            href="https://github.com/SomuSingh11"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 transition"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/somusingh11"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 transition"
          >
            LinkedIn
          </a>
          <a
            href="/Resume_Somu11.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 transition"
          >
            Resume
          </a>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-600 mt-8">
          A portfolio by Somu Singh • Designed with a desktop-first mindset
        </p>
        <p>Codex OS</p>
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
