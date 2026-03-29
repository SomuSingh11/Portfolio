"use client";

import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, BookOpen } from "lucide-react";
import { useHashNodePosts } from "@/hooks/data/useHashNodePosts";
import { SOCIAL_LINKS } from "@/config/constants";

export default function HashNode() {
  const { posts, loading, error, refetch } = useHashNodePosts();

  if (loading) {
    return (
      <div className="h-full bg-gray-900 text-white overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="h-10 w-32 bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-5 w-64 bg-gray-700/50 rounded animate-pulse" />
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-lg overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-700" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-700/70 rounded" />
                  <div className="h-4 bg-gray-700/50 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-gray-900 flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white font-semibold mb-2">Failed to load posts</p>
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
    <div className="h-full bg-gray-900 text-white overflow-y-auto font-sans">
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            My Blog
          </h1>
          <p className="text-gray-400">
            Thoughts, tutorials, and insights on development and technology.
          </p>
        </motion.div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No posts found.</p>
            <a
              href={SOCIAL_LINKS.hashnode}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-blue-400 hover:underline text-sm"
            >
              Visit blog directly →
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post, i) => (
              <motion.a
                key={post.slug}
                href={`${SOCIAL_LINKS.hashnode}/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="block bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all group"
              >
                {post.coverImage && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={post.coverImage.url}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                    loading="lazy"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-300 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {post.brief}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        dateStyle: "medium",
                      })}
                    </span>
                    <span>{post.views.toLocaleString()} views</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
