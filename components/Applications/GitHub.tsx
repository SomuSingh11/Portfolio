"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Star,
  GitFork,
  ExternalLink,
  Calendar,
  BarChart,
  Search,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import GitHubCalendar from "react-github-calendar";
import { useGitHubData } from "@/hooks/data/useGitHubData";
import { API_CONFIG } from "@/config/constants";

ChartJS.register(ArcElement, Tooltip, Legend);

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "bg-yellow-400",
  TypeScript: "bg-blue-400",
  HTML: "bg-orange-500",
  CSS: "bg-blue-500",
  Python: "bg-green-500",
  Java: "bg-red-500",
  Shell: "bg-green-300",
  SCSS: "bg-pink-500",
};

export default function GitHub() {
  const { profile, repos, languageData, loading, error, refetch } =
    useGitHubData();
  const [filterQuery, setFilterQuery] = useState("");
  const { username } = API_CONFIG.github;

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(filterQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="h-full bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Github className="w-8 h-8 text-blue-400" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-gray-900 flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white font-semibold mb-2">
            Failed to load GitHub data
          </p>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={refetch}
            className="flex items-center space-x-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 text-white p-4 md:p-6 overflow-y-auto font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {profile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6"
            >
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.avatar_url}
                  alt={`${profile.name ?? profile.login} avatar`}
                  className="w-24 h-24 rounded-full border-2 border-blue-400 flex-shrink-0"
                />
                <div>
                  <h2 className="text-2xl font-bold text-center sm:text-left">
                    {profile.name ?? profile.login}
                  </h2>
                  <p className="text-gray-400 text-center sm:text-left">
                    @{profile.login}
                  </p>
                  {profile.bio && (
                    <p className="text-sm text-gray-300 mt-2 text-center sm:text-left">
                      {profile.bio}
                    </p>
                  )}
                  <div className="flex space-x-4 mt-3 text-sm text-gray-400">
                    <span>
                      <strong className="text-white">
                        {profile.public_repos}
                      </strong>{" "}
                      repos
                    </span>
                    <span>
                      <strong className="text-white">
                        {profile.followers}
                      </strong>{" "}
                      followers
                    </span>
                    <span>
                      <strong className="text-white">
                        {profile.following}
                      </strong>{" "}
                      following
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-400" />
              <span>Contributions</span>
            </h3>
            <div className="overflow-x-auto">
              <GitHubCalendar
                username={username}
                colorScheme="dark"
                blockMargin={4}
                blockSize={10}
              />
            </div>
          </motion.div>

          {languageData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <BarChart className="w-5 h-5 text-purple-400" />
                <span>Top Languages</span>
              </h3>
              <Doughnut
                data={languageData}
                options={{
                  plugins: {
                    legend: {
                      labels: { color: "#D1D5DB", font: { size: 12 } },
                    },
                  },
                  maintainAspectRatio: true,
                }}
              />
            </motion.div>
          )}
        </div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 bg-gray-800 border border-gray-700 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Repositories</span>
            </h3>
            <button
              onClick={refetch}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-gray-700 text-white pl-9 pr-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
            {filteredRepos.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                No repositories found
              </p>
            ) : (
              filteredRepos.map((repo, index) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:border-blue-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-white hover:text-blue-400 transition-colors flex items-center space-x-1.5 text-sm"
                    >
                      <span>{repo.name}</span>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </a>
                    <div className="flex items-center space-x-3 text-xs text-gray-400 flex-shrink-0 ml-2">
                      <span className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span>{repo.stargazers_count}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <GitFork className="w-3 h-3 text-blue-400" />
                        <span>{repo.forks_count}</span>
                      </span>
                    </div>
                  </div>

                  {repo.description && (
                    <p className="text-gray-300 text-xs mt-1 mb-2 line-clamp-2">
                      {repo.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    {repo.language ? (
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            LANGUAGE_COLORS[repo.language] ?? "bg-gray-500"
                          }`}
                        />
                        <span>{repo.language}</span>
                      </div>
                    ) : (
                      <span />
                    )}
                    <span>
                      Updated {new Date(repo.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
