"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Award, ChevronRight, Rocket, Brain } from "lucide-react";
import { achievements, skillCategories } from "@/components/data/skillsData";
import SkillBar from "@/components/Utilities/SkillBar";

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState("frontend");
  const [showAchievements, setShowAchievements] = useState(false);

  const selectedCategoryData = useMemo(
    () => skillCategories.find((cat) => cat.id === selectedCategory),
    [selectedCategory]
  );

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className=" hidden md:block bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 p-4 flex-shrink-0 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4 text-green-400" />
                <span>Learning Journey</span>
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

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Category Selector */}
        <div className="w-80 lg:w-70 bg-gray-800 border-r border-gray-700 flex-shrink-0">
          <div className="h-full overflow-y-auto p-4">
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2 top-0 bg-gray-800 pb-2">
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
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate">
                        {category.category}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                    {selectedCategory === category.id && (
                      <motion.div
                        layoutId="category-chevron"
                        className="flex-shrink-0"
                      >
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
        </div>

        {/* Skills Display */}
        <div className="flex-1  bg-gray-900">
          <div className="h-full overflow-y-auto ">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-4 sm:p-6 min-w-100"
              >
                {selectedCategoryData && (
                  <>
                    <div
                      className={`bg-gradient-to-r ${selectedCategoryData.bgGradient} p-4 sm:p-6 rounded-xl mb-6 border border-gray-700`}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${selectedCategoryData.color} flex-shrink-0`}
                        >
                          <selectedCategoryData.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-xl sm:text-2xl font-bold truncate">
                            {selectedCategoryData.category}
                          </h2>
                          <p className="text-gray-300 text-sm sm:text-base">
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
                    <div className="space-y-4 sm:space-y-6 pb-6">
                      {selectedCategoryData.skills.map((skill, index) => (
                        <SkillBar
                          key={skill.name}
                          skill={skill}
                          index={index}
                        />
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
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
