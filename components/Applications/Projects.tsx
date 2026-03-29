"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Folder,
  Calendar,
  ImageIcon,
  FolderOpen,
} from "lucide-react";
import { ProjectImageCarousel } from "@/components/Utilities/ProjectImageCarosel";
import projects, { type Project } from "@/data/projectsData";

const STATUS_STYLES: Record<Project["status"], string> = {
  Completed: "bg-green-600/20 text-green-400 border border-green-600/30",
  "In Progress": "bg-yellow-600/20 text-yellow-400 border border-yellow-600/30",
  "Hackathon Finalist":
    "bg-blue-600/20 text-blue-400 border border-blue-600/30",
};

const STATUS_ICON: Record<Project["status"], string> = {
  Completed: "✓",
  "In Progress": "⋯",
  "Hackathon Finalist": "🏆",
};

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);

  const selectProject = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  return (
    <div className="bg-gray-900 text-white flex h-full overflow-hidden">
      {/* ── Sidebar ── */}
      <div className="w-64 flex-shrink-0 bg-gray-800 border-r border-gray-700 flex flex-col h-full">
        <div className="p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-base font-semibold flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-blue-400" />
            <span>Projects</span>
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {projects.map((project, i) => (
            <motion.button
              key={project.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => selectProject(project)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors group ${
                selectedProject.id === project.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <div className="relative flex-shrink-0">
                <Folder
                  className={`w-5 h-5 ${
                    selectedProject.id === project.id
                      ? "text-blue-200"
                      : "text-blue-400"
                  }`}
                />
                {project.status === "In Progress" && (
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-500 rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {project.name}
                </div>
                <div
                  className={`text-xs truncate mt-0.5 ${
                    selectedProject.id === project.id
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {project.category}
                </div>
              </div>
              <span
                className={`text-xs flex-shrink-0 px-1.5 py-0.5 rounded-full font-semibold ${
                  project.status === "Completed"
                    ? "bg-green-600/30 text-green-400"
                    : project.status === "Hackathon Finalist"
                      ? "bg-blue-600/30 text-blue-300"
                      : "bg-yellow-600/30 text-yellow-400"
                }`}
              >
                {STATUS_ICON[project.status]}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Detail Pane ── */}
      <div className="flex-1 bg-gray-900 flex flex-col h-full min-w-0 overflow-hidden">
        {selectedProject ? (
          <>
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-4 flex-shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-white mb-1 truncate">
                    {selectedProject.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {selectedProject.date}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_STYLES[selectedProject.status]
                      }`}
                    >
                      {selectedProject.status}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                  <a
                    href={selectedProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Demo</span>
                  </a>
                  <a
                    href={selectedProject.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white rounded-lg text-xs transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Code</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 min-h-0">
              {/* Carousel */}
              {selectedProject.images.length > 0 ? (
                <ProjectImageCarousel
                  images={selectedProject.images}
                  projectName={selectedProject.name}
                />
              ) : (
                <div className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">No screenshots available</p>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-base font-semibold mb-2">About</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Tech */}
              <div>
                <h3 className="text-base font-semibold mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 bg-blue-600/15 text-blue-400 rounded-lg border border-blue-600/30 text-xs font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-base font-semibold mb-2">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedProject.features.map((f) => (
                    <div
                      key={f}
                      className="flex items-start space-x-2 bg-gray-800 p-3 rounded-lg"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FolderOpen className="w-12 h-12 mx-auto mb-3" />
              <p>Select a project to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
