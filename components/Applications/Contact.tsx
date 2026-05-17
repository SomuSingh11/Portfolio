"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { Download, MessageCircle } from "lucide-react";
import { PERSONAL_INFO, SOCIAL_LINKS } from "@/config/constants";

const LINKS = [
  {
    icon: "/logos/gmail.png",
    label: "shoot me an email",
    sub: PERSONAL_INFO.email,
    href: `mailto:${PERSONAL_INFO.email}`,
    colorClass: "text-blue-400",
    bgClass: "bg-blue-900/10",
    borderClass: "border-blue-800/20",
  },
  {
    icon: "/logos/linkedin.png",
    label: "connect on linkedin",
    sub: "where I'm most responsive",
    href: SOCIAL_LINKS.linkedin,
    colorClass: "text-sky-400",
    bgClass: "bg-sky-900/10",
    borderClass: "border-sky-800/20",
  },
  {
    icon: "/logos/github.png",
    label: "stalk my code",
    sub: "github.com/SomuSingh11",
    href: SOCIAL_LINKS.github,
    colorClass: "text-gray-300",
    bgClass: "bg-gray-800/40",
    borderClass: "border-gray-700/40",
  },
  {
    icon: "/logos/x.png",
    label: "find me on x",
    sub: "@SomuSingh_",
    href: SOCIAL_LINKS.x,
    colorClass: "text-slate-400",
    bgClass: "bg-slate-900/10",
    borderClass: "border-slate-700/30",
  },
];

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export default function Contact() {
  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = PERSONAL_INFO.resumePath;
    link.download = "SomuSingh_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col items-center overflow-y-auto">
      <div className="w-full max-w-2xl flex flex-col">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 border-b border-gray-800 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">
                let&apos;s talk
              </h1>
              <p className="text-gray-400 text-xs leading-relaxed">
                whether it&apos;s about a project, a collab, or just a random
                chit-chat — I&apos;m always down. find me wherever you&apos;re
                comfortable.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Links ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="p-4 space-y-3"
        >
          {LINKS.map(
            ({ icon, label, sub, href, colorClass, bgClass, borderClass }) => (
              <motion.a
                key={label}
                variants={item}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className={`flex items-center gap-3.5 p-4 rounded-xl border ${bgClass} ${borderClass} hover:border-gray-600/70 transition-colors group`}
              >
                {/* Brand logo */}
                <div className="w-9 h-9 rounded-xl bg-white/80 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <img
                    src={icon}
                    alt={label}
                    className="w-6 h-6 object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {label}
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5 truncate">
                    {sub}
                  </p>
                </div>

                <span
                  className={`text-sm opacity-0 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all ${colorClass}`}
                >
                  ↗
                </span>
              </motion.a>
            ),
          )}

          {/* ── Resume ── */}
          <motion.button
            variants={item}
            onClick={handleDownload}
            className="w-full flex items-center gap-3.5 p-4 rounded-xl border bg-gray-800/40 border-gray-700/40 hover:border-gray-600/70 transition-colors group text-left"
          >
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 flex-shrink-0">
              <Download className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">grab my resume</p>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                SomuSingh_Resume.pdf
              </p>
            </div>
            <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-60 group-hover:translate-y-0.5 transition-all">
              ↓
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
