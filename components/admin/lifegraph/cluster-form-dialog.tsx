"use client";

import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FormField } from "@/components/admin/shared/form-field";
import { type ClusterRow } from "./clusters-grid";
import toast from "react-hot-toast";

interface ClusterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cluster?: ClusterRow | null;
  onSuccess: () => void;
}

function slugify(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  color: "#4FA8A0",
  imageUrl: "",
  imageWidth: "",
  imageHeight: "",
  sortOrder: 0,
  published: true,
};

type FormState = typeof emptyForm;

function clusterToForm(c: ClusterRow): FormState {
  return {
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
    color: c.color,
    imageUrl: c.imageMedia?.secureUrl || c.imageUrl || "",
    imageWidth: c.imageMedia?.width?.toString() ?? "",
    imageHeight: c.imageMedia?.height?.toString() ?? "",
    sortOrder: c.sortOrder,
    published: c.published,
  };
}

export function ClusterFormDialog({
  open, onOpenChange, cluster, onSuccess,
}: ClusterFormDialogProps) {
  const isEdit = Boolean(cluster);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (open) {
      setForm(cluster ? clusterToForm(cluster) : emptyForm);
      setErrors({});
    }
  }, [open, cluster]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && !isEdit) next.slug = slugify(String(value));
      return next;
    });
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.slug.trim()) errs.slug = "Slug is required";
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
        description: form.description.trim() || null,
        color: form.color,
        imageUrl: form.imageUrl.trim() || null,
        imageWidth: form.imageWidth === "" ? null : Number(form.imageWidth),
        imageHeight: form.imageHeight === "" ? null : Number(form.imageHeight),
        sortOrder: Number(form.sortOrder),
        published: form.published,
      };
      const url = isEdit ? `/api/admin/lifegraph/clusters/${cluster!.id}` : "/api/admin/lifegraph/clusters";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save cluster");
      }
      toast.success(isEdit ? "Cluster updated!" : "Cluster created!");
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
      <DialogContent className="max-w-lg bg-slate-900 border-slate-700 text-white max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-800">
          <DialogTitle className="text-xl text-white">
            {isEdit ? `Edit Cluster — ${cluster!.name}` : "New Cluster"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {isEdit ? "Update the cluster details and icon image." : "Create a new LifeGraph cluster."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <FormField label="Name" htmlFor="c-name" required error={errors.name}>
            <Input
              id="c-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Work, Education, Travel…"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
            />
          </FormField>

          <FormField label="Slug" htmlFor="c-slug" required error={errors.slug}>
            <Input
              id="c-slug"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="work"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 font-mono text-sm focus:border-blue-500"
            />
          </FormField>

          <FormField label="Description" htmlFor="c-description">
            <Textarea
              id="c-description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="What does this cluster represent?"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none focus:border-blue-500"
            />
          </FormField>

          <FormField label="Cluster Icon / Image URL" htmlFor="c-image" hint="Supports PNG, JPG, GIF, or SVG URL">
            <div className="space-y-2">
              <Input
                id="c-image"
                value={form.imageUrl}
                onChange={(e) => set("imageUrl", e.target.value)}
                placeholder="https://example.com/icon.gif, .svg, or .png"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 font-mono text-xs focus:border-blue-500"
              />
              {form.imageUrl.trim() && (
                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/60 border border-slate-700">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0">
                    <img
                      src={form.imageUrl.trim()}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 font-mono truncate">{form.imageUrl.trim()}</span>
                </div>
              )}
            </div>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Media Width (px)" htmlFor="c-image-width" hint="Optional asset width">
              <Input
                id="c-image-width"
                type="number"
                min="1"
                value={form.imageWidth}
                onChange={(e) => set("imageWidth", e.target.value)}
                placeholder="Auto"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
              />
            </FormField>
            <FormField label="Media Height (px)" htmlFor="c-image-height" hint="Optional asset height">
              <Input
                id="c-image-height"
                type="number"
                min="1"
                value={form.imageHeight}
                onChange={(e) => set("imageHeight", e.target.value)}
                placeholder="Auto"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Color" htmlFor="c-color" hint="Node color on the graph">
              <div className="flex items-center gap-3">
                <input
                  id="c-color"
                  type="color"
                  value={form.color}
                  onChange={(e) => set("color", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                />
                <Input
                  value={form.color}
                  onChange={(e) => set("color", e.target.value)}
                  placeholder="#4FA8A0"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 font-mono text-sm focus:border-blue-500"
                />
              </div>
            </FormField>

            <FormField label="Sort Order" htmlFor="c-sortOrder">
              <Input
                id="c-sortOrder"
                type="number"
                value={form.sortOrder}
                onChange={(e) => set("sortOrder", Number(e.target.value))}
                className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
              />
            </FormField>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/40 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-200">Published</p>
              <p className="text-xs text-slate-500">Visible on the LifeGraph</p>
            </div>
            <Switch
              checked={form.published}
              onCheckedChange={(v) => set("published", v)}
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-slate-800 flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
            {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Cluster"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
