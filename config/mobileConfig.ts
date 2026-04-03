import type { AppId } from "@/types/desktop";

export type MobileScreen = "lockscreen" | "home" | "app";

export interface MobileAppConfig {
  id: AppId;
  label: string;
  icon: string;
  bgGradient: string;
  badgeCount?: number;
}

export const PERSONAL_INFO = {
  name: "Somu Singh",
  title: "Just playing around!!",
};

export const MOBILE_WALLPAPER = "/wallpaper/pain.jpg";

export const MOBILE_APPS: MobileAppConfig[] = [
  {
    id: "about",
    label: "whoami",
    icon: "fingerprint.svg",
    bgGradient: "from-blue-500 to-blue-700",
  },
  {
    id: "projects",
    label: "Projects",
    icon: "folder.svg",
    bgGradient: "from-yellow-500 to-orange-600",
  },
  {
    id: "skills",
    label: "Skills",
    icon: "skills.svg",
    bgGradient: "from-green-500 to-emerald-700",
  },
  {
    id: "github",
    label: "GitHub",
    icon: "github.svg",
    bgGradient: "from-gray-600 to-gray-900",
  },
  {
    id: "hashnode",
    label: "Hashnode",
    icon: "Hashnode_icon.svg",
    bgGradient: "from-blue-600 to-indigo-800",
  },
  {
    id: "resume",
    label: "Resume",
    icon: "resume.svg",
    bgGradient: "from-red-500 to-rose-700",
  },
  {
    id: "contact",
    label: "Contact",
    icon: "contact.svg",
    bgGradient: "from-purple-500 to-purple-800",
  },
  {
    id: "terminal",
    label: "Terminal",
    icon: "terminal.svg",
    bgGradient: "from-gray-800 to-black",
  },
  {
    id: "achievements",
    label: "Awards",
    icon: "achievements.svg",
    bgGradient: "from-amber-500 to-yellow-700",
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: "preferences.svg",
    bgGradient: "from-slate-500 to-slate-700",
  },
];

export const DOCK_APPS: AppId[] = ["terminal", "projects", "contact", "about"];
