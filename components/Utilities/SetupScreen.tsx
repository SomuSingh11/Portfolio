"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const BOOT_LINES = [
  "Booting OrbitOS kernel v1.0...",
  "Mounting root filesystem...",
  "Loading device drivers...",
  "Configuring network interfaces...",
  "Starting system services...",
  "Initializing display manager...",
  "System integrity check: PASSED.",
  "All services started successfully.",
];

const LOGIN_LINE = "orbitos login: guest";
const CHAR_DELAY = 10; // ms per character
const LINE_PAUSE = 30; // ms between lines

interface SetupScreenProps {
  onComplete: () => void;
}

export default function SetupScreen({ onComplete }: SetupScreenProps) {
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [typingLine, setTypingLine] = useState("");
  const [phase, setPhase] = useState<"booting" | "login" | "done">("booting");
  const logRef = useRef<HTMLDivElement>(null);
  // Single cancel token — when component unmounts, everything stops
  const cancelled = useRef(false);

  useEffect(() => {
    return () => {
      cancelled.current = true;
    };
  }, []);

  const sleep = useCallback(
    (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const t = setTimeout(resolve, ms);
        // Check cancellation on each sleep
        const check = setInterval(() => {
          if (cancelled.current) {
            clearTimeout(t);
            clearInterval(check);
            reject(new Error("cancelled"));
          }
        }, 50);
        setTimeout(() => clearInterval(check), ms + 100);
      }),
    [],
  );

  const typeLine = useCallback(
    async (line: string): Promise<void> => {
      for (let i = 0; i <= line.length; i++) {
        if (cancelled.current) return;
        setTypingLine(line.slice(0, i));
        await sleep(CHAR_DELAY);
      }
      if (cancelled.current) return;
      setCompletedLines((prev) => [...prev, line]);
      setTypingLine("");
    },
    [sleep],
  );

  useEffect(() => {
    const run = async () => {
      try {
        await sleep(200);

        for (const line of BOOT_LINES) {
          await typeLine(line);
          await sleep(LINE_PAUSE);
        }

        setPhase("login");
        await sleep(300);
        await typeLine(LOGIN_LINE);

        setPhase("done");
        await sleep(600);
        if (!cancelled.current) onComplete();
      } catch {
        // Silently stop if cancelled
      }
    };

    run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto scroll
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [completedLines, typingLine]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen bg-black text-[#00FF41] font-mono text-sm p-4"
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <div
        ref={logRef}
        className="w-full max-w-2xl h-80 overflow-y-auto rounded p-2 space-y-0.5"
        style={{ textShadow: "0 0 6px rgba(0,255,65,0.5)" }}
      >
        {completedLines.map((line, i) => (
          <p key={i} className="leading-relaxed">
            {phase === "done" && i === completedLines.length - 1
              ? line
              : `[ OK ] ${line}`}
          </p>
        ))}

        {typingLine && (
          <p className="leading-relaxed">
            {phase !== "login" && "[ OK ] "}
            {typingLine}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.7, repeat: Infinity }}
              className="inline-block w-2 h-[1em] bg-[#00FF41] ml-0.5 align-text-bottom"
            />
          </p>
        )}
      </div>

      <motion.button
        onClick={onComplete}
        className="absolute bottom-8 right-8 text-xs text-gray-600 hover:text-gray-300 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.8 } }}
      >
        Skip →
      </motion.button>
    </motion.div>
  );
}
