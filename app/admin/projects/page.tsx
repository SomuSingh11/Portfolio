"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectOverview } from "@/components/admin/projects/project-overview";
import { ProjectTable, type ProjectRow } from "@/components/admin/projects/project-table";
import { ProjectFormDialog } from "@/components/admin/projects/project-form-dialog";
import { ConfirmDeleteDialog } from "@/components/admin/shared/confirm-delete-dialog";
import { Plus, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editProject, setEditProject] = useState<ProjectRow | null>(null);
  const [deleteProject, setDeleteProject] = useState<ProjectRow | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      setProjects(data);
    } catch {
      toast.error("Could not load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openCreate = () => {
    setEditProject(null);
    setFormOpen(true);
  };

  const openEdit = (project: ProjectRow) => {
    setEditProject(project);
    setFormOpen(true);
  };

  const openDelete = (project: ProjectRow) => {
    setDeleteProject(project);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteProject) return;
    const res = await fetch(`/api/admin/projects/${deleteProject.id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete project");
    toast.success("Project deleted");
    await fetchProjects();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-3"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Admin dashboard
            </Link>
            <h1 className="text-4xl font-bold tracking-tight text-white">Projects</h1>
            <p className="mt-1.5 text-slate-400">
              Manage your portfolio projects — create, edit, and publish.
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 mt-1"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>

        {/* Overview */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl bg-slate-800" />
            ))}
          </div>
        ) : (
          <ProjectOverview projects={projects} />
        )}

        {/* Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-200">
              All Projects
              {!loading && (
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({projects.length})
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl bg-slate-800" />
              ))}
            </div>
          ) : (
            <ProjectTable
              projects={projects}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          )}
        </div>
      </div>

      {/* Dialogs */}
      <ProjectFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        project={editProject}
        onSuccess={fetchProjects}
      />

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${deleteProject?.name}"?`}
        description="This will permanently remove the project and all its data. This cannot be undone."
        onConfirm={handleDelete}
      />
    </main>
  );
}
