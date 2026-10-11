"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FolderGit2, 
  BookOpen, 
  Settings, 
  ArrowRight, 
  Plus, 
  Layers, 
  ExternalLink,
  Sparkles,
  Database
} from "lucide-react";

interface ModuleCardsProps {
  projectCount: number;
  entryCount: number;
  clusterCount: number;
  relationCount: number;
}

export function ModuleCards({ projectCount, entryCount, clusterCount, relationCount }: ModuleCardsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-200">Management Modules</h2>
        <span className="text-xs text-slate-500 font-mono">Select a workspace</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 📋 Projects Module */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/40 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono">
                {projectCount} {projectCount === 1 ? "project" : "projects"}
              </Badge>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                Projects Management
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Create, update, and organize your portfolio showcase projects with custom tech tags, metrics, and links.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3 pt-4 border-t border-slate-800/80">
            <Link href="/admin/projects" className="block">
              <Button className="w-full justify-between bg-blue-600 hover:bg-blue-500 text-white font-medium group/btn shadow-lg shadow-blue-600/20">
                <span>Manage Projects</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 🌐 LifeGraph Module */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/40 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-emerald-500/5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
                  {entryCount} entries
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                LifeGraph Engine
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Manage timeline events, content clusters ({clusterCount}), and complex graph relations ({relationCount}).
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3 pt-4 border-t border-slate-800/80">
            <Link href="/admin/lifegraph" className="block">
              <Button className="w-full justify-between bg-emerald-600 hover:bg-emerald-500 text-white font-medium group/btn shadow-lg shadow-emerald-600/20">
                <span>Manage LifeGraph</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* ⚙️ System & Settings Module */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/40 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-violet-500/5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6" />
              </div>
              <Badge variant="outline" className="border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-mono">
                System
              </Badge>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors flex items-center gap-2">
                System & Quick Actions
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Preview your public website live, view global platform configurations, or test database status.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3 pt-4 border-t border-slate-800/80">
            <a href="/" target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full justify-between border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 font-medium group/btn">
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-violet-400" />
                  View Public Website
                </span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
