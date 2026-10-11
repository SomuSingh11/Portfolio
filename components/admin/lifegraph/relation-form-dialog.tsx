"use client";

import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/admin/shared/form-field";
import { type RelationRow } from "./relations-list";
import toast from "react-hot-toast";

interface ClusterOption {
  id: string;
  slug: string;
  name: string;
  color: string;
}

interface RelationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relation?: RelationRow | null;
  clusters: ClusterOption[];
  onSuccess: () => void;
}

const emptyForm = {
  fromSlug: "",
  toSlug: "",
  label: "",
  weight: 1,
  strength: 1,
  color: "",
};

type FormState = typeof emptyForm;

function relationToForm(r: RelationRow): FormState {
  return {
    fromSlug: r.source,
    toSlug: r.target,
    label: r.label ?? "",
    weight: r.weight,
    strength: r.strength,
    color: r.color ?? "",
  };
}

export function RelationFormDialog({
  open, onOpenChange, relation, clusters, onSuccess,
}: RelationFormDialogProps) {
  const isEdit = Boolean(relation);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (open) {
      setForm(relation ? relationToForm(relation) : emptyForm);
      setErrors({});
    }
  }, [open, relation]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!isEdit) {
      if (!form.fromSlug) errs.fromSlug = "Required";
      if (!form.toSlug) errs.toSlug = "Required";
      if (form.fromSlug && form.toSlug && form.fromSlug === form.toSlug) {
        errs.toSlug = "Must be a different cluster";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = isEdit
        ? {
            label: form.label.trim() || null,
            weight: Number(form.weight),
            strength: Number(form.strength),
            color: form.color.trim() || null,
          }
        : {
            fromSlug: form.fromSlug,
            toSlug: form.toSlug,
            label: form.label.trim() || null,
            weight: Number(form.weight),
            strength: Number(form.strength),
            color: form.color.trim() || null,
          };

      const url = isEdit
        ? `/api/admin/lifegraph/relations/${relation!.id}`
        : "/api/admin/lifegraph/relations";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save relation");
      }
      toast.success(isEdit ? "Relation updated!" : "Relation created!");
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
            {isEdit
              ? `Edit Relation — ${relation!.fromName ?? relation!.source} ↔ ${relation!.toName ?? relation!.target}`
              : "New Cluster Relation"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {isEdit ? "Update relation metadata." : "Connect two clusters in the LifeGraph."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Cluster selectors — only in create mode */}
          {!isEdit && (
            <div className="grid grid-cols-2 gap-4">
              <FormField label="From Cluster" required error={errors.fromSlug}>
                <Select value={form.fromSlug} onValueChange={(v) => set("fromSlug", v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-violet-500">
                    <SelectValue placeholder="Select cluster…" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    {clusters.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        <span className="flex items-center gap-2">
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: c.color }}
                          />
                          {c.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="To Cluster" required error={errors.toSlug}>
                <Select value={form.toSlug} onValueChange={(v) => set("toSlug", v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-violet-500">
                    <SelectValue placeholder="Select cluster…" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    {clusters
                      .filter((c) => c.slug !== form.fromSlug)
                      .map((c) => (
                        <SelectItem key={c.slug} value={c.slug}>
                          <span className="flex items-center gap-2">
                            <span
                              className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: c.color }}
                            />
                            {c.name}
                          </span>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          )}

          <FormField label="Label" htmlFor="r-label" hint="Optional descriptive label for this connection">
            <Input
              id="r-label"
              value={form.label}
              onChange={(e) => set("label", e.target.value)}
              placeholder="collaborates with, part of…"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500"
            />
          </FormField>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="Weight" htmlFor="r-weight" hint="Edge thickness">
              <Input
                id="r-weight"
                type="number"
                step="0.1"
                min="0"
                value={form.weight}
                onChange={(e) => set("weight", Number(e.target.value))}
                className="bg-slate-800 border-slate-700 text-white focus:border-violet-500"
              />
            </FormField>

            <FormField label="Strength" htmlFor="r-strength" hint="Force pull">
              <Input
                id="r-strength"
                type="number"
                step="0.1"
                min="0"
                value={form.strength}
                onChange={(e) => set("strength", Number(e.target.value))}
                className="bg-slate-800 border-slate-700 text-white focus:border-violet-500"
              />
            </FormField>

            <FormField label="Color" htmlFor="r-color" hint="Edge color">
              <div className="flex items-center gap-2">
                {form.color && (
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => set("color", e.target.value)}
                    className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5 flex-shrink-0"
                  />
                )}
                <Input
                  id="r-color"
                  value={form.color}
                  onChange={(e) => set("color", e.target.value)}
                  placeholder="#hex or empty"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 font-mono text-sm focus:border-violet-500"
                />
              </div>
            </FormField>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-slate-800 flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white">
            {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Relation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
