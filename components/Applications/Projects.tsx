"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Star, Folder, Calendar } from "lucide-react";

const projects = [
  {
    id: 1,
    name: "E-commerce Platform",
    description:
      "Full-stack e-commerce solution with payment integration, inventory management, and analytics dashboard.",
    tech: ["Next.js", "Stripe", "PostgreSQL", "Prisma", "TailwindCSS"],
    image: "/projects/ecommerce.png",
    demo: "https://demo.example.com",
    repo: "https://github.com/username/ecommerce",
    status: "Completed",
    date: "2024-12",
  },
  {
    id: 2,
    name: "Real-time Chat Application",
    description:
      "Modern chat app with real-time messaging, file sharing, emoji reactions, and voice messages.",
    tech: ["React", "Socket.io", "MongoDB", "Express", "WebRTC"],
    image: "/projects/chat.png",
    demo: "https://chat.example.com",
    repo: "https://github.com/username/chat-app",
    status: "In Progress",
    date: "2025-01",
  },
  {
    id: 3,
    name: "AI-Powered Task Manager",
    description:
      "Intelligent project management tool with AI suggestions, automated scheduling, and team collaboration.",
    tech: ["Vue.js", "OpenAI API", "MySQL", "Docker", "Redis"],
    image: "/projects/tasks.png",
    demo: "https://tasks.example.com",
    repo: "https://github.com/username/task-manager",
    status: "Completed",
    date: "2024-11",
  },
];

export default function Projects() {
  return (
    <div className="h-full bg-gray-900 text-white overflow-y-auto">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <Folder className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold">Projects Portfolio</h1>
          <span className="text-sm text-gray-400">
            ({projects.length} projects)
          </span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-all duration-300"
            >
              {/* Project Header */}
              <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      project.status === "Completed"
                        ? "bg-green-600 text-white"
                        : "bg-yellow-600 text-white"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <h3 className="text-white text-lg font-bold text-center px-4">
                    {project.name}
                  </h3>
                </div>
              </div>

              <div className="p-4">
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded border border-blue-600/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Project Info */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{project.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Featured</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors text-center flex items-center justify-center space-x-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Live Demo</span>
                  </a>

                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-3 rounded transition-colors flex items-center justify-center"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
