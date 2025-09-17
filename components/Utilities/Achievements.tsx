import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { achievements } from "@/components/data/skillsData";
import { Award } from "lucide-react";

function Achievements() {
  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
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
      </AnimatePresence>
    </div>
  );
}

export default Achievements;
