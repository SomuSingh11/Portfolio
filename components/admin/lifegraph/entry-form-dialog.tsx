"use client";

import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/admin/shared/form-field";
import { type EntryRow } from "./entries-table";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface ContentType {
  id: string;
  slug: string;
  label: string;
  icon?: string | null;
  isActive: boolean;
}

interface ClusterOption {
  id: string;
  slug: string;
  name: string;
  color: string;
}

interface EntryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: EntryRow | null;
  contentTypes: ContentType[];
  clusters: ClusterOption[];
  onSuccess: () => void;
}

const emptyForm = {
  title: "",
  slug: "",
  externalKey: "",
  typeSlug: "",
  clusterSlugs: [] as string[],
  status: "Draft" as "Draft" | "Published" | "Archived",
  content: "",
  excerpt: "",
  occurredAt: "",
  location: "",
  sourceUrl: "",
};

type FormState = typeof emptyForm;

function slugify(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function entryToForm(e: EntryRow): FormState {
  return {
    title: e.title,
    slug: e.slug,
    externalKey: e.externalKey ?? "",
    typeSlug: e.type.slug,
    clusterSlugs: e.clusterIds,
    status: e.status,
    content: e.content ?? "",
    excerpt: e.excerpt ?? "",
    occurredAt: e.occurredAt ? new Date(e.occurredAt).toISOString().slice(0, 10) : "",
    location: e.location ?? "",
    sourceUrl: e.sourceUrl ?? "",
  };
}

export function EntryFormDialog({
  open, onOpenChange, entry, contentTypes, clusters, onSuccess,
}: EntryFormDialogProps) {
  const isEdit = Boolean(entry);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (open) {
      setForm(entry ? entryToForm(entry) : emptyForm);
      setErrors({});
    }
  }, [open, entry]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !isEdit) next.slug = slugify(String(value));
      return next;
    });
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleCluster = (slug: string) => {
    set(
      "clusterSlugs",
      form.clusterSlugs.includes(slug)
        ? form.clusterSlugs.filter((s) => s !== slug)
        : [...form.clusterSlugs, slug],
    );
  };

  const validate = () => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.typeSlug) errs.typeSlug = "Content type is required";
    if (form.clusterSlugs.length === 0) errs.clusterSlugs = "At least one cluster is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        externalKey: form.externalKey.trim() || null,
        typeSlug: form.typeSlug,
        clusterSlugs: form.clusterSlugs,
        ...(isEdit ? { status: form.status } : {}),
        content: form.content.trim() || null,
        excerpt: form.excerpt.trim() || null,
        occurredAt: form.occurredAt || null,
        location: form.location.trim() || null,
        sourceUrl: form.sourceUrl.trim() || null,
      };

      const url = isEdit ? `/api/admin/lifegraph/entries/${entry!.id}` : "/api/admin/lifegraph/entries";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save entry");
      }
      toast.success(isEdit ? "Entry updated!" : "Entry created!");
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
            {isEdit ? `Edit Entry — ${entry!.title}` : "New Life Entry"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {isEdit ? "Update the entry details below." : "Add a new entry to your LifeGraph."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <FormField label="Title" htmlFor="e-title" required error={errors.title}>
            <Input
              id="e-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Entry title…"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Slug" htmlFor="e-slug">
              <Input
                id="e-slug"
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="entry-slug"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 font-mono text-sm focus:border-emerald-500"
              />
            </FormField>
            <FormField label="External Key" htmlFor="e-externalKey" hint="Optional unique external ID">
              <Input
                id="e-externalKey"
                value={form.externalKey}
                onChange={(e) => set("externalKey", e.target.value)}
                placeholder="ext-001"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 font-mono text-sm focus:border-emerald-500"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Content Type" required error={errors.typeSlug}>
              <Select value={form.typeSlug} onValueChange={(v) => set("typeSlug", v)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-emerald-500">
                  <SelectValue placeholder="Select type…" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  {contentTypes.filter((ct) => ct.isActive).map((ct) => (
                    <SelectItem key={ct.slug} value={ct.slug}>
                      {ct.icon && <span className="mr-1">{ct.icon}</span>}
                      {ct.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {isEdit && (
              <FormField label="Status">
                <Select value={form.status} onValueChange={(v) => set("status", v as FormState["status"])}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-emerald-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            )}
          </div>

          {/* Cluster multi-select */}
          <FormField label="Clusters" required error={errors.clusterSlugs as string}>
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-3 space-y-2">
              {form.clusterSlugs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-700">
                  {form.clusterSlugs.map((slug) => {
                    const cluster = clusters.find((c) => c.slug === slug);
                    return (
                      <Badge
                        key={slug}
                        variant="outline"
                        className="gap-1 text-xs cursor-pointer"
                        style={{
                          color: cluster?.color ?? "#94a3b8",
                          borderColor: `${cluster?.color ?? "#94a3b8"}50`,
                          backgroundColor: `${cluster?.color ?? "#94a3b8"}15`,
                        }}
                        onClick={() => toggleCluster(slug)}
                      >
                        {cluster?.name ?? slug}
                        <X className="w-3 h-3" />
                      </Badge>
                    );
                  })}
                </div>
              )}
              <div className="flex flex-wrap gap-1.5">
                {clusters
                  .filter((c) => !form.clusterSlugs.includes(c.slug))
                  .map((cluster) => (
                    <button
                      key={cluster.slug}
                      type="button"
                      onClick={() => toggleCluster(cluster.slug)}
                      className="px-2.5 py-1 rounded-full text-xs border border-slate-600 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors"
                    >
                      + {cluster.name}
                    </button>
                  ))}
              </div>
            </div>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Occurred At" htmlFor="e-occurredAt">
              <Input
                id="e-occurredAt"
                type="date"
                value={form.occurredAt}
                onChange={(e) => set("occurredAt", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white focus:border-emerald-500"
              />
            </FormField>
            <FormField label="Location" htmlFor="e-location">
              <Input
                id="e-location"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="City, Country"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500"
              />
            </FormField>
          </div>

          <FormField label="Source URL" htmlFor="e-sourceUrl">
            <Input
              id="e-sourceUrl"
              value={form.sourceUrl}
              onChange={(e) => set("sourceUrl", e.target.value)}
              placeholder="https://..."
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500"
            />
          </FormField>

          <FormField label="Excerpt" htmlFor="e-excerpt" hint="Short summary shown in previews">
            <Textarea
              id="e-excerpt"
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={2}
              placeholder="A brief summary…"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none focus:border-emerald-500"
            />
          </FormField>

          <FormField label="Content" htmlFor="e-content" hint="Main body content (Markdown supported)">
            <Textarea
              id="e-content"
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              rows={6}
              placeholder="Full content…"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none focus:border-emerald-500"
            />
          </FormField>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-slate-800 flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
