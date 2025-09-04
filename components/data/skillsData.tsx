// src/components/data/skillsData.ts

import type { FC, SVGProps } from "react";
import {
  Brain,
  BrainCircuit,
  Cloud,
  Code,
  Component,
  Database,
  DatabaseBackup,
  DatabaseZap,
  FileCode,
  FileSearch,
  GalleryVerticalEnd,
  GitBranch,
  GraduationCap,
  HeartHandshake,
  KeyRound,
  Leaf,
  Lightbulb,
  Link,
  Map,
  Network,
  Palette,
  Plug,
  Rocket,
  Router,
  Send,
  Shield,
  ShieldCheck,
  ToolCase,
  Triangle,
  Trophy,
  Video,
  Wind,
} from "lucide-react";

// Import brand icons from react-icons
import {
  SiPrisma,
  SiSocketdotio,
  SiMongodb,
  SiPostgresql,
  SiPostman,
  SiVercel,
  SiClerk,
  SiGooglegemini,
  SiLangchain,
  SiHuggingface,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiReact,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiNodedotjs,
  SiExpress,
  SiGit,
  SiGithub,
  SiLivechat,
} from "react-icons/si";

// --- INTERFACE AND TYPE DEFINITIONS ---
export type IconType = FC<SVGProps<SVGSVGElement>>;

export interface ProficiencyDetail {
  level: number;
  color: string;
  description: string;
}

export interface Achievement {
  title: string;
  description: string;
  icon: IconType;
  color: string;
}

export type ProficiencyLevelName = keyof typeof proficiencyLevels;

export interface Skill {
  name: string;
  proficiency: ProficiencyLevelName;
  projects: number;
  icon: IconType;
  status: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  icon: IconType;
  color: string;
  bgGradient: string;
  description: string;
  skills: Skill[];
}

// --- DATA EXPORTS ---

