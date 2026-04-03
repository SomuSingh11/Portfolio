import type { AppId } from "@/types/desktop";

// ─── Personal Info ────────────────────────────────────────────────────────────
export const PERSONAL_INFO = {
  name: "Somu Singh",
  email: "somusingh0110@gmail.com",
  location: "Indore, MP, India",
  timezone: "IST (UTC+5:30)",
  resumePath: "/Resume_Somu11.pdf",
  avatarUrl: "https://avatars.githubusercontent.com/u/170082343?v=4",
} as const;

// ─── Social Links ─────────────────────────────────────────────────────────────
export const SOCIAL_LINKS = {
  github: "https://github.com/SomuSingh11",
  linkedin: "https://www.linkedin.com/in/somusingh11/",
  x: "https://x.com/SomuSingh_",
  calendly: "https://calendly.com/your-username",
  hashnode: "https://somusblog.hashnode.dev",
} as const;

// ─── External APIs ────────────────────────────────────────────────────────────
export const API_CONFIG = {
  github: {
    username: "SomuSingh11",
    baseUrl: "https://api.github.com",
    reposPerPage: 8,
    allReposPerPage: 100,
  },
  hashnode: {
    host: "somusblog.hashnode.dev",
    apiUrl: "https://gql.hashnode.com",
    postsPerPage: 10,
  },
  web3forms: {
    accessKey: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "",
    submitUrl: "https://api.web3forms.com/submit",
  },
} as const;

// ─── Desktop Configuration ────────────────────────────────────────────────────
export const WALLPAPERS = [
  "/wallpaper/redHair.jpg",
  "/wallpaper/pain.jpg",
  "/wallpaper/ubuntu.jpg",
  "/wallpaper/penguin.jpg",
  "/wallpaper/windowsXp.jpg",
  "/wallpaper/goldFish.jpg",
  "/wallpaper/groot.jpg",
  "/wallpaper/ubuntu1.jpg",
] as const;

export const WINDOW_DEFAULTS = {
  width: 800,
  height: 600,
  offsetPerWindow: 30,
  initialX: 200,
  initialY: 100,
  minZIndex: 1,
} as const;

// ─── App Metadata ─────────────────────────────────────────────────────────────
export const APP_META: Record<
  AppId,
  { title: string; icon: string; description: string }
> = {
  terminal: {
    title: "Terminal",
    icon: "terminal.svg",
    description: "Command line interface",
  },
  projects: {
    title: "Projects",
    icon: "folder.svg",
    description: "Portfolio projects",
  },
  about: {
    title: "About Me",
    icon: "fingerprint.svg",
    description: "Personal information",
  },
  skills: {
    title: "Skills",
    icon: "skills.svg",
    description: "Technical skills",
  },
  contact: {
    title: "Contact",
    icon: "contact.svg",
    description: "Get in touch",
  },
  github: {
    title: "GitHub",
    icon: "github.svg",
    description: "GitHub profile",
  },
  resume: {
    title: "Resume",
    icon: "resume.svg",
    description: "Download resume",
  },
  hashnode: {
    title: "Hashnode",
    icon: "Hashnode_icon.svg",
    description: "Blog posts",
  },
  achievements: {
    title: "Achievements",
    icon: "achievements.svg",
    description: "Certifications and awards",
  },
  preferences: {
    title: "Preferences",
    icon: "preferences.svg",
    description: "Customize your experience",
  },
};

// ─── Desktop Icon Positions ───────────────────────────────────────────────────
export const DESKTOP_ICON_LAYOUT: Array<{
  id: AppId;
  position: { x: number; y: number };
}> = [
  { id: "terminal", position: { x: 50, y: 50 } },
  { id: "projects", position: { x: 50, y: 150 } },
  { id: "about", position: { x: 50, y: 250 } },
  { id: "skills", position: { x: 50, y: 350 } },
  { id: "contact", position: { x: 50, y: 450 } },
  { id: "github", position: { x: 170, y: 52 } },
  { id: "resume", position: { x: 165, y: 150 } },
  { id: "hashnode", position: { x: 158, y: 247 } },
];

// ─── Animation Presets ────────────────────────────────────────────────────────
export const ANIMATION_PRESETS = {
  springSnappy: { type: "spring", stiffness: 400, damping: 40 } as const,
  springGentle: { type: "spring", stiffness: 300, damping: 30 } as const,
  springBouncy: { type: "spring", stiffness: 500, damping: 25 } as const,
  fadeFast: { duration: 0.15 } as const,
  fadeNormal: { duration: 0.3 } as const,
  fadeSlow: { duration: 0.5 } as const,
} as const;

// ─── Z-Index Layers ───────────────────────────────────────────────────────────
export const Z_LAYERS = {
  desktop: 0,
  icons: 10,
  windows: 20, // windows stack from here
  contextMenu: 200,
  taskbar: 300,
  modal: 400,
  toast: 500,
} as const;
