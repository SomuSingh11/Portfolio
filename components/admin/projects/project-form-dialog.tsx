"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/components/admin/shared/form-field";
import { ChevronDown, ChevronUp } from "lucide-react";
import { type ProjectRow } from "./project-table";
import toast from "react-hot-toast";

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: ProjectRow | null; // null/undefined = create, defined = edit
  onSuccess: () => void;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const emptyForm = {
  name: "",
  slug: "",
  category: "",
  status: "InProgress" as ProjectRow["status"],
  date: new Date().toISOString().slice(0, 10),
  tagline: "",
  description: "",
  tech: "",
  demo: "",
  repo: "",
  published: false,
  sortOrder: 0,
  // optional rich fields
  duration: "",
  teamSize: "",
  problem: "",
  solution: "",
  myRole: "",
  contributions: "",
  learnings: "",
  futurePlans: "",
  resultsDescription: "",
  architectureDiagram: "",
  architectureDescription: "",
};

type FormState = typeof emptyForm;

function projectToForm(p: ProjectRow): FormState {
  return {
    name: p.name,
    slug: p.slug,
    category: p.category,
    status: p.status,
    date: p.date,
    tagline: p.tagline ?? "",
    description: p.description,
    tech: p.tech.join(", "),
    demo: p.demo,
    repo: p.repo,
    published: p.published,
    sortOrder: p.sortOrder,
    duration: p.duration ?? "",
    teamSize: p.teamSize ?? "",
    problem: p.problem ?? "",
    solution: p.solution ?? "",
    myRole: p.myRole ?? "",
    contributions: p.contributions.join(", "),
    learnings: p.learnings ?? "",
    futurePlans: p.futurePlans ?? "",
    resultsDescription: p.resultsDescription ?? "",
    architectureDiagram: p.architectureDiagram ?? "",
    architectureDescription: p.architectureDescription ?? "",
  };
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
  onSuccess,
}: ProjectFormDialogProps) {
  const isEdit = Boolean(project);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (open) {
      setForm(project ? projectToForm(project) : emptyForm);
      setErrors({});
      setShowAdvanced(false);
    }
  }, [open, project]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // auto-generate slug from name in create mode
      if (key === "name" && !isEdit) {
        next.slug = slugify(String(value));
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.slug.trim()) errs.slug = "Slug is required";
    if (!form.category.trim()) errs.category = "Category is required";
    if (!form.description.trim()) errs.description = "Description is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        category: form.category.trim(),
        status: form.status,
        date: form.date,
        tagline: form.tagline.trim() || null,
        description: form.description.trim(),
        tech: form.tech.split(",").map((t) => t.trim()).filter(Boolean),
        demo: form.demo.trim(),
        repo: form.repo.trim(),
        published: form.published,
        sortOrder: Number(form.sortOrder),
        duration: form.duration.trim() || null,
        teamSize: form.teamSize.trim() || null,
        problem: form.problem.trim() || null,
        solution: form.solution.trim() || null,
        myRole: form.myRole.trim() || null,
        contributions: form.contributions.split(",").map((c) => c.trim()).filter(Boolean),
        learnings: form.learnings.trim() || null,
        futurePlans: form.futurePlans.trim() || null,
        resultsDescription: form.resultsDescription.trim() || null,
        architectureDiagram: form.architectureDiagram.trim() || null,
        architectureDescription: form.architectureDescription.trim() || null,
      };

      const url = isEdit
        ? `/api/admin/projects/${project!.id}`
        : "/api/admin/projects";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save project");
      }

      toast.success(isEdit ? "Project updated!" : "Project created!");
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-800">
          <DialogTitle className="text-xl text-white">
            {isEdit ? `Edit — ${project!.name}` : "New Project"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {isEdit ? "Update the project details below." : "Fill in the details to create a new project."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Core Fields */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Name" htmlFor="name" required error={errors.name} className="col-span-2">
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="My Awesome Project"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
              />
            </FormField>

            <FormField label="Slug" htmlFor="slug" required error={errors.slug}>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="my-awesome-project"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 font-mono text-sm"
              />
            </FormField>

            <FormField label="Category" htmlFor="category" required error={errors.category}>
              <Input
                id="category"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="Web App, AI, Mobile…"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
              />
            </FormField>

            <FormField label="Status" htmlFor="status">
              <Select value={form.status} onValueChange={(v) => set("status", v as ProjectRow["status"])}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="InProgress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="HackathonFinalist">Hackathon Finalist</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Date" htmlFor="date">
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
              />
            </FormField>
          </div>

          <FormField label="Tagline" htmlFor="tagline" hint="Short one-liner shown on cards">
            <Input
              id="tagline"
              value={form.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              placeholder="A one-sentence summary"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
            />
          </FormField>

          <FormField label="Description" htmlFor="description" required error={errors.description}>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="What does this project do?"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 resize-none"
            />
          </FormField>

          <FormField label="Tech Stack" htmlFor="tech" hint="Comma-separated: React, TypeScript, Prisma">
            <Input
              id="tech"
              value={form.tech}
              onChange={(e) => set("tech", e.target.value)}
              placeholder="React, Next.js, Tailwind CSS"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Demo URL" htmlFor="demo">
              <Input
                id="demo"
                value={form.demo}
                onChange={(e) => set("demo", e.target.value)}
                placeholder="https://demo.example.com"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
              />
            </FormField>

            <FormField label="Repo URL" htmlFor="repo">
              <Input
                id="repo"
                value={form.repo}
                onChange={(e) => set("repo", e.target.value)}
                placeholder="https://github.com/user/repo"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
              />
            </FormField>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/40 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-200">Published</p>
              <p className="text-xs text-slate-500">Visible on your portfolio</p>
            </div>
            <Switch
              checked={form.published}
              onCheckedChange={(v) => set("published", v)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Sort Order" htmlFor="sortOrder">
              <Input
                id="sortOrder"
                type="number"
                value={form.sortOrder}
                onChange={(e) => set("sortOrder", Number(e.target.value))}
                className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
              />
            </FormField>
          </div>

          {/* Advanced / Optional Fields */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showAdvanced ? "Hide" : "Show"} advanced fields
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4">
                <Separator className="bg-slate-800" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Duration" htmlFor="duration">
                    <Input id="duration" value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="3 months" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                  </FormField>
                  <FormField label="Team Size" htmlFor="teamSize">
                    <Input id="teamSize" value={form.teamSize} onChange={(e) => set("teamSize", e.target.value)} placeholder="Solo / 3 people" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                  </FormField>
                </div>

                <FormField label="Problem" htmlFor="problem">
                  <Textarea id="problem" value={form.problem} onChange={(e) => set("problem", e.target.value)} rows={2} placeholder="What problem does it solve?" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none" />
                </FormField>

                <FormField label="Solution" htmlFor="solution">
                  <Textarea id="solution" value={form.solution} onChange={(e) => set("solution", e.target.value)} rows={2} placeholder="How did you solve it?" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none" />
                </FormField>

                <FormField label="My Role" htmlFor="myRole">
                  <Input id="myRole" value={form.myRole} onChange={(e) => set("myRole", e.target.value)} placeholder="Lead Developer, Designer…" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                </FormField>

                <FormField label="Contributions" htmlFor="contributions" hint="Comma-separated list of contributions">
                  <Textarea id="contributions" value={form.contributions} onChange={(e) => set("contributions", e.target.value)} rows={2} placeholder="Built the API, Designed the UI…" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none" />
                </FormField>

                <FormField label="Learnings" htmlFor="learnings">
                  <Textarea id="learnings" value={form.learnings} onChange={(e) => set("learnings", e.target.value)} rows={2} placeholder="What did you learn?" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none" />
                </FormField>

                <FormField label="Future Plans" htmlFor="futurePlans">
                  <Textarea id="futurePlans" value={form.futurePlans} onChange={(e) => set("futurePlans", e.target.value)} rows={2} placeholder="Upcoming features…" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none" />
                </FormField>

                <FormField label="Results Description" htmlFor="resultsDescription">
                  <Textarea id="resultsDescription" value={form.resultsDescription} onChange={(e) => set("resultsDescription", e.target.value)} rows={2} placeholder="Outcomes, impact, metrics…" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none" />
                </FormField>

                <FormField label="Architecture Diagram URL" htmlFor="architectureDiagram">
                  <Input id="architectureDiagram" value={form.architectureDiagram} onChange={(e) => set("architectureDiagram", e.target.value)} placeholder="https://..." className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                </FormField>

                <FormField label="Architecture Description" htmlFor="architectureDescription">
                  <Textarea id="architectureDescription" value={form.architectureDescription} onChange={(e) => set("architectureDescription", e.target.value)} rows={2} placeholder="Describe the architecture…" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none" />
                </FormField>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-slate-800 flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
