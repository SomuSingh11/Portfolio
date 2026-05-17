import React from "react";
import { motion } from "framer-motion";
import { achievements } from "@/data/skillsData";
import { Award } from "lucide-react";

function Achievements() {
  return (
    <div className="h-full bg-gray-900 text-white overflow-y-auto p-6">
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
              <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
              <h4 className="font-bold">{achievement.title}</h4>
            </div>
            <p className="text-sm text-gray-300">{achievement.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;
