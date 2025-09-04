/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Star,
  GitFork,
  ExternalLink,
  Calendar,
  BarChart,
  Search,
} from "lucide-react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import GitHubCalendar from "react-github-calendar";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  topics: string[];
}

interface GitHubProfile {
  name: string;
  login: string;
  bio: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
}

// Color mapping for languages
const languageColors: Record<string, string> = {
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
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");
  const [languageData, setLanguageData] = useState<any>(null);
  const GITHUB_USERNAME = "SomuSingh11";

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const [profileRes, topReposRes, allReposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=8`
          ),
          fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`
          ),
        ]);

        const [profileData, topReposData, allReposData] = await Promise.all([
          profileRes.json(),
          topReposRes.json(),
          allReposRes.json(),
        ]);

        setProfile(profileData);
        setRepos(topReposData);
        processLanguageData(allReposData);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  const processLanguageData = (allRepos: GitHubRepo[]) => {
    const langStats = allRepos.reduce((stats, repo) => {
      if (repo.language) {
        stats[repo.language] = (stats[repo.language] || 0) + 1;
      }
      return stats;
    }, {} as Record<string, number>);

    const topLangs = Object.entries(langStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    setLanguageData({
      labels: topLangs.map((lang) => lang[0]),
      datasets: [
        {
          label: "Repos",
          data: topLangs.map((lang) => lang[1]),
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(34, 197, 94, 0.8)",
            "rgba(234, 179, 8, 0.8)",
            "rgba(168, 85, 247, 0.8)",
            "rgba(239, 68, 68, 0.8)",
          ],
          borderColor: "rgba(31, 41, 55, 1)",
          borderWidth: 2,
        },
      ],
    });
  };

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(filterQuery.toLowerCase())
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

  return (
    <div className="h-full bg-gray-900 text-white p-4 md:p-6 overflow-y-auto font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* === LEFT COLUMN === */}
        <div className="lg:col-span-2 space-y-6">
          {profile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6"
            >
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <img
                  src={profile.avatar_url}
                  alt="GitHub Avatar"
                  className="w-24 h-24 rounded-full border-2 border-blue-400 shrink-0"
                />
                <div>
                  <h2 className="text-2xl font-bold text-center sm:text-left">
                    {profile.name || profile.login}
                  </h2>
                  <p className="text-gray-400 text-center sm:text-left">
                    @{profile.login}
                  </p>
                  {profile.bio && (
                    <p className="text-sm text-gray-300 mt-2 text-center sm:text-left">
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Wrapper for side-by-side Chart and Calendar on medium screens */}
          <div className="grid grid-cols-1 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-green-400" />
                <span>Contribution Calendar</span>
              </h3>
              <GitHubCalendar
                username={GITHUB_USERNAME}
                colorScheme="dark"
                blockMargin={4}
                blockSize={12}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <BarChart className="w-5 h-5 text-purple-400" />
                <span>Top Languages</span>
              </h3>
              {languageData && (
                <Doughnut
                  data={languageData}
                  options={{
                    plugins: { legend: { labels: { color: "#D1D5DB" } } },
                  }}
                />
              )}
            </motion.div>
          </div>
        </div>

        {/* === RIGHT COLUMN === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 bg-gray-800 border border-gray-700 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span>Top Repositories</span>
          </h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search in top repositories..."
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="space-y-4">
            {filteredRepos.map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-white flex items-center space-x-2">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {repo.name}
                    </a>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </h4>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Star className="w-3 h-3" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-400">
                      <GitFork className="w-3 h-3" />
                      <span>{repo.forks_count}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mt-1 mb-3 line-clamp-2">
                  {repo.description || "No description provided."}
                </p>
                <div className="flex items-center justify-between text-xs">
                  {repo.language ? (
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          languageColors[repo.language] || "bg-gray-500"
                        }`}
                      ></span>
                      <span className="text-gray-400">{repo.language}</span>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <span className="text-gray-400">
                    Updated on {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
