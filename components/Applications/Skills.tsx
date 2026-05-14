"use client";

import { useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight } from "lucide-react";
import { skillCategories, proficiencyLevels } from "@/data/skillsData";
import type { Skill } from "@/data/skillsData";

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

// ─── Category button — sidebar version (desktop) ──────────────────────────────
function CategoryButtonDesktop({
  category,
  isSelected,
  onClick,
}: {
  category: (typeof skillCategories)[0];
  isSelected: boolean;
  onClick: () => void;
}) {
  const Icon = category.icon;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`w-full p-3.5 rounded-xl text-left transition-all ${
        isSelected
          ? `bg-gradient-to-r ${category.bgGradient} ring-1 ring-gray-500`
          : "bg-gray-700/50 hover:bg-gray-700"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg bg-gradient-to-r ${category.color} flex-shrink-0`}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-white truncate">
            {category.category}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5 truncate">
            {category.description}
          </p>
        </div>
        {isSelected && (
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </div>
      <p className="text-[10px] text-gray-500 mt-2 ml-11">
        {category.skills.length} technologies
      </p>
    </motion.button>
  );
}

// ─── Category button — tab version (mobile) ───────────────────────────────────
function CategoryTabsMobile({
  categories,
  active,
  onSelect,
}: {
  categories: typeof skillCategories;
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none px-4 py-3 border-b border-gray-800">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
              isActive
                ? `bg-gradient-to-r ${cat.color} text-white shadow-sm`
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {cat.category}
          </button>
        );
      })}
    </div>
  );
}

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
  const [selectedCategory, setSelectedCategory] = useState("frontend");

  const selectedCategoryData = useMemo(
    () =>
      skillCategories.find((c) => c.id === selectedCategory) ??
      skillCategories[0],
    [selectedCategory],
  );

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* ── MOBILE: horizontal tab strip ── */}
      <div className="md:hidden flex-shrink-0">
        <CategoryTabsMobile
          categories={skillCategories}
          active={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar — desktop only */}
        <div className="hidden md:flex w-64 lg:w-72 flex-shrink-0 flex-col border-r border-gray-800 overflow-y-auto">
          <div className="p-3 space-y-2">
            {skillCategories.map((cat) => (
              <CategoryButtonDesktop
                key={cat.id}
                category={cat}
                isSelected={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
              />
            ))}
          </div>
        </div>

        {/* Skill detail — full width on mobile, right pane on desktop */}
        <div className="flex-1 overflow-y-auto min-w-0 min-h-0 flex justify-center">
          <div className="w-full max-w-4xl">
            <SkillDetail category={selectedCategoryData} />
          </div>
        </div>
      </div>
    </div>
  );
}
