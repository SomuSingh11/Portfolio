"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import { skillCategories, proficiencyLevels } from "@/data/skillsData";
import type { Skill } from "@/data/skillsData";
import SidebarLayout from "@/components/Utilities/SidebarLayout";

// Build nav items from skillCategories for SidebarLayout
const SKILLS_NAV = skillCategories.map((cat) => ({
  id: cat.id,
  label: cat.category,
  description: cat.description,
  icon: cat.icon,
}));

// ─── Skill Bar ────────────────────────────────────────────────────────────────
const SkillBar = memo(function SkillBar({
  skill,
  index,
}: {
  skill: Skill;
  index: number;
}) {
  const prof = proficiencyLevels[skill.proficiency];
  const Icon = skill.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 hover:border-gray-600/70 transition-colors"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <Icon className={`w-5 h-5 flex-shrink-0 ${skill.color}`} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {skill.name}
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5 truncate">
              {skill.status}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* <span className="text-[10px] text-gray-500 bg-gray-700/80 px-2 py-0.5 rounded-full">
            {skill.projects} projects
          </span> */}
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r ${prof.color} bg-clip-text text-transparent border border-gray-600`}
          >
            {skill.proficiency}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${prof.color}`}
            initial={{ width: 0 }}
            animate={{ width: `${prof.level}%` }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
              delay: index * 0.05 + 0.2,
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-600">
          <span>{prof.description}</span>
          <span>{prof.level}%</span>
        </div>
      </div>
    </motion.div>
  );
});

// ─── Skill detail panel ───────────────────────────────────────────────────────
function SkillDetail({ category }: { category: (typeof skillCategories)[0] }) {
  const Icon = category.icon;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={category.id}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        transition={{ duration: 0.22 }}
        className="p-4 sm:p-5 space-y-4"
      >
        {/* Category header card */}
        <div
          className={`bg-gradient-to-r ${category.bgGradient} border border-gray-700/60 rounded-xl p-4`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-2.5 rounded-xl bg-gradient-to-r ${category.color} flex-shrink-0`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-white">
                {category.category}
              </h2>
              <p className="text-gray-300 text-xs mt-0.5">
                {category.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>{category.skills.length} technologies</span>
          </div>
        </div>

        {/* Skill bars */}
        <div className="space-y-3 pb-4">
          {category.skills.map((skill, i) => (
            <SkillBar key={skill.name} skill={skill} index={i} />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Skills component ────────────────────────────────────────────────────
export default function Skills() {
  const renderSection = (id: string) => {
    const category =
      skillCategories.find((c) => c.id === id) ?? skillCategories[0];
    return <SkillDetail category={category} />;
  };

  return (
    <SidebarLayout
      title="Skills"
      nav={SKILLS_NAV}
      renderSection={renderSection}
      defaultSection="frontend"
    />
  );
}
