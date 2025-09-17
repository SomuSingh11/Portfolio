"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import LinkRenderer from "@/components/Utilities/LinkRenderer";
import commands from "@/components/data/TerminalCommands";

interface Command {
  input: string;
  output: string;
  timestamp: Date;
}

const matrixArt = `
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

export default function Terminal() {
  const [history, setHistory] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentPath] = useState("~/codex");
  const [isBooting, setIsBooting] = useState(true);
  const effectRan = useRef(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Scroll to bottom on history update
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // This useEffect handles the entire welcome animation
  useEffect(() => {
    if (effectRan.current === false) {
      const runWelcomeAnimation = async () => {
        const addHistory = (output: string) => {
          setHistory((prev) => [
            ...prev,
            { input: "", output, timestamp: new Date() },
          ]);
        };

        const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

        // Using the shorter, faster boot sequence
        const matrixLoadProcess = [
          "Initializing Codex OS v1.0...",
          "Mounting virtual environment... ✓",
          "System ready.",
          "",
          `Welcome to Codex OS Terminal
Copyright (c) 2025 Somu Singh. All rights reserved.

Type "help" for available commands.`,
        ];

        addHistory(matrixArt);
        await sleep(800);

        for (const process of matrixLoadProcess) {
          addHistory(process);
          await sleep(400);
        }

        setIsBooting(false);
      };

      runWelcomeAnimation();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  useEffect(() => {
    if (!isBooting) {
      inputRef.current?.focus();
    }
  }, [isBooting]);

  const executeCommand = (input: string) => {
    const trimmedInput = input.trim().toLowerCase();

    // Logic to download the resume
    if (trimmedInput === "resume") {
      const link = document.createElement("a");
      link.href = "/Resume_Somu11.pdf";
      link.download = "SomuSingh_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const newCommand: Command = {
        input,
        output: "✅ Resume download initiated successfully!",
        timestamp: new Date(),
      };
      setHistory((prev) => [...prev, newCommand]);
      setCurrentInput("");
      return;
    }

    if (trimmedInput === "clear") {
      setHistory([]);
      setCurrentInput("");
      return;
    }

    const output =
      commands[trimmedInput as keyof typeof commands] ||
      `bash: ${input}: command not found\nType "help" to see available commands.`;

    const newCommand: Command = {
      input,
      output,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, newCommand]);
    setCurrentInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      executeCommand(currentInput);
    }
  };

  const handleMainClick = () => {
    if (!isBooting) {
      inputRef.current?.focus();
    }
  };

  return (
    <div
      className="h-full bg-black text-green-400 font-mono flex flex-col px-1"
      onClick={handleMainClick}
      tabIndex={0}
      role="presentation"
      style={{ outline: "none", height: "calc(100% - 3.5rem)" }}
    >
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto px-1 scrollbar-gutter-stable"
      >
        {history.map((command, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
            {command.input && (
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-blue-400">somu_singh@codex-os</span>
                <span className="text-white">:</span>
                <span className="text-purple-400">{currentPath}</span>
                <span className="text-white">$</span>
                <span className="text-white">{command.input}</span>
              </div>
            )}
            <div className="mb-4">
              {command.output.split("\n").map((line, lineIndex) => (
                <motion.div
                  key={lineIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: lineIndex * 0.03 }}
                  className={`text-green-400 whitespace-pre-wrap ${
                    command.input === "" ? "leading-tight" : "leading-relaxed"
                  }`}
                >
                  <LinkRenderer text={line} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {!isBooting && (
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <span className="text-blue-400">somu_singh@codex-os</span>
            <span className="text-white">:</span>
            <span className="text-purple-400">{currentPath}</span>
            <span className="text-white">$</span>
            <div className="flex-1 flex items-center relative">
              <span className="text-white">{currentInput}</span>
              <span
                className={`text-white ${
                  isInputFocused ? "terminal-cursor" : ""
                }`}
              >
                ▌
              </span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                className="absolute inset-0 opacity-0 cursor-default"
                autoComplete="off"
                autoFocus
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
