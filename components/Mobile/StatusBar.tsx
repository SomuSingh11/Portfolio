"use client";

import { memo } from "react";
import { useCurrentTime } from "@/hooks/ui/useCurrentTime";

interface StatusBarProps {
  /** transparent = over wallpaper, opaque = inside an app */
  variant?: "transparent" | "opaque";
}

// Fake signal bars SVG
function SignalBars() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
      <rect x="0" y="8" width="3" height="4" rx="0.5" opacity="1" />
      <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" opacity="1" />
      <rect x="9" y="3" width="3" height="9" rx="0.5" opacity="1" />
      <rect x="13.5" y="0" width="3" height="12" rx="0.5" opacity="0.3" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
      <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" opacity="1" />
      <path
        d="M3.5 6.5C4.9 5.1 6.4 4.3 8 4.3s3.1.8 4.5 2.2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="1"
      />
      <path
        d="M1 4C3 2 5.4 1 8 1s5 1 7 3"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

function BatteryIcon({ level = 78 }: { level?: number }) {
  return (
    <div className="flex items-center space-x-0.5">
      <span className="text-[10px] font-medium">{level}%</span>
      <div className="relative w-6 h-3 border border-current rounded-[2px] opacity-90">
        <div
          className="absolute inset-[1px] rounded-[1px] bg-current"
          style={{ width: `${level}%` }}
        />
        {/* battery tip */}
        <div className="absolute -right-[3px] top-[3px] w-[2px] h-[4px] bg-current rounded-r-[1px]" />
      </div>
    </div>
  );
}

const StatusBar = memo(function StatusBar({
  variant = "transparent",
}: StatusBarProps) {
  const time = useCurrentTime();

  const timeStr = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div
      className={`flex items-center justify-between px-5 pt-2 pb-1 select-none ${
        variant === "transparent" ? "text-white" : "text-white bg-black/20"
      }`}
      style={{ height: "44px" }}
    >
      {/* Time */}
      <span className="text-[15px] font-semibold tracking-tight">
        {timeStr}
      </span>

      {/* Dynamic Island placeholder */}
      <div className="w-[120px] h-[34px] bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-0" />

      {/* Right: signal, wifi, battery */}
      <div className="flex items-center space-x-1.5 text-white">
        <SignalBars />
        <WifiIcon />
        <BatteryIcon level={78} />
      </div>
    </div>
  );
});

export default StatusBar;
