"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Star,
  GitFork,
  ExternalLink,
  Calendar,
  Search,
  RefreshCw,
  AlertCircle,
  BarChart2,
  Users,
  BookMarked,
  Loader2,
} from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import GitHubCalendar from "react-github-calendar";
import { useGitHubData } from "@/hooks/data/useGitHubData";
import { API_CONFIG, SOCIAL_LINKS } from "@/config/constants";

ChartJS.register(ArcElement, Tooltip, Legend);

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#F7DF1E",
  TypeScript: "#3178C6",
  HTML: "#E34F26",
  CSS: "#1572B6",
  Python: "#3776AB",
  Java: "#B07219",
  Shell: "#89E051",
  SCSS: "#C6538C",
};

type Tab = "overview" | "repos" | "languages";

export default function GitHub() {
  const { profile, repos, languageData, loading, error, refetch } =
    useGitHubData();
  const [filterQuery, setFilterQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { username } = API_CONFIG.github;

  const filteredRepos = repos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (repo.description ?? "")
        .toLowerCase()
        .includes(filterQuery.toLowerCase()),
  );

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);

  if (loading) {
    return (
      <div className="h-full bg-gray-900 flex flex-col items-center justify-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-gray-400" />
        </motion.div>
        <p className="text-gray-500 text-sm">Loading GitHub data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-gray-900 flex items-center justify-center p-8">
        <div className="text-center max-w-xs">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-white font-semibold mb-1">
            Couldn&apos;t load GitHub
          </p>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={refetch}
            className="flex items-center gap-2 mx-auto bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm border border-gray-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-4xl flex flex-col h-full">
        {/* ── Profile header ── */}
        {profile && (
          <div className="flex-shrink-0 border-b border-gray-800 p-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar_url}
                alt={profile.login}
                className="w-12 h-12 rounded-full border-2 border-gray-700 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base font-bold text-white truncate">
                    {profile.name ?? profile.login}
                  </h1>
                  <a
                    href={SOCIAL_LINKS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-gray-400 text-xs">@{profile.login}</p>
              </div>
              <button
                onClick={refetch}
                title="Refresh"
                className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[
                {
                  icon: BookMarked,
                  label: "Repos",
                  value: profile.public_repos,
                },
                { icon: Users, label: "Followers", value: profile.followers },
                { icon: Users, label: "Following", value: profile.following },
                { icon: Star, label: "Stars", value: totalStars },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="bg-gray-800/60 rounded-xl p-2.5 text-center border border-gray-700/50"
                >
                  <Icon className="w-3.5 h-3.5 text-gray-500 mx-auto mb-1" />
                  <p className="text-sm font-bold text-white">{value}</p>
                  <p className="text-[10px] text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex-shrink-0 border-b border-gray-800 px-4">
          <div className="flex gap-0">
            {[
              { id: "overview" as Tab, label: "Overview", icon: Calendar },
              { id: "repos" as Tab, label: "Repos", icon: BookMarked },
              { id: "languages" as Tab, label: "Languages", icon: BarChart2 },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === id
                    ? "border-blue-500 text-white"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <AnimatePresence mode="wait">
            {/* Overview tab */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="p-4 space-y-4"
              >
                {profile?.bio && (
                  <p className="text-gray-400 text-sm leading-relaxed bg-gray-800/40 rounded-xl p-3 border border-gray-700/50">
                    {profile.bio}
                  </p>
                )}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Contribution Activity
                  </p>
                  <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/50 overflow-x-auto">
                    <GitHubCalendar
                      username={username}
                      colorScheme="dark"
                      blockMargin={3}
                      blockSize={9}
                      fontSize={10}
                    />
                  </div>
                </div>

                {/* Recent repos preview */}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Recent Activity
                  </p>
                  <div className="space-y-2">
                    {repos.slice(0, 3).map((repo) => (
                      <a
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 bg-gray-800/40 border border-gray-700/50 rounded-xl p-3 hover:border-gray-600 transition-colors group"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors truncate">
                            {repo.name}
                          </p>
                          {repo.description && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {repo.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 text-xs text-gray-500">
                          {repo.language && (
                            <span className="flex items-center gap-1">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor:
                                    LANGUAGE_COLORS[repo.language] ?? "#666",
                                }}
                              />
                              {repo.language}
                            </span>
                          )}
                          <span className="flex items-center gap-0.5">
                            <Star className="w-3 h-3" />
                            {repo.stargazers_count}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Repos tab */}
            {activeTab === "repos" && (
              <motion.div
                key="repos"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="p-4 space-y-3"
              >
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search repositories..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500 placeholder-gray-600"
                  />
                </div>

                {/* Repo list */}
                <div className="space-y-2">
                  {filteredRepos.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 text-sm">
                      No repositories found
                    </div>
                  ) : (
                    filteredRepos.map((repo, i) => (
                      <motion.a
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="block bg-gray-800/50 border border-gray-700/60 rounded-xl p-3.5 hover:border-gray-600 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                            {repo.name}
                          </p>
                          <div className="flex items-center gap-2.5 flex-shrink-0 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              {repo.stargazers_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <GitFork className="w-3 h-3 text-blue-500" />
                              {repo.forks_count}
                            </span>
                          </div>
                        </div>
                        {repo.description && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                            {repo.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2 text-[10px] text-gray-600">
                          {repo.language ? (
                            <span className="flex items-center gap-1">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor:
                                    LANGUAGE_COLORS[repo.language] ?? "#666",
                                }}
                              />
                              {repo.language}
                            </span>
                          ) : (
                            <span />
                          )}
                          <span>
                            Updated{" "}
                            {new Date(repo.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </motion.a>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Languages tab */}
            {activeTab === "languages" && (
              <motion.div
                key="languages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="p-4 space-y-4"
              >
                {languageData ? (
                  <>
                    <div className="max-w-[200px] mx-auto">
                      <Doughnut
                        data={languageData}
                        options={{
                          plugins: { legend: { display: false } },
                          maintainAspectRatio: true,
                          cutout: "65%",
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      {languageData.labels.map((lang, i) => (
                        <div
                          key={lang}
                          className="flex items-center gap-3 bg-gray-800/40 rounded-xl p-3 border border-gray-700/50"
                        >
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: languageData.datasets[0]
                                .backgroundColor[i] as string,
                            }}
                          />
                          <span className="text-sm text-white font-medium flex-1">
                            {lang}
                          </span>
                          <span className="text-xs text-gray-500">
                            {languageData.datasets[0].data[i]} repos
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10 text-gray-500 text-sm">
                    No language data
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
