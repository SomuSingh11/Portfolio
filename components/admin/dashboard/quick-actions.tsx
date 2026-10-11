"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, FolderGit2, BookOpen, Layers, GitBranch, Sparkles } from "lucide-react";

export function QuickActions() {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Quick Operations</h3>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/projects">
          <Button variant="outline" className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 gap-2 text-xs">
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            New Project
          </Button>
        </Link>

        <Link href="/admin/lifegraph">
          <Button variant="outline" className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 gap-2 text-xs">
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            New LifeGraph Entry
          </Button>
        </Link>

        <Link href="/admin/lifegraph">
          <Button variant="outline" className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 gap-2 text-xs">
            <Layers className="w-3.5 h-3.5 text-violet-400" />
            Manage Clusters
          </Button>
        </Link>

        <Link href="/admin/lifegraph">
          <Button variant="outline" className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 gap-2 text-xs">
            <GitBranch className="w-3.5 h-3.5 text-rose-400" />
            Manage Graph Relations
          </Button>
        </Link>
      </div>
    </div>
  );
}
