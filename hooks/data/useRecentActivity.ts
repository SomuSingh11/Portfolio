import { API_CONFIG } from "@/config/constants";
import { useCallback, useEffect, useState } from "react";

export interface CommitActivity {
  type: "commit";
  id: string;
  repoName: string;
  message: string;
  url: string;
  timestamp: number;
}

export interface LeetCodeSubmission {
  type: "leetcode";
  id: string;
  title: string;
  titleSlug: string;
  lang: string;
  status: string;
  timestamp: number;
  url: string;
}

export type ActivityItem = CommitActivity | LeetCodeSubmission;

export interface LeetCodeStats {
  all: number;
  easy: number;
  medium: number;
  hard: number;
}

interface RecentActivityState {
  commits: CommitActivity[];
  submissions: LeetCodeSubmission[];
  timeline: ActivityItem[];
  stats: LeetCodeStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// In-memory cache for recent activity
let activityCache: {
  commits: CommitActivity[];
  submissions: LeetCodeSubmission[];
  timeline: ActivityItem[];
  stats: LeetCodeStats;
  timestamp: number;
} | null = null;

const CACHE_TTL = 3 * 60 * 1000; // 3 minutes cache

export function useRecentActivity(): RecentActivityState {
  const [state, setState] = useState<Omit<RecentActivityState, "refetch">>({
    commits: activityCache?.commits || [],
    submissions: activityCache?.submissions || [],
    timeline: activityCache?.timeline || [],
    stats: activityCache?.stats || null,
    loading: !activityCache,
    error: null,
  });

  const fetchData = useCallback(async (force = false) => {
    // Return cache if still fresh and not forced
    if (!force && activityCache && Date.now() - activityCache.timestamp < CACHE_TTL) {
      setState((prev) => ({
        ...prev,
        ...activityCache,
        loading: false,
        error: null,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    const githubUser = API_CONFIG.github.username;
    const leetcodeUser = API_CONFIG.leetcode.username;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      // 1. Fetch the top 3 most recently pushed public repositories
      let activeRepos: string[] = ["Portfolio"];
      try {
        const reposRes = await fetch(
          `https://api.github.com/users/${githubUser}/repos?sort=pushed&per_page=5`,
          { signal: controller.signal }
        );
        if (reposRes.ok) {
          const reposList = await reposRes.json();
          if (Array.isArray(reposList) && reposList.length > 0) {
            activeRepos = reposList.map((r: any) => r.name);
          }
        }
      } catch (e) {
        console.warn("Failed to detect active GitHub repositories, defaulting to Portfolio:", e);
      }

      // 2. Fetch Commits from all active repos, and LeetCode data simultaneously
      const commitPromises = activeRepos.map((repo) =>
        fetch(`https://api.github.com/repos/${githubUser}/${repo}/commits?per_page=5`, {
          signal: controller.signal,
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        })
          .then((res) => (res.ok ? res.json() : []))
          .then((commits) =>
            Array.isArray(commits)
              ? commits.map((c: any) => ({
                  type: "commit" as const,
                  id: c.sha || Math.random().toString(36).substring(2, 9),
                  repoName: repo,
                  message: c.commit?.message || "Commit",
                  url: c.html_url || `https://github.com/${githubUser}/${repo}/commit/${c.sha}`,
                  timestamp: new Date(c.commit?.author?.date || Date.now()).getTime(),
                }))
              : []
          )
          .catch((err) => {
            console.warn(`Failed to fetch commits for ${repo}:`, err);
            return [];
          })
      );

      const [commitsDataList, leetcodeRes] = await Promise.all([
        Promise.all(commitPromises),
        fetch(`/api/leetcode?username=${leetcodeUser}&limit=10`, {
          signal: controller.signal,
        }),
      ]);

      // Flatten and sort commits from all active repos
      const parsedCommits: CommitActivity[] = commitsDataList
        .flat()
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);

      let parsedSubmissions: LeetCodeSubmission[] = [];
      let leetStats: LeetCodeStats = { all: 0, easy: 0, medium: 0, hard: 0 };

      // Parse LeetCode submissions & stats
      if (leetcodeRes.ok) {
        const lcData = await leetcodeRes.json();
        if (lcData.submissions && Array.isArray(lcData.submissions)) {
          parsedSubmissions = lcData.submissions.map((sub: any) => ({
            type: "leetcode" as const,
            id: sub.id,
            title: sub.title,
            titleSlug: sub.titleSlug,
            lang: sub.lang,
            status: sub.statusDisplay,
            timestamp: parseInt(sub.timestamp, 10) * 1000,
            url: `https://leetcode.com/problems/${sub.titleSlug}/`,
          }));
        }
        if (lcData.stats) {
          leetStats = lcData.stats;
        }
      } else {
        console.warn(`LeetCode Proxy status: ${leetcodeRes.status}`);
      }

      // 3. Combine and sort timeline chronologically
      const combinedTimeline: ActivityItem[] = [
        ...parsedCommits,
        ...parsedSubmissions,
      ].sort((a, b) => b.timestamp - a.timestamp);

      // Save to cache
      activityCache = {
        commits: parsedCommits,
        submissions: parsedSubmissions,
        timeline: combinedTimeline,
        stats: leetStats,
        timestamp: Date.now(),
      };

      setState({
        commits: parsedCommits,
        submissions: parsedSubmissions,
        timeline: combinedTimeline,
        stats: leetStats,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      const message =
        err.name === "AbortError"
          ? "Request timed out. Check your connection."
          : err.message || "Failed to fetch activity streams";
      setState((prev) => ({ ...prev, loading: false, error: message }));
    } finally {
      clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: () => fetchData(true),
  };
}
