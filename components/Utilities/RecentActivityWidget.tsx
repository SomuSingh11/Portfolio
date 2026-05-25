"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCommit,
  Terminal as TerminalIcon,
  Flame,
  RefreshCw,
  ExternalLink,
  Code2,
  Calendar,
} from "lucide-react";
import { useRecentActivity, ActivityItem, LeetCodeSubmission, CommitActivity } from "@/hooks/data/useRecentActivity";

interface RecentActivityWidgetProps {
  layout: "desktop" | "mobile";
}

export default function RecentActivityWidget({ layout }: RecentActivityWidgetProps) {
  const { commits, submissions, timeline, stats, loading, error, refetch } =
    useRecentActivity();
  const [activeTab, setActiveTab] = useState<"all" | "github" | "leetcode">("all");

  const getDifficultyColor = (title: string): { bg: string; text: string } => {
    // LeetCode API doesn't return difficulty of a submission, so we can make a fun inference or default
    // Since we don't have it, let's assign a beautiful default emerald/blue badge
    return { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400" };
  };

  const getLanguageColor = (lang: string): string => {
    const colors: Record<string, string> = {
      javascript: "text-yellow-400",
      typescript: "text-blue-400",
      python: "text-sky-400",
      java: "text-orange-400",
      cpp: "text-pink-400",
      rust: "text-amber-500",
    };
    return colors[lang.toLowerCase()] || "text-gray-400";
  };

  const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // RENDER: MOBILE HOME SCREEN WIDGET
  if (layout === "mobile") {
    return (
      <div className="w-full px-5 mb-5 flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/10 border border-white/10 backdrop-blur-[4px] shadow-2xl rounded-3xl p-4 flex flex-col justify-between text-white h-[200px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-xs uppercase tracking-wider font-semibold text-white/80">
                Dev Feed
              </p>
            </div>
            <button
              onClick={refetch}
              disabled={loading}
              className="p-1 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {error ? (
            <div className="flex-1 flex items-center justify-center text-center p-2">
              <p className="text-white/40 text-xs truncate max-w-xs">{error}</p>
            </div>
          ) : loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex-1 flex gap-4 min-h-0 pt-2.5">
              {/* Left Pane: Git Commits */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center gap-1 mb-2 flex-shrink-0">
                  <GitCommit size={14} className="text-blue-400" />
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wide">
                    Commits
                  </span>
                </div>
                <div className="flex-1 space-y-2 overflow-hidden">
                  {commits.length === 0 ? (
                    <p className="text-xs text-white/40">No recent commits</p>
                  ) : (
                    commits.slice(0, 2).map((commit) => (
                      <a
                        key={commit.id}
                        href={commit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block min-w-0 group"
                      >
                        <p className="text-sm font-medium text-white/95 group-hover:text-blue-400 transition-colors truncate">
                          {commit.message}
                        </p>
                        <p className="text-[10px] text-white/40 truncate mt-0.5">
                          {commit.repoName} · {formatTimeAgo(commit.timestamp)}
                        </p>
                      </a>
                    ))
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="w-px bg-white/10 self-stretch" />

              {/* Right Pane: LeetCode */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center gap-1 mb-2 flex-shrink-0">
                  <Flame size={14} className="text-amber-500" />
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                    LeetCode Solved
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  {/* Latest Submission */}
                  {submissions.length === 0 ? (
                    <p className="text-xs text-white/40">No recent solved</p>
                  ) : (
                    <a
                      href={submissions[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block min-w-0 group"
                    >
                      <p className="text-sm font-medium text-white/95 group-hover:text-amber-400 transition-colors truncate">
                        {submissions[0].title}
                      </p>
                      <p className="text-[10px] text-white/40 truncate mt-0.5">
                        Language: <span className={getLanguageColor(submissions[0].lang)}>{submissions[0].lang}</span>
                      </p>
                    </a>
                  )}

                  {/* LeetCode stats */}
                  {stats && (
                    <div className="grid grid-cols-3 gap-1 bg-white/5 rounded-xl p-2 text-center border border-white/5 mt-1.5 flex-shrink-0">
                      <div>
                        <p className="text-sm font-bold text-emerald-400">{stats.easy}</p>
                        <p className="text-[10px] text-white/40 uppercase">Easy</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-amber-500">{stats.medium}</p>
                        <p className="text-[10px] text-white/40 uppercase">Med</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-rose-500">{stats.hard}</p>
                        <p className="text-[10px] text-white/40 uppercase">Hard</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // RENDER: DESKTOP DESKTOP SIDEBAR GADGET
  const filteredTimeline = timeline.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "github") return item.type === "commit";
    if (activeTab === "leetcode") return item.type === "leetcode";
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="absolute top-[50px] right-6 w-[290px] h-[450px] flex flex-col rounded-[24px] bg-zinc-950/25 border border-white/5 backdrop-blur-[1px] shadow-xl p-3.5 text-white z-[12] select-none pointer-events-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <h2 className="text-xs font-bold tracking-wider uppercase text-white/80">
            Dev Feed
          </h2>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all cursor-pointer"
        >
          <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* LeetCode Solve Overview Stats */}
      {stats && !error && !loading && (
        <div className="my-2.5 bg-white/5 border border-white/5 rounded-[18px] p-2.5 flex-shrink-0">
          <div className="flex justify-between items-center mb-1.5">
            <p className="text-[10px] uppercase font-bold tracking-wider text-white/50 flex items-center gap-1">
              <Code2 size={11} className="text-amber-500" />
              LeetCode Stats
            </p>
            <p className="text-xs font-extrabold text-white/90">
              {stats.all} <span className="text-[9px] font-normal text-white/40">solved</span>
            </p>
          </div>
          {/* Progress bar visual */}
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${stats.all ? (stats.easy / stats.all) * 100 : 0}%` }}
              className="bg-emerald-500 h-full"
              title={`Easy: ${stats.easy}`}
            />
            <div
              style={{ width: `${stats.all ? (stats.medium / stats.all) * 100 : 0}%` }}
              className="bg-amber-500 h-full"
              title={`Medium: ${stats.medium}`}
            />
            <div
              style={{ width: `${stats.all ? (stats.hard / stats.all) * 100 : 0}%` }}
              className="bg-rose-500 h-full"
              title={`Hard: ${stats.hard}`}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-[9px] font-medium text-white/60">
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-500" />
              Easy: {stats.easy}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-amber-500" />
              Med: {stats.medium}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-rose-500" />
              Hard: {stats.hard}
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-white/5 border border-white/5 p-0.5 rounded-xl text-[10px] mb-2.5 flex-shrink-0">
        {(["all", "github", "leetcode"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-1 rounded-lg font-medium transition-all capitalize ${
              activeTab === tab
                ? "bg-white/10 text-white shadow-sm font-semibold"
                : "text-white/40 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Feed Container */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 select-none scrollbar-thin">
        {error ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <p className="text-xs text-rose-400 mb-2">Failed to load stream</p>
            <p className="text-[10px] text-white/35 max-w-xs">{error}</p>
          </div>
        ) : loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        ) : filteredTimeline.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center p-4">
            <p className="text-xs text-white/30">No activities found</p>
          </div>
        ) : (
          <div className="space-y-2.5 relative pb-1">
            {filteredTimeline.slice(0, 10).map((item, index) => {
              const isCommit = item.type === "commit";
              return (
                <motion.a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.04, 0.3) }}
                  className="block p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      {isCommit ? (
                        <>
                          <GitCommit size={12} className="text-blue-400 flex-shrink-0" />
                          <span className="text-[9px] uppercase font-bold tracking-wider text-blue-300">
                            Commit
                          </span>
                        </>
                      ) : (
                        <>
                          <Flame size={12} className="text-amber-500 flex-shrink-0" />
                          <span className="text-[9px] uppercase font-bold tracking-wider text-amber-400">
                            LeetCode
                          </span>
                        </>
                      )}
                    </span>
                    <span className="text-[9px] text-white/30 flex items-center gap-1">
                      <Calendar size={9} />
                      {formatTimeAgo(item.timestamp)}
                    </span>
                  </div>

                  {isCommit ? (
                    <div>
                      <p className="text-xs font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-normal">
                        {(item as CommitActivity).message}
                      </p>
                      <div className="flex justify-between items-center mt-2 text-[9px] text-white/40">
                        <span className="font-semibold truncate max-w-[150px]">
                          {(item as CommitActivity).repoName}
                        </span>
                        <ExternalLink size={9} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-medium text-white group-hover:text-amber-400 transition-colors truncate">
                        {(item as LeetCodeSubmission).title}
                      </p>
                      <div className="flex justify-between items-center mt-2 text-[9px]">
                        <span className="text-white/45">
                          Language: <span className={`${getLanguageColor((item as LeetCodeSubmission).lang)} font-semibold`}>
                            {(item as LeetCodeSubmission).lang}
                          </span>
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-bold text-[9px]">
                          AC
                        </span>
                      </div>
                    </div>
                  )}
                </motion.a>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
