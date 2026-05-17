import type { FC, SVGProps } from "react";
import {
  Brain,
  Code,
  Database,
  DatabaseZap,
  FileSearch,
  GalleryVerticalEnd,
  GraduationCap,
  ListVideo,
  Map,
  Rocket,
  Shield,
  Wrench,
  Trophy,
} from "lucide-react";

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
  SiGithub,
} from "react-icons/si";

// ─── Types ────────────────────────────────────────────────────────────────────
export type IconType = FC<SVGProps<SVGSVGElement>>;

export type ProficiencyLevelName =
  | "Exploring"
  | "Beginner"
  | "Learning"
  | "Intermediate"
  | "Comfortable"
  | "Advanced";

export interface ProficiencyDetail {
  level: number;
  color: string;
  description: string;
}

export interface Skill {
  name: string;
  proficiency: ProficiencyLevelName;
  projects: number;
  icon: IconType;
  status: string;
  color: string;
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

export interface Achievement {
  title: string;
  description: string;
  icon: IconType;
  color: string;
}

// ─── Proficiency Levels ───────────────────────────────────────────────────────
export const proficiencyLevels: Record<
  ProficiencyLevelName,
  ProficiencyDetail
> = {
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

// ─── Skill Categories ─────────────────────────────────────────────────────────
export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    category: "Frontend",
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
        color: "text-sky-400",
      },
      {
        name: "Next.js",
        proficiency: "Intermediate",
        projects: 6,
        icon: SiNextdotjs,
        status: "Production Use",
        color: "text-white",
      },
      {
        name: "JavaScript (ES6+)",
        proficiency: "Intermediate",
        projects: 8,
        icon: SiJavascript,
        status: "Comfortable",
        color: "text-yellow-400",
      },
      {
        name: "TypeScript",
        proficiency: "Learning",
        projects: 5,
        icon: SiTypescript,
        status: "Adopted in Projects",
        color: "text-blue-500",
      },
      {
        name: "HTML5",
        proficiency: "Advanced",
        projects: 15,
        icon: SiHtml5,
        status: "Confident",
        color: "text-orange-500",
      },
      {
        name: "CSS3",
        proficiency: "Advanced",
        projects: 15,
        icon: SiCss3,
        status: "Confident",
        color: "text-blue-600",
      },
      {
        name: "TailwindCSS",
        proficiency: "Intermediate",
        projects: 8,
        icon: SiTailwindcss,
        status: "Daily Use",
        color: "text-cyan-400",
      },
      {
        name: "shadcn / DaisyUI",
        proficiency: "Learning",
        projects: 6,
        icon: GalleryVerticalEnd,
        status: "Used in UI Systems",
        color: "text-gray-300",
      },
      {
        name: "Leaflet.js",
        proficiency: "Exploring",
        projects: 1,
        icon: Map,
        status: "Geospatial Maps",
        color: "text-green-500",
      },
    ],
  },
  {
    id: "backend",
    category: "Backend",
    icon: Database,
    color: "from-green-400 to-emerald-500",
    bgGradient: "from-green-900/20 to-emerald-900/20",
    description: "Server-side logic and API development",
    skills: [
      {
        name: "Node.js",
        proficiency: "Intermediate",
        projects: 6,
        icon: SiNodedotjs,
        status: "Building APIs",
        color: "text-green-400",
      },
      {
        name: "Express.js",
        proficiency: "Intermediate",
        projects: 4,
        icon: SiExpress,
        status: "API Development",
        color: "text-gray-300",
      },
      {
        name: "Prisma ORM",
        proficiency: "Intermediate",
        projects: 2,
        icon: SiPrisma,
        status: "Used in Huddle",
        color: "text-teal-500",
      },
      {
        name: "Convex",
        proficiency: "Learning",
        projects: 1,
        icon: DatabaseZap,
        status: "Hackathon Project",
        color: "text-purple-400",
      },
      {
        name: "Socket.IO",
        proficiency: "Intermediate",
        projects: 3,
        icon: SiSocketdotio,
        status: "Real-time Messaging",
        color: "text-white",
      },
      {
        name: "LiveKit",
        proficiency: "Learning",
        projects: 2,
        icon: ListVideo,
        status: "Video/Audio Calls",
        color: "text-purple-500",
      },
    ],
  },
  {
    id: "databases",
    category: "Databases",
    icon: Database,
    color: "from-orange-400 to-red-500",
    bgGradient: "from-orange-900/20 to-red-900/20",
    description: "Relational and non-relational data storage",
    skills: [
      {
        name: "MongoDB",
        proficiency: "Intermediate",
        projects: 4,
        icon: SiMongodb,
        status: "Full-Stack Apps",
        color: "text-green-500",
      },
      {
        name: "PostgreSQL",
        proficiency: "Intermediate",
        projects: 2,
        icon: SiPostgresql,
        status: "Used in Huddle",
        color: "text-blue-500",
      },
      {
        name: "SQL",
        proficiency: "Intermediate",
        projects: 3,
        icon: FileSearch,
        status: "Academic & Projects",
        color: "text-gray-300",
      },
    ],
  },
  {
    id: "tools",
    category: "Tools",
    icon: Wrench, // was ToolCase which doesn't exist
    color: "from-purple-400 to-pink-500",
    bgGradient: "from-purple-900/20 to-pink-900/20",
    description: "Development and collaboration tools",
    skills: [
      {
        name: "Git & GitHub",
        proficiency: "Comfortable",
        projects: 20,
        icon: SiGithub,
        status: "Daily Use",
        color: "text-white",
      },
      {
        name: "Postman",
        proficiency: "Intermediate",
        projects: 6,
        icon: SiPostman,
        status: "API Testing",
        color: "text-orange-500",
      },
      {
        name: "Vercel",
        proficiency: "Learning",
        projects: 4,
        icon: SiVercel,
        status: "Deployments",
        color: "text-white",
      },
      {
        name: "Clerk",
        proficiency: "Comfortable",
        projects: 2,
        icon: SiClerk,
        status: "Auth Management",
        color: "text-indigo-400",
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
        color: "text-blue-400",
      },
      // {
      //   name: "LangChain",
      //   proficiency: "Learning",
      //   projects: 2,
      //   icon: SiLangchain,
      //   status: "RAG & AI Workflows",
      //   color: "text-lime-400",
      // },
      // {
      //   name: "Hugging Face",
      //   proficiency: "Exploring",
      //   projects: 1,
      //   icon: SiHuggingface,
      //   status: "Model Experimentation",
      //   color: "text-yellow-400",
      // },
    ],
  },
];

// ─── Achievements ─────────────────────────────────────────────────────────────
export const achievements: Achievement[] = [
  {
    title: "HackByte 3.0 Finalist",
    description: "Top 10 finalist among 120+ teams for Sync-City",
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
    description: "Shipped AI-powered and real-time production apps",
    icon: Rocket,
    color: "text-green-400",
  },
  {
    title: "Certified",
    description: "Postman API Fundamentals & Cisco Networking Basics",
    icon: Shield,
    color: "text-purple-400",
  },
];
