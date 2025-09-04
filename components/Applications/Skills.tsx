"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Target,
  Award,
  ChevronRight,
  Rocket,
  Brain,
} from "lucide-react";
import { achievements, skillCategories } from "@/components/data/skillsData";
import SkillBar from "@/components/Utilities/SkillBar";

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState("frontend");
  const [showAchievements, setShowAchievements] = useState(false);

  const selectedCategoryData = useMemo(
    () => skillCategories.find((cat) => cat.id === selectedCategory),
    [selectedCategory]
  );

  const totalProjects = useMemo(
    () =>
      skillCategories.reduce(
        (acc, cat) =>
          acc +
          cat.skills.reduce((skillAcc, skill) => skillAcc + skill.projects, 0),
        0
      ),
    []
  );

  return (
    <div className="h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4 text-green-400" />
                <span>Learning Journey</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4 text-blue-400" />
                <span>{totalProjects} Projects Built</span>
              </div>
              <div className="flex items-center space-x-1">
                <Rocket className="w-4 h-4 text-purple-400" />
                <span>Growing Skills</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAchievements(!showAchievements)}
              className="flex items-center space-x-2 bg-yellow-600/20 hover:bg-yellow-600/30 px-4 py-2 rounded-lg transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>Achievements</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className="bg-gray-900 text-white flex h-screen"
        style={{ outline: "none", height: "calc(100% - 1rem)" }}
      >
        {/* Adjusted height for header */}
        {/* Category Selector */}
        <div className="w-70 bg-gray-800 border-r border-gray-700 p-4 overflow-auto h-full">
          <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>Skill Areas</span>
          </h3>
          <div className="space-y-3">
            {skillCategories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.bgGradient} ring-2 ring-purple-500`
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}
                  >
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">{category.category}</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {category.description}
                    </p>
                  </div>
                  {selectedCategory === category.id && (
                    <motion.div layoutId="category-chevron">
                      <ChevronRight className="w-5 h-5 text-purple-400" />
                    </motion.div>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span>•</span>
                  <span>{category.skills.length} technologies</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
        {/* Skills Display */}
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {selectedCategoryData && (
                <>
                  <div
                    className={`bg-gradient-to-r ${selectedCategoryData.bgGradient} p-6 rounded-xl mb-6 border border-gray-700`}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${selectedCategoryData.color}`}
                      >
                        <selectedCategoryData.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">
                          {selectedCategoryData.category}
                        </h2>
                        <p className="text-gray-300">
                          {selectedCategoryData.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span>
                          {selectedCategoryData.skills.length} Technologies
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {selectedCategoryData.skills.map((skill, index) => (
                      <SkillBar key={skill.name} skill={skill} index={index} />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Achievements Modal */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowAchievements(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Award className="w-8 h-8 text-yellow-400" />
                <h3 className="text-2xl font-bold">Learning Achievements</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-700/50 p-4 rounded-lg border border-gray-600"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <achievement.icon
                        className={`w-6 h-6 ${achievement.color}`}
                      />
                      <h4 className="font-bold">{achievement.title}</h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      {achievement.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
