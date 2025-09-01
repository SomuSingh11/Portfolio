"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Command {
  input: string;
  output: string[];
  timestamp: Date;
}

const commands = {
  help: [
    "Available commands:",
    "  whoami      - Display user information",
    "  ls          - List available applications",
    "  cat about   - Show about information",
    "  ps          - Show running processes",
    "  neofetch    - Display system information",
    "  clear       - Clear terminal",
    "  exit        - Close terminal",
    "  sudo hire   - Download resume",
    "",
    "Portfolio OS v1.0 - Developer Edition",
  ],
  whoami: [
    "john_doe",
    "",
    "Full Stack Developer | San Francisco, CA",
    "Specializing in React, Next.js, and Node.js",
  ],
  ls: [
    "Applications:",
    "drwxr-xr-x  2 john_doe staff   64 Sep  1 10:30 Projects/",
    "drwxr-xr-x  2 john_doe staff   64 Sep  1 10:30 About/",
    "drwxr-xr-x  2 john_doe staff   64 Sep  1 10:30 Skills/",
    "drwxr-xr-x  2 john_doe staff   64 Sep  1 10:30 Contact/",
    "drwxr-xr-x  2 john_doe staff   64 Sep  1 10:30 GitHub/",
    "-rw-r--r--  1 john_doe staff 2048 Sep  1 10:30 resume.pdf",
  ],
  "cat about": [
    "# About John Doe",
    "",
    "Passionate full-stack developer with 3+ years of experience",
    "building modern web applications. I love creating efficient,",
    "scalable solutions and exploring new technologies.",
    "",
    "Currently focused on React ecosystem and serverless architectures.",
  ],
  ps: [
    "PID    NAME              CPU   MEMORY",
    "1234   portfolio-app     12%   156MB",
    "1235   github-sync       2%    45MB",
    "1236   terminal          1%    23MB",
    "1237   window-manager    3%    67MB",
  ],
  neofetch: [
    "                   -`",
    "                  .o+`                 john_doe@portfolio-os",
    "                 `ooo/                 ----------------------",
    "                `+oooo:                OS: Portfolio OS 1.0",
    "               `+oooooo:               Host: Developer Workstation",
    "               -+oooooo+:              Kernel: React 18.2.0",
    "             `/:-:++oooo+:             Uptime: 2 years, 156 days",
    "            `/++++/+++++++:            Packages: 847 (npm)",
    "           `/++++++++++++++:           Shell: zsh 5.8.1",
    "          `/+++ooooooooo+++/           Resolution: 1920x1080",
    "         ./ooosssso++osssssso+`        Terminal: portfolio-terminal",
    "        .oossssso-````/ossssss+`       CPU: M1 Pro (8) @ 3.20GHz",
    "       -osssssso.      :ssssssso.      Memory: 2048MiB / 16384MiB",
    "      :osssssss/        osssso+++.",
    "     /ossssssss/        +ssssooo/-",
    "   `/ossssso+/:-        -:/+osssso+-",
    "  `+sso+:-`                 `.-/+oso:",
    " `++:.                           `-/+/",
    " .`                                 `/",
  ],
  "sudo hire": [
    "[sudo] password for john_doe: ********",
    "",
    "Initiating hire process...",
    "█████████████████████████████ 100%",
    "",
    "✅ Resume package downloaded successfully!",
    "📄 john_doe_resume_2025.pdf",
    "💼 portfolio_examples.zip",
    "🔗 references_contact_list.txt",
    "",
    "Thank you for considering me! 🚀",
    "",
    "Contact: john@example.com",
  ],
};

export default function Terminal() {
  const [history, setHistory] = useState<Command[]>([
    {
      input: "",
      output: [
        "Welcome to Portfolio OS Terminal",
        "Copyright (c) 2025 John Doe. All rights reserved.",
        "",
        'Type "help" for available commands.',
        "",
      ],
      timestamp: new Date(),
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentPath] = useState("~/portfolio");
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (input: string) => {
    const trimmedInput = input.trim().toLowerCase();

    if (trimmedInput === "clear") {
      setHistory([]);
      setCurrentInput("");
      return;
    }

    if (trimmedInput === "exit") {
      // In a real implementation, this would close the window
      console.log("Terminal exit requested");
      return;
    }

    const output = commands[trimmedInput as keyof typeof commands] || [
      `bash: ${input}: command not found`,
      `Type "help" to see available commands.`,
    ];

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

  return (
    <div className="h-full bg-black text-green-400 font-mono flex flex-col">
      {/* Terminal Content */}
      <div ref={terminalRef} className="flex-1 p-4 overflow-y-auto">
        {history.map((command, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
            {command.input && (
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-blue-400">john_doe@portfolio-os</span>
                <span className="text-white">:</span>
                <span className="text-purple-400">{currentPath}</span>
                <span className="text-white">$</span>
                <span className="text-white">{command.input}</span>
              </div>
            )}
            <div className="mb-4">
              {command.output.map((line, lineIndex) => (
                <motion.div
                  key={lineIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: lineIndex * 0.03 }}
                  className="text-green-400 leading-relaxed"
                >
                  {line}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Current Input */}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <span className="text-blue-400">john_doe@portfolio-os</span>
          <span className="text-white">:</span>
          <span className="text-purple-400">{currentPath}</span>
          <span className="text-white">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white"
            autoComplete="off"
          />
          <span className="text-white terminal-cursor">█</span>
        </form>
      </div>
    </div>
  );
}
