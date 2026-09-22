"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export interface ProjectRow {
  id: string;
  name: string;
  slug: string;
  category: string;
  status: "Completed" | "InProgress" | "HackathonFinalist";
  date: string;
  published: boolean;
  sortOrder: number;
  tagline?: string | null;
  description: string;
  tech: string[];
  demo: string;
  repo: string;
  duration?: string | null;
  teamSize?: string | null;
  problem?: string | null;
  solution?: string | null;
  myRole?: string | null;
  contributions: string[];
  learnings?: string | null;
  futurePlans?: string | null;
  resultsDescription?: string | null;
  architectureDiagram?: string | null;
  architectureDescription?: string | null;
  relatedProjects: string[];
}

const statusConfig: Record<
  ProjectRow["status"],
  { label: string; className: string }
> = {
  Completed: {
    label: "Completed",
    className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  },
  InProgress: {
    label: "In Progress",
    className: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  },
  HackathonFinalist: {
    label: "Hackathon",
    className: "bg-violet-500/15 text-violet-300 border-violet-500/25",
  },
};

interface ProjectTableProps {
  projects: ProjectRow[];
  onEdit: (project: ProjectRow) => void;
  onDelete: (project: ProjectRow) => void;
}

export function ProjectTable({ projects, onEdit, onDelete }: ProjectTableProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-12 text-center">
        <p className="text-slate-500 text-sm">No projects yet. Create your first one above.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900">
              <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Name</th>
              <th className="text-left px-4 py-3.5 text-slate-400 font-medium">Category</th>
              <th className="text-left px-4 py-3.5 text-slate-400 font-medium">Status</th>
              <th className="text-left px-4 py-3.5 text-slate-400 font-medium">Date</th>
              <th className="text-left px-4 py-3.5 text-slate-400 font-medium">Visibility</th>
              <th className="text-right px-5 py-3.5 text-slate-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {projects.map((project) => {
              const { label, className } = statusConfig[project.status];
              return (
                <tr
                  key={project.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-white">{project.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">{project.slug}</p>
                  </td>
                  <td className="px-4 py-4 text-slate-300">{project.category}</td>
                  <td className="px-4 py-4">
                    <Badge variant="outline" className={className}>
                      {label}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-slate-400">{project.date}</td>
                  <td className="px-4 py-4">
                    <Badge
                      variant="outline"
                      className={
                        project.published
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-slate-700/50 text-slate-400 border-slate-600"
                      }
                    >
                      {project.published ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(project)}
                        className="h-8 px-3 text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <Pencil className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(project)}
                        className="h-8 px-3 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
