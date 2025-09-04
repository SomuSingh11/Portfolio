"use client";

import { useState } from "react";
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
import projects from "@/components/data/projectsData";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(projects[0]);

  const selectProject = (project: (typeof projects)[number]) => {
    setSelectedProject(project);
  };

  return (
    <div
      className="bg-gray-900 text-white flex"
      style={{ height: "calc(100% - 5rem)" }} // Adjust 5rem to your navbar's height
    >
      {/* Left Sidebar - Projects List */}
      <div className="w-70 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-blue-400" />
            <span>Projects</span>
          </h2>
        </div>

        <div className="flex-1 overflow-auto">
          {/* Projects */}
          <div className="p-2">
            {projects.map((project, index) => (
              <motion.button
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => selectProject(project)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors group ${
                  selectedProject?.id === project.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <div className="relative">
                  <Folder
                    className={`w-5 h-5 ${
                      selectedProject?.id === project.id
                        ? "text-blue-200"
                        : "text-blue-400"
                    }`}
                  />
                  {project.status === "In Progress" && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {project.name}
                  </div>
                  <div
                    className={`text-xs truncate ${
                      selectedProject?.id === project.id
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {project.category}
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    project.status === "Completed"
                      ? "bg-green-600/20 text-green-400"
                      : "bg-yellow-600/20 text-yellow-400"
                  }`}
                >
                  {project.status === "Completed" ? "✓" : "⋯"}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content Area - Project Details */}
      <div className="flex-1 flex flex-col min-h-0">
        {selectedProject ? (
          <>
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-3">
              <div className="flex items-start justify-between">
                <div className="w-full">
                  <div className="flex justify-between w-full">
                    <h1 className="text-2xl font-bold text-white mb-2">
                      {selectedProject.name}
                    </h1>
                    <div className="flex space-x-3">
                      {/* Live Demo Button */}
                      <a
                        href={selectedProject.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {/* GitHub Source Button */}
                      <a
                        href={selectedProject.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-gray-600 bg-gray-500/10 hover:border-gray-500 hover:bg-gray-500/20 text-gray-300 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                        title="Source Code"
                      >
                        <Github className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedProject.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>{selectedProject.category}</span>
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedProject.status === "Completed"
                          ? "bg-green-600/20 text-green-400 border border-green-600/30"
                          : "bg-yellow-600/20 text-yellow-400 border border-yellow-600/30"
                      }`}
                    >
                      {selectedProject.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 min-h-0">
              {/* Image Carousel */}
              {/* === Image Carousel Integration === */}
              {selectedProject.images && selectedProject.images.length > 0 ? (
                <ProjectImageCarousel
                  images={selectedProject.images}
                  projectName={selectedProject.name}
                />
              ) : (
                <div className="bg-gray-800 rounded-lg p-8 aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                      No images available for this project
                    </p>
                  </div>
                </div>
              )}
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  About This Project
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Technology Stack</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-600/30 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProject.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                Select a project to view details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
