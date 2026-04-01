"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, FolderOpen, ArrowLeft, ExternalLink } from "lucide-react";
import projects, { type Project } from "@/data/projects";
import ProjectDetail from "@/components/Projects/ProjectDetail";

const STATUS_ICON: Record<Project["status"], string> = {
  Completed: "✓",
  "In Progress": "⋯",
  "Hackathon Finalist": "🏆",
};

const STATUS_COLOR: Record<Project["status"], string> = {
  Completed: "text-green-400",
  "In Progress": "text-yellow-400",
  "Hackathon Finalist": "text-blue-400",
};

function ProjectListItem({
  project,
  selected,
  onClick,
  index,
}: {
  project: Project;
  selected: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-left transition-colors ${
        selected
          ? "bg-blue-600 text-white"
          : "text-gray-300 hover:bg-gray-700/60"
      }`}
    >
      <div className="relative flex-shrink-0">
        <Folder
          className={`w-5 h-5 ${selected ? "text-blue-200" : "text-blue-400"}`}
        />
        {project.status === "In Progress" && (
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-500 rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{project.name}</div>
        {project.tagline && (
          <div
            className={`text-xs truncate mt-0.5 ${selected ? "text-blue-100" : "text-gray-500"}`}
          >
            {project.tagline}
          </div>
        )}
      </div>
      <span
        className={`text-xs flex-shrink-0 font-bold ${selected ? "text-white" : STATUS_COLOR[project.status]}`}
      >
        {STATUS_ICON[project.status]}
      </span>
    </motion.button>
  );
}

function MobileProjectCard({
  project,
  onClick,
  index,
}: {
  project: Project;
  onClick: () => void;
  index: number;
}) {
  const firstImage = project.media[0];
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      onClick={onClick}
      className="w-full bg-gray-800/60 border border-gray-700 rounded-xl overflow-hidden text-left hover:border-blue-500/50 transition-colors group"
    >
      {firstImage && firstImage.type === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={firstImage.src}
          alt={project.name}
          className="w-full h-36 object-cover group-hover:opacity-90 transition-opacity"
          loading="lazy"
        />
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-bold ${STATUS_COLOR[project.status]}`}>
            {STATUS_ICON[project.status]}
          </span>
          <span className="text-xs text-gray-500">{project.status}</span>
        </div>
        <h3 className="text-base font-bold text-white truncate">
          {project.name}
        </h3>
        {project.tagline && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {project.tagline}
          </p>
        )}
        <div className="flex flex-wrap gap-1 mt-3">
          {project.tech.slice(0, 3).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-[10px] font-medium"
            >
              {t}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="px-2 py-0.5 text-gray-500 text-[10px]">
              +{project.tech.length - 3} more
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");

  const selectProject = useCallback((project: Project) => {
    setSelectedProject(project);
    setMobileView("detail");
  }, []);

  return (
    <div className="bg-gray-900 text-white h-full overflow-hidden flex flex-col">
      {/* MOBILE */}
      <div className="flex flex-col h-full md:hidden">
        <AnimatePresence mode="wait">
          {mobileView === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto"
            >
              <div className="px-4 pt-4 pb-3 border-b border-gray-800 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-blue-400" />
                <h1 className="text-base font-semibold">Projects</h1>
                <span className="ml-auto text-xs text-gray-500">
                  {projects.length} projects
                </span>
              </div>
              <div className="p-4 space-y-4">
                {projects.map((p, i) => (
                  <MobileProjectCard
                    key={p.id}
                    project={p}
                    onClick={() => selectProject(p)}
                    index={i}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex-shrink-0 border-b border-gray-800 px-4 py-3 flex items-center gap-3">
                <button
                  onClick={() => setMobileView("list")}
                  className="flex items-center gap-1.5 text-blue-400 text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Projects
                </button>
                <span className="text-white text-sm font-semibold ml-auto truncate">
                  {selectedProject?.name}
                </span>
                {selectedProject?.demo && (
                  <a
                    href={selectedProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-blue-400"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <div className="flex-1 overflow-y-auto">
                {selectedProject && <ProjectDetail project={selectedProject} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex h-full overflow-hidden">
        <div className="w-64 flex-shrink-0 bg-gray-800/50 border-r border-gray-700/60 flex flex-col">
          <div className="p-4 border-b border-gray-700/60 flex-shrink-0">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-gray-300">
              <FolderOpen className="w-4 h-4 text-blue-400" />
              Projects
              <span className="ml-auto text-xs text-gray-600">
                {projects.length}
              </span>
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {projects.map((p, i) => (
              <ProjectListItem
                key={p.id}
                project={p}
                selected={selectedProject?.id === p.id}
                onClick={() => setSelectedProject(p)}
                index={i}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-hidden min-w-0">
          <AnimatePresence mode="wait">
            {selectedProject ? (
              <motion.div
                key={selectedProject.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-full overflow-y-auto"
              >
                <ProjectDetail project={selectedProject} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center"
              >
                <div className="text-center text-gray-600">
                  <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Select a project to explore</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
