"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  RefreshCw,
  BookOpen,
  ExternalLink,
  Eye,
  Clock,
} from "lucide-react";
import { useHashNodePosts } from "@/hooks/data/useHashNodePosts";
import { SOCIAL_LINKS } from "@/config/constants";

function SkeletonCard() {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-700/60" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 bg-gray-700 rounded w-4/5" />
        <div className="h-3 bg-gray-700/70 rounded" />
        <div className="h-3 bg-gray-700/50 rounded w-3/4" />
        <div className="flex justify-between mt-3">
          <div className="h-3 bg-gray-700/40 rounded w-20" />
          <div className="h-3 bg-gray-700/40 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

type ViewMode = "grid" | "list";

export default function HashNode() {
  const { posts, loading, error, refetch } = useHashNodePosts();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  if (loading) {
    return (
      <div className="h-full bg-gray-900 text-white overflow-y-auto">
        {/* Header skeleton */}
        <div className="border-b border-gray-800 p-4">
          <div className="h-6 bg-gray-700 rounded w-24 animate-pulse mb-1" />
          <div className="h-3 bg-gray-700/50 rounded w-48 animate-pulse" />
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-gray-900 flex items-center justify-center p-8">
        <div className="text-center max-w-xs">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-white font-semibold mb-1">
            Couldn&apos;t load posts
          </p>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={refetch}
            className="flex items-center gap-2 mx-auto bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 items-center text-white flex flex-col overflow-hidden">
      <div className="w-full max-w-4xl flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-800 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                Blog
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {posts.length} {posts.length === 1 ? "post" : "posts"} published
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex rounded-lg overflow-hidden border border-gray-700">
                {(["grid", "list"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setViewMode(m)}
                    className={`px-2.5 py-1.5 text-xs transition-colors ${
                      viewMode === m
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    {m === "grid" ? "⊞" : "☰"}
                  </button>
                ))}
              </div>
              <a
                href={SOCIAL_LINKS.hashnode}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="flex-1 overflow-y-auto min-h-0 p-4">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <BookOpen className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No posts yet.</p>
              <a
                href={SOCIAL_LINKS.hashnode}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-blue-400 hover:underline text-xs"
              >
                Visit blog →
              </a>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {viewMode === "grid" ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {posts.map((post, i) => (
                    <motion.a
                      key={post.slug}
                      href={`${SOCIAL_LINKS.hashnode}/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group bg-gray-800/50 border border-gray-700/60 rounded-xl overflow-hidden hover:border-blue-500/40 hover:bg-gray-800/80 transition-all"
                    >
                      {post.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.coverImage.url}
                          alt={post.title}
                          className="w-full h-36 object-cover group-hover:opacity-90 transition-opacity"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-36 bg-gradient-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-gray-600" />
                        </div>
                      )}
                      <div className="p-3.5">
                        <h2 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h2>
                        <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {post.brief}
                        </p>
                        <div className="flex items-center justify-between mt-3 text-[10px] text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(post.publishedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  {posts.map((post, i) => (
                    <motion.a
                      key={post.slug}
                      href={`${SOCIAL_LINKS.hashnode}/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="group flex items-start gap-3 bg-gray-800/40 border border-gray-700/50 rounded-xl p-3.5 hover:border-blue-500/40 hover:bg-gray-800/70 transition-all"
                    >
                      {post.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.coverImage.url}
                          alt={post.title}
                          className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                          loading="lazy"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                          {post.title}
                        </h2>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                          {post.brief}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(post.publishedAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views.toLocaleString()} views
                          </span>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
