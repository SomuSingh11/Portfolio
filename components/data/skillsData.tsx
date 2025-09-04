import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Brain,
  Code,
  Database,
  GraduationCap,
  Lightbulb,
  Rocket,
  ToolCase,
} from "lucide-react";

// --- INTERFACE AND TYPE DEFINITIONS ---
export interface ProficiencyDetail {
  level: number;
  color: string;
  description: string;
}

export interface Achievement {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export type ProficiencyLevelName = keyof typeof proficiencyLevels;

export interface Skill {
  name: string;
  proficiency: ProficiencyLevelName;
  projects: number;
  icon: string;
  status: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  icon: LucideIcon;
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
  Advanced: {
    level: 85,
    color: "from-purple-400 to-purple-500",
    description: "Strong proficiency",
  },
  Comfortable: {
    level: 75,
    color: "from-emerald-400 to-emerald-500",
    description: "Confident in usage",
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
        name: "React",
        proficiency: "Intermediate",
        projects: 6,
        icon: "⚛️",
        status: "Actively Learning",
      },
      {
        name: "Next.js",
        proficiency: "Beginner",
        projects: 3,
        icon: "▲",
        status: "Exploring",
      },
      {
        name: "JavaScript",
        proficiency: "Intermediate",
        projects: 12,
        icon: "🟨",
        status: "Comfortable",
      },
      {
        name: "HTML/CSS",
        proficiency: "Advanced",
        projects: 15,
        icon: "🎨",
        status: "Confident",
      },
      {
        name: "TailwindCSS",
        proficiency: "Intermediate",
        projects: 8,
        icon: "🎨",
        status: "Learning",
      },
      {
        name: "TypeScript",
        proficiency: "Beginner",
        projects: 4,
        icon: "🔷",
        status: "Exploring",
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
        proficiency: "Beginner",
        projects: 5,
        icon: "🟢",
        status: "Learning",
      },
      {
        name: "Express",
        proficiency: "Beginner",
        projects: 4,
        icon: "🚄",
        status: "Practicing",
      },
      {
        name: "MongoDB",
        proficiency: "Beginner",
        projects: 3,
        icon: "🍃",
        status: "Exploring",
      },
      {
        name: "Python",
        proficiency: "Intermediate",
        projects: 8,
        icon: "🐍",
        status: "Academic",
      },
      {
        name: "SQL",
        proficiency: "Beginner",
        projects: 2,
        icon: "🗄️",
        status: "Learning",
      },
      {
        name: "APIs",
        proficiency: "Beginner",
        projects: 6,
        icon: "🔗",
        status: "Practicing",
      },
    ],
  },
  {
    id: "tools",
    category: "Development Tools",
    icon: ToolCase,
    color: "from-purple-400 to-pink-500",
    bgGradient: "from-purple-900/20 to-pink-900/20",
    description: "Essential development and design tools",
    skills: [
      {
        name: "Git & GitHub",
        proficiency: "Intermediate",
        projects: 20,
        icon: "📊",
        status: "Daily Use",
      },
      {
        name: "VS Code",
        proficiency: "Advanced",
        projects: 25,
        icon: "💻",
        status: "Primary Editor",
      },
      {
        name: "Figma",
        proficiency: "Beginner",
        projects: 4,
        icon: "🎨",
        status: "Learning",
      },
      {
        name: "Terminal",
        proficiency: "Intermediate",
        projects: 15,
        icon: "⌨️",
        status: "Comfortable",
      },
      {
        name: "Chrome DevTools",
        proficiency: "Intermediate",
        projects: 18,
        icon: "🔧",
        status: "Regular Use",
      },
      {
        name: "npm/yarn",
        proficiency: "Intermediate",
        projects: 12,
        icon: "📦",
        status: "Familiar",
      },
    ],
  },
  {
    id: "learning",
    category: "Currently Learning",
    icon: BookOpen,
    color: "from-yellow-400 to-orange-500",
    bgGradient: "from-yellow-900/20 to-orange-900/20",
    description: "Technologies I'm actively studying and exploring",
    skills: [
      {
        name: "Docker",
        proficiency: "Exploring",
        projects: 1,
        icon: "🐳",
        status: "Tutorial Phase",
      },
      {
        name: "GraphQL",
        proficiency: "Learning",
        projects: 2,
        icon: "📊",
        status: "Understanding Basics",
      },
      {
        name: "Testing (Jest)",
        proficiency: "Beginner",
        projects: 3,
        icon: "🧪",
        status: "Writing First Tests",
      },
      {
        name: "AWS Basics",
        proficiency: "Exploring",
        projects: 1,
        icon: "☁️",
        status: "Free Tier",
      },
      {
        name: "Redux",
        proficiency: "Learning",
        projects: 2,
        icon: "🔄",
        status: "State Management",
      },
    ],
  },
];

export const achievements: Achievement[] = [
  {
    title: "Quick Learner",
    description: "Rapidly picking up new technologies",
    icon: Brain,
    color: "text-purple-400",
  },
  {
    title: "Project Builder",
    description: "Completed multiple personal projects",
    icon: Rocket,
    color: "text-green-400",
  },
  {
    title: "Problem Solver",
    description: "Enjoys tackling coding challenges",
    icon: Lightbulb,
    color: "text-yellow-400",
  },
  {
    title: "Future Developer",
    description: "Committed to continuous learning",
    icon: GraduationCap,
    color: "text-blue-400",
  },
];
