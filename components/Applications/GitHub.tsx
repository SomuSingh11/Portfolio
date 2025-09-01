"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Star,
  GitFork,
  ExternalLink,
  Activity,
  Calendar,
} from "lucide-react";

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

export default function GitHub() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGitHubData();
  }, []);

  const fetchGitHubData = async () => {
    try {
      // Fetch user profile and repos (replace 'octocat' with your username)
      const [profileRes, reposRes] = await Promise.all([
        fetch("https://api.github.com/users/octocat"),
        fetch(
          "https://api.github.com/users/octocat/repos?sort=updated&per_page=8"
        ),
      ]);

      const [profileData, reposData] = await Promise.all([
        profileRes.json(),
        reposRes.json(),
      ]);

      setProfile(profileData);
      setRepos(reposData);
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="h-full bg-gray-900 text-white overflow-y-auto">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <Github className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold">GitHub Profile</h1>
          <span className="text-sm text-gray-400">(Live from GitHub API)</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Stats */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={profile.avatar_url}
                alt="GitHub Avatar"
                className="w-16 h-16 rounded-full border-2 border-blue-400"
              />
              <div>
                <h2 className="text-xl font-bold">
                  {profile.name || profile.login}
                </h2>
                <p className="text-gray-400">@{profile.login}</p>
                {profile.bio && (
                  <p className="text-sm text-gray-300 mt-1">{profile.bio}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-400">
                  {profile.public_repos}
                </div>
                <div className="text-xs text-gray-400">Repositories</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-400">
                  {profile.followers}
                </div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-400">
                  {profile.following}
                </div>
                <div className="text-xs text-gray-400">Following</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-400">
                  {profile.public_gists}
                </div>
                <div className="text-xs text-gray-400">Gists</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Repositories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 border border-gray-700 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-green-400" />
            <span>Recent Activity</span>
          </h3>

          <div className="space-y-4">
            {repos.map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white flex items-center space-x-2">
                      <span>{repo.name}</span>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </h4>
                    <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                      {repo.description || "No description available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Star className="w-3 h-3" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-400">
                      <GitFork className="w-3 h-3" />
                      <span>{repo.forks_count}</span>
                    </div>
                    {repo.language && (
                      <span className="px-2 py-0.5 bg-gray-600 text-gray-300 rounded text-xs">
                        {repo.language}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(repo.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Topics */}
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {repo.topics.slice(0, 4).map((topic) => (
                      <span
                        key={topic}
                        className="px-1.5 py-0.5 bg-blue-600/20 text-blue-400 text-xs rounded border border-blue-600/30"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
