"use client";

import { useEffect, useState } from "react";

interface Post {
  title: string;
  brief: string;
  slug: string;
  coverImage?: { url: string };
  publishedAt: string;
  views: number;
}

const HASHNODE_HOST = "somusblog.hashnode.dev";
const HASHNODE_URL = `https://${HASHNODE_HOST}`;

export default function HashNode() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const query = `
          query Publication {
            publication(host: "${HASHNODE_HOST}") {
              posts(first: 10) {
                edges {
                  node {
                    title
                    brief
                    slug
                    coverImage {
                      url
                    }
                    publishedAt
                    views
                  }
                }
              }
            }
          }
        `;

        const response = await fetch("https://gql.hashnode.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        const fetchedPosts = data.data.publication.posts.edges.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (edge: any) => edge.node
        );
        setPosts(fetchedPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="h-full bg-gray-900 text-white overflow-y-auto p-4 md:p-6 font-sans">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">My Blog</h1>
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 bg-gray-800 rounded-lg animate-pulse">
                <div className="h-48 bg-gray-700 rounded mb-4"></div>
                <div className="h-8 bg-gray-700 rounded mb-2"></div>
                <div className="h-20 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-gray-900 text-white overflow-y-auto p-4 md:p-6 font-sans">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">My Blog</h1>
          <div className="p-6 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-400">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 text-white overflow-y-auto p-4 md:p-6 font-sans">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            My Blog
          </h1>
          <p className="text-gray-400 text-lg">
            Thoughts, tutorials, and insights on web development, technology,
            and everything in between.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-400">No posts found.</p>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`${HASHNODE_URL}/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-750 hover:shadow-xl transition-all"
              >
                {post.coverImage && (
                  <img
                    src={post.coverImage.url}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                )}

                <h2 className="text-2xl font-semibold mb-2 text-white">
                  {post.title}
                </h2>
                <p className="text-gray-300 mb-4">{post.brief}</p>

                <div className="flex items-center text-sm text-gray-400">
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{post.views} views</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
