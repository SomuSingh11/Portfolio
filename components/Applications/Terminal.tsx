"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import commands from "@/data/TerminalCommands";
import { useCommandHistory } from "@/hooks/system/useCommandHistory";
import { usePreferences } from "@/store/preferences-store";

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
⢠⡴⠛⡇⠀⠐⠀⡄⣡⢇⠸⢸⢸⡇⠂⡝⠌⢷⢫⢮⡜⡀⠀
⠀⠀⢰⣜⠘⡀⢡⠰⠳⣎⢂⣟⡎⠘⣬⡕⣈⣼⠢⠹⡟⠇⠀
⠀⠠⢋⢿⢳⢼⣄⣆⣦⣱⣿⣿⣿⣷⠬⣿⣿⣿⣿⠑⠵⠀⠀
⠀⠀⠀⡜⢩⣯⢝⡀⠁⠀⠙⠛⠛⠃⠀⠈⠛⠛⡿⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣿⠢⡁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣀⡇⠀⠑⠀⠀⠀⠀⠐⢄⠄⢀⡼⠃⠀⠀⠀⠀
⠀⠀⠀⠀⢸⣿⣷⣤⣀⠈⠲⡤⣀⣀⠀⡰⠋⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣶⣤⣙⣷⣅⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢀⣾⣿⣿⣿⣿⣻⢿⣿⣿⣿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀
⠀⡠⠟⠁⠙⠟⠛⠛⢿⣿⣾⣿⣿⣿⣿⣧⡀⠀⠀⠀⠀⠀⠀`;

const BOOT_MESSAGES = [
  "Initializing OrbitOS v1.0...",
  "Mounting virtual environment... ✓",
  "Loading file system... ✓",
  "System ready.",
  "",
  "Welcome to OrbitOS Terminal",
  "Copyright (c) 2025 Somu Singh. All rights reserved.",
  `Type "help" for available commands.`,
];

function linkify(text: string): string {
  return text.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-cyan-400 underline hover:text-cyan-300">$1</a>',
  );
}

export default function Terminal() {
  const { prefs } = usePreferences();
  const { terminalFontSize, showBootScreen } = prefs;

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isBooting, setIsBooting] = useState(showBootScreen);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLabel, setBootLabel] = useState("Initializing...");
  const [bootDone, setBootDone] = useState(!showBootScreen);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { addToHistory, navigateHistory } = useCommandHistory();

  // Scroll to bottom on history update
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Boot sequence
  useEffect(() => {
    if (!showBootScreen) {
      setHistory([
        { input: "", output: MATRIX_ART },
        ...BOOT_MESSAGES.map((msg) => ({ input: "", output: msg })),
      ]);
      return;
    }

    let mounted = true;

    const sleep = (ms: number) =>
      new Promise<void>((res) => setTimeout(res, ms));

    const boot = async () => {
      const total = BOOT_MESSAGES.length;

      for (let i = 0; i < total; i++) {
        if (!mounted) return;

        setBootLabel(BOOT_MESSAGES[i] || "Ready.");
        setBootProgress(Math.round(((i + 1) / total) * 100));

        await sleep(220);
      }

      if (!mounted) return;

      setBootProgress(100);
      await sleep(300);

      if (!mounted) return;

      setBootDone(true);
      await sleep(400);

      if (!mounted) return;

      setIsBooting(false);

      // Add boot output
      setHistory((prev) => [
        ...prev,
        { input: "", output: MATRIX_ART },
        ...BOOT_MESSAGES.map((msg) => ({ input: "", output: msg })),
      ]);
    };

    boot();

    return () => {
      mounted = false;
    };
  }, [showBootScreen]);

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
    <span className="flex items-center flex-shrink-0" style={{ color: "var(--terminal-prompt)" }}>
      <span>somu@orbitos</span>
      <span className="text-white/50 px-1">:</span>
      <span>~/orbitos</span>
      <span className="text-white/50 pl-1">$&nbsp;</span>
    </span>
  );

  const fontSizeClass = {
    sm: "text-xs",
    base: "text-sm",
    lg: "text-base",
  }[terminalFontSize];

  return (
    <div 
      className={`relative h-full flex flex-col rounded-lg overflow-hidden border border-white/10 font-mono ${fontSizeClass}`}
      style={{ backgroundColor: "var(--terminal-bg)" }}
    >
      {/* Boot overlay */}
      {isBooting && !bootDone && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-lg transition-opacity duration-400"
          style={{
            backgroundColor: "var(--terminal-bg)",
            opacity: bootDone ? 0 : 1,
            pointerEvents: bootDone ? "none" : "auto",
          }}
        >
          <span className="text-xs tracking-[0.15em]" style={{ color: "var(--terminal-text)" }}>
            ORBITOS v1.0
          </span>
          <div className="w-48 h-[3px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${bootProgress}%`, backgroundColor: "var(--terminal-text)" }}
            />
          </div>
          <span className="text-white/50 text-xs">{bootLabel}</span>
        </div>
      )}

      {/* Output area */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-0 scrollbar-thin scrollbar-thumb-[#2a2a3a] scrollbar-track-transparent"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, i) => (
          <div key={i}>
            {entry.input && (
              <div className="flex items-center flex-wrap mb-0.5">
                {PROMPT}
                <span className="text-white">{entry.input}</span>
              </div>
            )}
            <div className="mb-3">
              {entry.output.split("\n").map((line, li) => (
                <div
                  key={li}
                  className={`whitespace-pre-wrap leading-relaxed ${
                    entry.input === "" ? "leading-tight" : ""
                  }`}
                  style={{ color: "var(--terminal-text)" }}
                  dangerouslySetInnerHTML={{
                    __html: linkify(line) || "&nbsp;",
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Input line */}
        {!isBooting && (
          <div className="flex items-center">
            {PROMPT}
            <div className="flex-1 flex items-center relative">
              <span style={{ color: "var(--terminal-text)" }} className="whitespace-pre">{currentInput}</span>
              <span
                className={`inline-block w-[7px] h-[14px] align-middle ml-px ${
                  isInputFocused
                    ? "animate-[blink_1s_step-end_infinite]"
                    : "opacity-0"
                }`}
                style={{ backgroundColor: "var(--terminal-text)" }}
              />
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                className="absolute inset-0 opacity-0 cursor-default w-full bg-transparent border-none outline-none text-transparent"
                style={{ caretColor: "transparent" }}
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
