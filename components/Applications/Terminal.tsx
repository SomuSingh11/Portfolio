"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import LinkRenderer from "@/components/Utilities/LinkRenderer";
import commands from "@/data/TerminalCommands";
import { useCommandHistory } from "@/hooks/system/useCommandHistory";

interface HistoryEntry {
  input: string;
  output: string;
}

const MATRIX_ART = `
⠀⠀⠀⠀⠀⠀⠀⢀⠀⠔⡀⠀⢀⠞⢰⠂⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢸⠘⢰⡃⠔⠩⠤⠦⠤⢀⡀⠀⠀⠀⠀⠀
⠀⠀⠀⢀⠄⢒⠒⠺⠆⠈⠀⠀⢐⣂⠤⠄⡀⠯⠕⣒⣒⡀⠀
⠀⠀⢐⡡⠔⠁⠆⠀⠀⠀⠀⠀⢀⠠⠙⢆⠀⠈⢁⠋⠥⣀⣀
⠈⠉⠀⣰⠀⠀⠀⠀⡀⠀⢰⣆⢠⠠⢡⡀⢂⣗⣖⢝⡎⠉⠀
⢠⡴⠛⡇⠀⠐⠀⡄⣡⢇⠸⢸⢸⡇⠂⡝⠌⢷⢫⢮⡜⡀⠀`;

const BOOT_MESSAGES = [
  "Initializing Codex OS v1.0...",
  "Mounting virtual environment... ✓",
  "System ready.",
  "",
  `Welcome to Codex OS Terminal\nCopyright (c) 2025 Somu Singh. All rights reserved.\n\nType "help" for available commands.`,
];

export default function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isBooting, setIsBooting] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasBooted = useRef(false);

  const { addToHistory, navigateHistory } = useCommandHistory();

  // Scroll to bottom whenever history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Boot sequence — guard with ref so StrictMode double-invoke doesn't double-run
  useEffect(() => {
    if (hasBooted.current) return;
    hasBooted.current = true;

    let cancelled = false;

    const boot = async () => {
      const sleep = (ms: number) =>
        new Promise<void>((res) => {
          const t = setTimeout(res, ms);
          if (cancelled) clearTimeout(t);
        });

      const addLine = (output: string) => {
        if (cancelled) return;
        setHistory((prev) => [...prev, { input: "", output }]);
      };

      addLine(MATRIX_ART);
      await sleep(600);

      for (const msg of BOOT_MESSAGES) {
        if (cancelled) return;
        addLine(msg);
        await sleep(350);
      }

      if (!cancelled) setIsBooting(false);
    };

    boot();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isBooting) {
      inputRef.current?.focus();
    }
  }, [isBooting]);

  const executeCommand = useCallback(
    (input: string) => {
      const trimmed = input.trim();
      if (!trimmed) return;

      addToHistory(trimmed);
      const lower = trimmed.toLowerCase();

      if (lower === "clear") {
        setHistory([]);
        setCurrentInput("");
        return;
      }

      if (lower === "resume") {
        const link = document.createElement("a");
        link.href = "/Resume_Somu11.pdf";
        link.download = "SomuSingh_Resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setHistory((prev) => [
          ...prev,
          { input: trimmed, output: "✅ Resume download initiated!" },
        ]);
        setCurrentInput("");
        return;
      }

      const output =
        commands[lower as keyof typeof commands] ??
        `bash: ${trimmed}: command not found\nType "help" to see available commands.`;

      setHistory((prev) => [...prev, { input: trimmed, output }]);
      setCurrentInput("");
    },
    [addToHistory],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        executeCommand(currentInput);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = navigateHistory("up");
        if (prev !== null) setCurrentInput(prev);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = navigateHistory("down");
        if (next !== null) setCurrentInput(next);
      }
    },
    [currentInput, executeCommand, navigateHistory],
  );

  const PROMPT = (
    <span className="flex items-center space-x-1 flex-shrink-0">
      <span className="text-blue-400">somu@codex</span>
      <span className="text-white">:</span>
      <span className="text-purple-400">~/codex</span>
      <span className="text-white">$</span>
    </span>
  );

  return (
    <div
      className="h-full bg-black text-green-400 font-mono text-sm flex flex-col"
      onClick={() => inputRef.current?.focus()}
      style={{ height: "calc(100% - 2.5rem)" }}
    >
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5"
      >
        {history.map((entry, i) => (
          <div key={i}>
            {entry.input && (
              <div className="flex items-center space-x-2 flex-wrap">
                {PROMPT}
                <span className="text-white">{entry.input}</span>
              </div>
            )}
            <div className="text-green-400">
              {entry.output.split("\n").map((line, li) => (
                <motion.div
                  key={li}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: li * 0.02 }}
                  className="whitespace-pre-wrap leading-relaxed"
                >
                  <LinkRenderer text={line} />
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* Input line */}
        {!isBooting && (
          <div className="flex items-center space-x-2">
            {PROMPT}
            <div className="flex-1 flex items-center relative">
              <span className="text-white">{currentInput}</span>
              <span
                className={`text-white ${isInputFocused ? "terminal-cursor" : ""}`}
              >
                ▌
              </span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                className="absolute inset-0 opacity-0 cursor-default w-full"
                autoComplete="off"
                spellCheck={false}
                aria-label="Terminal input"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