export const proficiencyLevels: Record<string, ProficiencyDetail> = {
  Exploring: {
    level: 25,
    color: "from-gray-400 to-gray-500",
    description: "Just started learning",
  },
  Beginner: {
    level: 40,
    color: "from-yellow-400 to-yellow-500",
    description: "Basic understanding",
  },
  Learning: {
    level: 55,
    color: "from-blue-400 to-blue-500",
    description: "Actively developing skills",
  },
  Intermediate: {
    level: 70,
    color: "from-green-400 to-green-500",
    description: "Can work independently",
  },
  Comfortable: {
    level: 75,
    color: "from-emerald-400 to-emerald-500",
    description: "Confident in usage",
  },
  Advanced: {
    level: 85,
    color: "from-purple-400 to-purple-500",
    description: "Strong proficiency",
  },
};

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    category: "Frontend Development",
    icon: Code,
    color: "from-blue-400 to-cyan-500",
    bgGradient: "from-blue-900/20 to-cyan-900/20",
    description: "Building interactive and responsive user interfaces",
    skills: [
      {
        name: "React.js",
        proficiency: "Intermediate",
        projects: 6,
        icon: SiReact,
        status: "Actively Building",
      },
      {
        name: "Next.js",
        proficiency: "Intermediate",
        projects: 4,
        icon: SiNextdotjs,
        status: "Production Use",
      },
      {
        name: "JavaScript (ES6+)",
        proficiency: "Intermediate",
        projects: 12,
        icon: SiJavascript,
        status: "Comfortable",
      },
      {
        name: "TypeScript",
        proficiency: "Learning",
        projects: 4,
        icon: SiTypescript,
        status: "Adopted in Projects",
      },
      {
        name: "HTML5 & CSS3",
        proficiency: "Advanced",
        projects: 15,
        icon: SiHtml5,
        status: "Confident",
      },
      {
        name: "TailwindCSS",
        proficiency: "Intermediate",
        projects: 8,
        icon: SiTailwindcss,
        status: "Daily Use",
      },
      {
        name: "shadcn / DaisyUI",
        proficiency: "Learning",
        projects: 2,
        icon: GalleryVerticalEnd, // Lucide icon as a proxy
        status: "Used in UI Systems",
      },
      {
        name: "Leaflet.js",
        proficiency: "Exploring",
        projects: 1,
        icon: Map, // Lucide icon
        status: "Geospatial Maps",
      },
    ],
  },
  {
    id: "backend",
    category: "Backend Development",
    icon: Database,
    color: "from-green-400 to-emerald-500",
    bgGradient: "from-green-900/20 to-emerald-900/20",
    description: "Server-side logic and database management",
    skills: [
      {
        name: "Node.js",
        proficiency: "Intermediate",
        projects: 6,
        icon: SiNodedotjs,
        status: "Building APIs",
      },
      {
        name: "Express.js",
        proficiency: "Intermediate",
        projects: 4,
        icon: SiExpress,
        status: "API Development",
      },
      {
        name: "Prisma ORM",
        proficiency: "Learning",
        projects: 2,
        icon: SiPrisma,
        status: "Used in Huddle",
      },
      {
        name: "Convex",
        proficiency: "Exploring",
        projects: 1,
        icon: DatabaseZap,
        status: "Hackathon Project",
      },
      {
        name: "Socket.IO",
        proficiency: "Intermediate",
        projects: 3,
        icon: SiSocketdotio,
        status: "Real-time Messaging",
      },
      {
        name: "LiveKit",
        proficiency: "Learning",
        projects: 2,
        icon: SiLivechat,
        status: "Video/Audio Integration",
      },
    ],
  },
  {
    id: "databases",
    category: "Databases",
    icon: Database,
    color: "from-orange-400 to-red-500",
    bgGradient: "from-orange-900/20 to-red-900/20",
    description: "Relational and non-relational databases",
    skills: [
      {
        name: "MongoDB",
        proficiency: "Intermediate",
        projects: 4,
        icon: SiMongodb,
        status: "Used in Full-Stack Apps",
      },
      {
        name: "PostgreSQL",
        proficiency: "Intermediate",
        projects: 2,
        icon: SiPostgresql,
        status: "Used in Huddle",
      },
      {
        name: "SQL",
        proficiency: "Intermediate",
        projects: 3,
        icon: FileSearch, // Lucide icon
        status: "Academic & Projects",
      },
    ],
  },
  {
    id: "tools",
    category: "Development Tools",
    icon: ToolCase,
    color: "from-purple-400 to-pink-500",
    bgGradient: "from-purple-900/20 to-pink-900/20",
    description: "Essential development and collaboration tools",
    skills: [
      {
        name: "Git & GitHub",
        proficiency: "Comfortable",
        projects: 20,
        icon: SiGithub,
        status: "Daily Use",
      },
      {
        name: "Postman",
        proficiency: "Intermediate",
        projects: 6,
        icon: SiPostman,
        status: "API Testing",
      },
      {
        name: "Vercel",
        proficiency: "Learning",
        projects: 4,
        icon: SiVercel,
        status: "Deployments",
      },
      {
        name: "Clerk",
        proficiency: "Learning",
        projects: 2,
        icon: SiClerk,
        status: "Auth Management",
      },
    ],
  },
  {
    id: "ai-ml",
    category: "AI & ML",
    icon: Brain,
    color: "from-pink-400 to-red-500",
    bgGradient: "from-pink-900/20 to-red-900/20",
    description: "AI-powered tools and frameworks",
    skills: [
      {
        name: "Gemini API",
        proficiency: "Intermediate",
        projects: 3,
        icon: SiGooglegemini,
        status: "Catalyst / AI Tools",
      },
      {
        name: "LangChain",
        proficiency: "Learning",
        projects: 2,
        icon: SiLangchain,
        status: "RAG & AI Workflows",
      },
      {
        name: "Hugging Face",
        proficiency: "Exploring",
        projects: 1,
        icon: SiHuggingface,
        status: "Model Experimentation",
      },
    ],
  },
];

export const achievements: Achievement[] = [
  {
    title: "HackByte 3.0 Finalist",
    description:
      "Top 10 finalist among 120+ teams for Sync-City, an AI-powered collaboration platform",
    icon: Trophy,
    color: "text-yellow-400",
  },
  {
    title: "Strong Academics",
    description: "Maintained 9.04 GPA in Computer Engineering at IET DAVV",
    icon: GraduationCap,
    color: "text-blue-400",
  },
  {
    title: "Project Builder",
    description:
      "Developed AI-powered and real-time applications like Catalyst and Huddle",
    icon: Rocket,
    color: "text-green-400",
  },
  {
    title: "Certified",
    description:
      "Earned Postman API Fundamentals & Cisco Networking Basics certifications",
    icon: Shield,
    color: "text-purple-400",
  },
];
