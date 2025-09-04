"use client";

import { motion } from "framer-motion";
import { proficiencyLevels, type Skill } from "@/components/data/skillsData";

// Define a clear interface for the component's props
interface SkillBarProps {
  skill: Skill;
  index: number;
}

export default function SkillBar({ skill, index }: SkillBarProps) {
  // 1. Safer data access with a type assertion
  const proficiencyData =
    proficiencyLevels[skill.proficiency as keyof typeof proficiencyLevels];

  // This is correct!
  const IconComponent = skill.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
      }}
      className="group relative"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 flex items-center justify-center">
            <IconComponent
              className={`w-6 h-6 transition-colors ${skill.color}`}
            />
          </div>
          <span className="font-bold text-white">{skill.name}</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-400">{skill.status}</span>
          <span className="font-bold text-white">{skill.proficiency}</span>
        </div>
      </div>

      <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${proficiencyData.color} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${proficiencyData.level}%` }}
          transition={{
            delay: index * 0.1 + 0.3,
            duration: 1.2,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
        </motion.div>

        <div className="absolute top-0 left-0 w-full h-full flex items-center">
          {[25, 50, 75].map((threshold) => (
            <div
              key={threshold}
              className="absolute w-0.5 h-full bg-gray-600/50"
              style={{ left: `${threshold}%` }}
            />
          ))}
        </div>
      </div>

      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-max">
        <div className="text-center">
          <div className="font-bold">{skill.name}</div>
          <div className="text-xs text-gray-300">
            {proficiencyData.description}
          </div>
          {/* You could also add the project count to the tooltip */}
          <div className="text-xs text-gray-400 mt-1">
            {skill.projects} practice projects
          </div>
        </div>
      </div>
    </motion.div>
  );
}
