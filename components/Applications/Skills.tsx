"use client";

import { motion } from "framer-motion";
import { Code, Database, ToolCase, TestTube, Cloud } from "lucide-react";

const skillCategories = [
  {
    category: "Frontend Development",
    icon: Code,
    color: "text-blue-400",
    skills: [
      { name: "React", level: 95, experience: "3 years" },
      { name: "Next.js", level: 90, experience: "2 years" },
      { name: "TypeScript", level: 85, experience: "2 years" },
      { name: "TailwindCSS", level: 92, experience: "2 years" },
      { name: "Vue.js", level: 75, experience: "1 year" },
      { name: "Framer Motion", level: 80, experience: "1 year" },
    ],
  },
  {
    category: "Backend Development",
    icon: Database,
    color: "text-green-400",
    skills: [
      { name: "Node.js", level: 90, experience: "3 years" },
      { name: "Express", level: 88, experience: "3 years" },
      { name: "PostgreSQL", level: 85, experience: "2 years" },
      { name: "MongoDB", level: 80, experience: "2 years" },
      { name: "Prisma", level: 82, experience: "1 year" },
      { name: "Python", level: 70, experience: "1 year" },
    ],
  },
  {
    category: "Tools & DevOps",
    icon: ToolCase,
    color: "text-purple-400",
    skills: [
      { name: "Git", level: 95, experience: "3 years" },
      { name: "Docker", level: 78, experience: "1 year" },
      { name: "AWS", level: 72, experience: "1 year" },
      { name: "Vercel", level: 90, experience: "2 years" },
      { name: "Figma", level: 85, experience: "2 years" },
      { name: "Linux", level: 80, experience: "2 years" },
    ],
  },
  {
    category: "Testing",
    icon: TestTube,
    color: "text-yellow-400",
    skills: [
      { name: "Jest", level: 85, experience: "2 years" },
      { name: "Cypress", level: 80, experience: "1 year" },
      { name: "Playwright", level: 75, experience: "1 year" },
      { name: "React Testing Library", level: 88, experience: "2 years" },
    ],
  },
];

export default function Skills() {
  return (
    <div className="h-full bg-gray-900 text-white overflow-y-auto">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <Cloud className="w-6 h-6 text-purple-400" />
          <h1 className="text-xl font-bold">Technical Skills</h1>
          <span className="text-sm text-gray-400">(Developer Proficiency)</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <category.icon className={`w-6 h-6 ${category.color}`} />
              <h2 className="text-xl font-bold">{category.category}</h2>
            </div>

            <div className="space-y-4">
              {category.skills.map((skill, skillIndex) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: categoryIndex * 0.1 + skillIndex * 0.05,
                  }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>{skill.experience}</span>
                      <span>•</span>
                      <span>{skill.level}%</span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${
                        category.color.includes("blue")
                          ? "from-blue-500 to-blue-600"
                          : category.color.includes("green")
                          ? "from-green-500 to-green-600"
                          : category.color.includes("purple")
                          ? "from-purple-500 to-purple-600"
                          : "from-yellow-500 to-yellow-600"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{
                        delay: categoryIndex * 0.1 + skillIndex * 0.05 + 0.2,
                        duration: 0.8,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
