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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/admin/shared/form-field";
import { type ContentTypeRow, type FieldDefinition } from "./content-types-grid";
import { Plus, Trash2, Sliders } from "lucide-react";
import toast from "react-hot-toast";

interface ContentTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentType?: ContentTypeRow | null;
  onSuccess: () => void;
}

function slugify(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/(^_|_$)+/g, "");
}

const emptyForm = {
  label: "",
  slug: "",
  description: "",
  icon: "",
  color: "#F59E0B",
  sortOrder: 0,
  isActive: true,
  fields: [] as FieldDefinition[],
};

type FormState = typeof emptyForm;

function contentTypeToForm(ct: ContentTypeRow): FormState {
  const existingFields = ct.fieldSchema?.fields;
  return {
    label: ct.label,
    slug: ct.slug,
    description: ct.description ?? "",
    icon: ct.icon ?? "",
    color: ct.color ?? "#F59E0B",
    sortOrder: ct.sortOrder,
    isActive: ct.isActive,
    fields: Array.isArray(existingFields) ? existingFields : [],
  };
}

const PRESET_COLORS = [
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#EF4444", // Red
  "#14B8A6", // Teal
  "#6366F1", // Indigo
];

export function ContentTypeFormDialog({
  open,
  onOpenChange,
  contentType,
  onSuccess,
}: ContentTypeFormDialogProps) {
  const isEdit = Boolean(contentType);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // New field draft input
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<FieldDefinition["type"]>("text");
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(contentType ? contentTypeToForm(contentType) : emptyForm);
      setErrors({});
      setNewFieldName("");
      setNewFieldLabel("");
      setNewFieldType("text");
      setNewFieldRequired(false);
    }
  }, [open, contentType]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "label" && !isEdit) next.slug = slugify(String(value));
      return next;
    });
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleAddField = () => {
    const label = newFieldLabel.trim();
    const name = (newFieldName.trim() || slugify(label)).toLowerCase();

    if (!label) {
      toast.error("Field label is required");
      return;
    }
    if (!name) {
      toast.error("Field name key is required");
      return;
    }
    if (form.fields.some((f) => f.name === name)) {
      toast.error(`Field key "${name}" already exists`);
      return;
    }

    setForm((prev) => ({
      ...prev,
      fields: [...prev.fields, { name, label, type: newFieldType, required: newFieldRequired }],
    }));

    setNewFieldName("");
    setNewFieldLabel("");
    setNewFieldType("text");
    setNewFieldRequired(false);
  };

  const handleRemoveField = (index: number) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.label.trim()) errs.label = "Label is required";
    if (!form.slug.trim()) errs.slug = "Slug is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        label: form.label.trim(),
        slug: form.slug.trim().toLowerCase(),
        description: form.description.trim() || null,
        icon: form.icon.trim() || null,
        color: form.color.trim() || null,
        sortOrder: Number(form.sortOrder),
        isActive: form.isActive,
        fieldSchema: form.fields.length > 0 ? { fields: form.fields } : null,
      };

      const url = isEdit
        ? `/api/admin/lifegraph/types/${contentType!.id}`
        : "/api/admin/lifegraph/types";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save content type");
      }

      toast.success(isEdit ? "Content type updated!" : "Content type created!");
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
      <DialogContent className="max-w-xl bg-slate-900 border-slate-700 text-white max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-800">
          <DialogTitle className="text-xl text-white">
            {isEdit ? `Edit Content Type — ${contentType!.label}` : "New Content Type"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {isEdit
              ? "Update content type configuration and custom field schema."
              : "Define a new category of entries and custom data fields."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* General Fields */}
          <div className="space-y-4">
            <FormField label="Label" htmlFor="ct-label" required error={errors.label}>
              <Input
                id="ct-label"
                value={form.label}
                onChange={(e) => set("label", e.target.value)}
                placeholder="Book Read, Project Milestone, Cert…"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500"
              />
            </FormField>

            <FormField label="Slug" htmlFor="ct-slug" required error={errors.slug}>
              <Input
                id="ct-slug"
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="book, milestone, cert"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 font-mono text-sm focus:border-amber-500"
              />
            </FormField>

            <FormField label="Description" htmlFor="ct-description">
              <Textarea
                id="ct-description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={2}
                placeholder="What kind of life entries belong to this type?"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none focus:border-amber-500"
              />
            </FormField>

            <FormField label="Icon / Emoji" htmlFor="ct-icon" hint="Lucide icon name or emoji (e.g. BookOpen, Trophy, 📚, 🏆)">
              <Input
                id="ct-icon"
                value={form.icon}
                onChange={(e) => set("icon", e.target.value)}
                placeholder="BookOpen, Sparkles, Trophy..."
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 font-mono text-sm focus:border-amber-500"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Accent Color" htmlFor="ct-color">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      id="ct-color"
                      type="color"
                      value={form.color}
                      onChange={(e) => set("color", e.target.value)}
                      className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                    />
                    <Input
                      value={form.color}
                      onChange={(e) => set("color", e.target.value)}
                      placeholder="#F59E0B"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 font-mono text-sm focus:border-amber-500"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => set("color", c)}
                        className="w-5 h-5 rounded-full border border-slate-700 hover:scale-110 transition-transform"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </FormField>

              <FormField label="Sort Order" htmlFor="ct-sortOrder">
                <Input
                  id="ct-sortOrder"
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => set("sortOrder", Number(e.target.value))}
                  className="bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                />
              </FormField>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/40 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-200">Active</p>
                <p className="text-xs text-slate-500">Available when creating new entries</p>
              </div>
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => set("isActive", v)}
              />
            </div>
          </div>

          {/* Custom Schema Builder */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-slate-200">Custom Data Schema</h3>
            </div>
            <p className="text-xs text-slate-400">
              Define custom attributes (e.g. Author, Rating, URL, Hours) to collect when creating entries of this type.
            </p>

            {/* List of existing fields */}
            {form.fields.length > 0 && (
              <div className="space-y-2">
                {form.fields.map((f, i) => (
                  <div
                    key={f.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-300 border-amber-500/25 font-mono">
                        {f.type}
                      </Badge>
                      <div>
                        <p className="font-semibold text-white">{f.label}</p>
                        <p className="text-[11px] text-slate-400 font-mono">Key: {f.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {f.required && (
                        <Badge variant="outline" className="bg-rose-500/10 text-rose-300 border-rose-500/25 text-[10px]">
                          Required
                        </Badge>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveField(i)}
                        className="h-7 w-7 p-0 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add new field form card */}
            <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 space-y-3">
              <p className="text-xs font-medium text-slate-300">Add New Schema Field</p>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={newFieldLabel}
                  onChange={(e) => {
                    setNewFieldLabel(e.target.value);
                    setNewFieldName(slugify(e.target.value));
                  }}
                  placeholder="Field Label (e.g. Author)"
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 text-xs"
                />
                <Input
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="Field Key (e.g. author)"
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <Select value={newFieldType} onValueChange={(v) => setNewFieldType(v as FieldDefinition["type"])}>
                  <SelectTrigger className="w-40 bg-slate-900 border-slate-700 text-white text-xs h-8">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Boolean (Switch)</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="url">URL Link</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newFieldRequired}
                      onChange={(e) => setNewFieldRequired(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-amber-500"
                    />
                    Required
                  </label>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddField}
                    className="h-8 bg-amber-600 hover:bg-amber-700 text-white text-xs gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Field
                  </Button>
                </div>
              </div>
            </div>
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
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Content Type"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
