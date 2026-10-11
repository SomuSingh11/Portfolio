"use client";

import { StatCard } from "@/components/admin/shared/stat-card";
import { FolderOpen, CheckCircle, Clock, Trophy, Globe, FileX } from "lucide-react";

interface Project {
  id: string;
  status: "Completed" | "InProgress" | "HackathonFinalist";
  published: boolean;
}

interface ProjectOverviewProps {
  projects: Project[];
}

export function ProjectOverview({ projects }: ProjectOverviewProps) {
  const total = projects.length;
  const published = projects.filter((p) => p.published).length;
  const unpublished = total - published;
  const completed = projects.filter((p) => p.status === "Completed").length;
  const inProgress = projects.filter((p) => p.status === "InProgress").length;
  const hackathon = projects.filter((p) => p.status === "HackathonFinalist").length;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      <StatCard label="Total Projects" value={total} icon={FolderOpen} accent="blue" />
      <StatCard label="Published" value={published} icon={Globe} accent="emerald" />
      <StatCard label="Unpublished" value={unpublished} icon={FileX} accent="slate" />
      <StatCard label="Completed" value={completed} icon={CheckCircle} accent="emerald" />
      <StatCard label="In Progress" value={inProgress} icon={Clock} accent="amber" />
      <StatCard label="Hackathon" value={hackathon} icon={Trophy} accent="violet" />
    </div>
  );
}
