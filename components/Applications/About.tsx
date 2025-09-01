"use client";

import { motion } from "framer-motion";
import { User, MapPin, Calendar, Code, Heart } from "lucide-react";

export default function About() {
  const interests = [
    {
      icon: "☕",
      label: "Coffee Enthusiast",
      desc: "Third-wave coffee and espresso",
    },
    { icon: "🎮", label: "Gaming", desc: "Strategy games and indie titles" },
    {
      icon: "📚",
      label: "Learning",
      desc: "Always exploring new technologies",
    },
    {
      icon: "🏃‍♂️",
      label: "Running",
      desc: "Marathon runner and fitness enthusiast",
    },
    { icon: "🎵", label: "Music", desc: "Electronic and lo-fi hip hop" },
    {
      icon: "🌱",
      label: "Sustainability",
      desc: "Green tech and environmental awareness",
    },
  ];

  return (
    <div className="h-full bg-gray-900 text-white overflow-y-auto">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <User className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold">About Me</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border border-gray-700 rounded-lg p-6"
        >
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl">
              👨‍💻
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">John Doe</h2>
              <p className="text-blue-400 text-lg mb-4">Full Stack Developer</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-green-400" />
                  <span>Available for hire</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-purple-400" />
                  <span>3+ years experience</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>Passionate coder</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* About Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 border border-gray-700 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4">My Story</h3>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              I&apos;m a passionate full-stack developer with over 3 years of
              experience building modern web applications. My journey started
              with curiosity about how websites work, and it quickly evolved
              into a deep love for creating digital solutions that make a
              difference.
            </p>
            <p>
              I specialize in the React ecosystem, particularly Next.js for
              full-stack applications, and I&apos;m always excited to explore
              new technologies. I believe in writing clean, maintainable code
              and creating exceptional user experiences.
            </p>
            <p>
              When I&apos;m not coding, you&apos;ll find me exploring coffee
              shops around San Francisco, contributing to open-source projects,
              or planning my next marathon. I love the intersection of
              technology and creativity.
            </p>
          </div>
        </motion.div>

        {/* Interests Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 border border-gray-700 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Interests & Hobbies</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
              >
                <div className="text-2xl mb-2">{interest.icon}</div>
                <h4 className="font-medium text-white mb-1">
                  {interest.label}
                </h4>
                <p className="text-xs text-gray-400">{interest.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
