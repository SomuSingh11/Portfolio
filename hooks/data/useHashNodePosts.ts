import { API_CONFIG } from "@/config/constants";
import { useCallback, useEffect, useState } from "react";

// ─── HashNode types ───────────────────────────────────────────────────────────
export interface HashNodePost {
  title: string;
  brief: string;
  slug: string;
  coverImage?: { url: string };
  publishedAt: string;
  views: number;
}

interface HashNodeState {
  posts: HashNodePost[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

let hashnodeCache: HashNodePost[] | null = null;
let hashnodeCacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000;

export function useHashNodePosts(): HashNodeState {
  const [posts, setPosts] = useState<HashNodePost[]>(hashnodeCache ?? []);
  const [loading, setLoading] = useState(!hashnodeCache);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    if (hashnodeCache && Date.now() - hashnodeCacheTimestamp < CACHE_TTL) {
      setPosts(hashnodeCache);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { host, apiUrl, postsPerPage } = API_CONFIG.hashnode;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    try {
      const query = `
        query Publication {
          publication(host: "${host}") {
            posts(first: ${postsPerPage}) {
              edges {
                node {
                  title
                  brief
                  slug
                  coverImage { url }
                  publishedAt
                  views
                }
              }
            }
          }
        }
      `;

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (data.errors) throw new Error(data.errors[0].message);

      const fetchedPosts: HashNodePost[] =
        data.data.publication.posts.edges.map(
          (edge: { node: HashNodePost }) => edge.node,
        );

      hashnodeCache = fetchedPosts;
      hashnodeCacheTimestamp = Date.now();

      setPosts(fetchedPosts);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.name === "AbortError"
            ? "Request timed out."
            : err.message
          : "Failed to fetch posts";
      setError(message);
    } finally {
      setLoading(false);
      clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}
