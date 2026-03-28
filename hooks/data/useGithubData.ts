import { API_CONFIG } from "@/config/constants";
import { useCallback, useEffect, useState } from "react";

// ─── GitHub types ─────────────────────────────────────────────────────────────
export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

export interface GitHubProfile {
  name: string;
  login: string;
  bio: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
}

export interface LanguageChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string;
    borderWidth: number;
  }>;
}

interface GitHubState {
  profile: GitHubProfile | null;
  repos: GitHubRepo[];
  languageData: LanguageChartData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const CHART_COLORS = [
  "rgba(59, 130, 246, 0.8)",
  "rgba(34, 197, 94, 0.8)",
  "rgba(234, 179, 8, 0.8)",
  "rgba(168, 85, 247, 0.8)",
  "rgba(239, 68, 68, 0.8)",
];

// Simple in-memory cache so reopening the window doesn't re-fetch
let githubCache: Omit<GitHubState, "loading" | "error" | "refetch"> | null =
  null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function processLanguageData(repos: GitHubRepo[]): LanguageChartData {
  const langStats = repos.reduce<Record<string, number>>((stats, repo) => {
    if (repo.language) {
      stats[repo.language] = (stats[repo.language] ?? 0) + 1;
    }
    return stats;
  }, {});

  const topLangs = Object.entries(langStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return {
    labels: topLangs.map(([lang]) => lang),
    datasets: [
      {
        label: "Repos",
        data: topLangs.map(([, count]) => count),
        backgroundColor: CHART_COLORS,
        borderColor: "rgba(31, 41, 55, 1)",
        borderWidth: 2,
      },
    ],
  };
}

export function useGithubData(): GitHubState {
  const [state, setState] = useState<Omit<GitHubState, "refetch">>({
    profile: githubCache?.profile ?? null,
    repos: githubCache?.repos ?? [],
    languageData: githubCache?.languageData ?? null,
    loading: !githubCache,
    error: null,
  });

  const fetchData = useCallback(async () => {
    // Return cache if still fresh
    if (githubCache && Date.now() - cacheTimestamp < CACHE_TTL) {
      setState((prev) => ({ ...prev, ...githubCache, loading: false }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    const { username, baseUrl, reposPerPage, allReposPerPage } =
      API_CONFIG.github;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    try {
      const [profileRes, topReposRes, allReposRes] = await Promise.all([
        fetch(`${baseUrl}/users/${username}`, { signal: controller.signal }),
        fetch(
          `${baseUrl}/users/${username}/repos?sort=updated&per_page=${reposPerPage}`,
          {
            signal: controller.signal,
          },
        ),
        fetch(
          `${baseUrl}/users/${username}/repos?per_page=${allReposPerPage}`,
          {
            signal: controller.signal,
          },
        ),
      ]);

      if (!profileRes.ok)
        throw new Error(`GitHub API error: ${profileRes.status}`);

      const [profile, repos, allRepos] = await Promise.all([
        profileRes.json() as Promise<GitHubProfile>,
        topReposRes.json() as Promise<GitHubRepo[]>,
        allReposRes.json() as Promise<GitHubRepo[]>,
      ]);

      const languageData = processLanguageData(allRepos);

      githubCache = { profile, repos, languageData };
      cacheTimestamp = Date.now();

      setState({ profile, repos, languageData, loading: false, error: null });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.name === "AbortError"
            ? "Request timed out. Check your connection."
            : err.message
          : "Failed to fetch GitHub data";
      setState((prev) => ({ ...prev, loading: false, error: message }));
    } finally {
      clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}
