"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import type { MediaItem, MediaType } from "@/data/projects";

interface MediaCarouselProps {
  items: MediaItem[];
  projectName: string;
}

function YouTubeEmbed({ src, title }: { src: string; title: string }) {
  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string) => {
    const patterns = [
      /youtube\.com\/watch\?v=([^&]+)/,
      /youtu\.be\/([^?]+)/,
      /youtube\.com\/embed\/([^?]+)/,
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return m[1];
    }
    return url;
  };

  const videoId = getVideoId(src);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;

  return (
    <iframe
      src={embedUrl}
      title={title}
      className="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

function VideoPlayer({ src, poster }: { src: string; poster?: string }) {
  return (
    <video
      src={src}
      poster={poster}
      className="w-full h-full object-contain"
      controls
      playsInline
      preload="metadata"
    />
  );
}

function MediaRenderer({
  item,
  projectName,
}: {
  item: MediaItem;
  projectName: string;
}) {
  switch (item.type) {
    case "youtube":
      return <YouTubeEmbed src={item.src} title={item.alt ?? projectName} />;

    case "video":
      return <VideoPlayer src={item.src} poster={item.poster} />;

    case "gif":
      // eslint-disable-next-line @next/next/no-img-element
      return (
        <img
          src={item.src}
          alt={item.alt ?? projectName}
          className="w-full h-full object-contain"
        />
      );

    case "image":
    default:
      return (
        <Image
          src={item.src}
          alt={item.alt ?? projectName}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 800px"
          priority={false}
        />
      );
  }
}

function MediaTypeBadge({ type }: { type: MediaType }) {
  if (type === "image") return null;
  const labels: Record<string, string> = {
    gif: "GIF",
    video: "VIDEO",
    youtube: "YOUTUBE",
  };
  return (
    <span className="absolute top-3 left-3 z-10 text-[10px] font-bold bg-black/70 text-white px-2 py-0.5 rounded tracking-widest">
      {labels[type]}
    </span>
  );
}

export default function MediaCarousel({
  items,
  projectName,
}: MediaCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const touchStart = useRef<number | null>(null);

  const total = items.length;

  const go = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current],
  );

  const prev = useCallback(
    () => go((current - 1 + total) % total),
    [go, current, total],
  );
  const next = useCallback(
    () => go((current + 1) % total),
    [go, current, total],
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
    }
    touchStart.current = null;
  };

  if (!items || items.length === 0) return null;

  const currentItem = items[current];

  return (
    <div className="w-full space-y-3">
      {/* Main viewer */}
      <div
        className="relative w-full bg-gray-950 rounded-xl overflow-hidden"
        style={{ aspectRatio: "16/9" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <MediaTypeBadge type={currentItem.type} />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <MediaRenderer item={currentItem} projectName={projectName} />
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next buttons — only show if more than 1 item */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-3 right-3 z-10 text-[11px] font-medium bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
              {current + 1} / {total}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip — only if more than 2 items */}
      {total > 2 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`relative flex-shrink-0 w-16 h-10 rounded-md overflow-hidden border-2 transition-colors ${
                i === current
                  ? "border-blue-500"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
              aria-label={`Go to media ${i + 1}`}
            >
              {item.type === "video" || item.type === "youtube" ? (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.src}
                  alt={item.alt ?? `Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
