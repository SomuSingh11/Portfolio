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
    "  whoami",
    "  ls",
    "  ps",
    "  neofetch",
    "  matrix",
    "  joke",
    "  coffee",
    "  clear",

    "",
    "Easter eggs: Try 'sl', 'cowsay', 'figlet', 'rm -rf /' or find more!",
    "",
    "Codex OS v1.0 - Developer Edition",
  ],
  whoami: [
    "Somu Singh",
    "",
    "Full Stack Developer | Indore, Madhya Pradesh",
    "Specializing in React, Next.js, Generative AI and Frontend Technologies",
  ],
  ls: [
    "Applications:",
    "drwxr-xr-x  2 somu_singh staff   64 Sep  1 10:30 Projects/",
    "drwxr-xr-x  2 somu_singh staff   64 Sep  1 10:30 About/",
    "drwxr-xr-x  2 somu_singh staff   64 Sep  1 10:30 Skills/",
    "drwxr-xr-x  2 somu_singh staff   64 Sep  1 10:30 Contact/",
    "drwxr-xr-x  2 somu_singh staff   64 Sep  1 10:30 GitHub/",
    "drwxr-xr-x  1 somu_singh staff 2048 Sep  1 10:30 Resume/",
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
    "                  .o+`                 somu_singh@codex-os",
    "                 `ooo/                 ----------------------",
    "                `+oooo:                OS: Codex OS 1.0",
    "               `+oooooo:               Host: Developer Workstation",
    "               -+oooooo+:              Kernel: React 18.2.0",
    "             `/:-:++oooo+:             Uptime: 2 years, 156 days",
    "            `/++++/+++++++:            Packages: 847 (npm)",
    "           `/++++++++++++++:           Shell: zsh 5.8.1",
    "          `/+++ooooooooo+++/           Resolution: 1920x1080",
    "         ./ooosssso++osssssso+`        Terminal: codex-terminal",
    "        .oossssso-````/ossssss+`       CPU: M1 Pro (8) @ 3.20GHz",
    "       -osssssso.      :ssssssso.      Memory: 2048MiB / 16384MiB",
    "      :osssssss/        osssso+++.",
    "     /ossssssss/        +ssssooo/-",
    "   `/ossssso+/:-        -:/+osssso+-",
    "  `+sso+:-`                 `.-/+oso:",
    " `++:.                           `-/+/",
    " .`                                 `/",
  ],
  matrix: [
    "Entering the Matrix...",
    "01001000 01100101 01101100 01101100 01101111",
    "Wake up, Neo...",
    "The Matrix has you...",
    "Follow the white rabbit 🐰",
    "",
    "Red pill or blue pill? 💊",
    "There is no spoon 🥄",
  ],
  joke: [
    "Why do programmers prefer dark mode?",
    "",
    "Because light attracts bugs! 🐛",
    "",
    "😄 *ba dum tss* 🥁",
  ],
  coffee: [
    "Brewing coffee... ☕",
    "",
    "      (  )   (   )  )",
    "       ) (   )  (  (",
    "       ( )  (    ) )",
    "       _____________",
    "      <_____________> ___",
    "      |             |/ _ \\",
    "      |               | | |",
    "      |               |_| |",
    "   ___|             |\\___/",
    "  /    \\___________/    \\",
    "  \\_____________________/",
    "",
    "☕ Your coffee is ready! Stay caffeinated, keep coding! 💻",
  ],

  // Easter eggs
  sl: [
    "                      (@@) (  ) (@)  ( )  @@    ()    @     O     @     O      @",
    "                 (   )",
    "             (@@@@)",
    "          (    )",
    "",
    "        (@@@)",
    "    ====        ________                ___________",
    "_D _|  |_______/        \\__I_I_____===__|_________|",
    " |(_)---  |   H\\________/ |   |        =|___ ___|      _________________",
    " /     |  |   H  |  |     |   |         ||_| |_||     _|                \\_____A",
    "|      |  |   H  |__--------------------| [___] |   =|                        |",
    "| ________|___H__/__|_____/[][]~\\_______|       |   -|                        |",
    "|/ |   |-----------I_____I [][] []  D   |=======|____|________________________|_",
    "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|__________________________|_",
    " |/-=|___|=    ||    ||    ||    |_____/~\\___/          |_D__D__D_|  |_D__D__D_|",
    "  \\_/      \\O=====O=====O=====O_/      \\_/               \\_/   \\_/    \\_/   \\_/",
    "",
    "🚂 You meant 'ls', right? Here's a train instead!",
  ],

  cowsay: [
    " _________________",
    "< Hello from Somu! >",
    " -----------------",
    "        \\   ^__^",
    "         \\  (oo)\\_______",
    "            (__)\\       )\\/\\",
    "                ||----w |",
    "                ||     ||",
    "",
    "🐄 Moo-velous portfolio, isn't it?",
  ],

  figlet: [
    " ____                          ____  _             _     ",
    "/ ___|  ___  _ __ ___  _   _  / ___|(_)_ __   __ _| |__  ",
    "\\___ \\ / _ \\| '_ ` _ \\| | | | \\___ \\| | '_ \\ / _` | '_ \\ ",
    " ___) | (_) | | | | | | |_| |  ___) | | | | | (_| | | | |",
    "|____/ \\___/|_| |_| |_|\\__,_| |____/|_|_| |_|\\__, |_| |_|",
    "                                             |___/       ",
    "",
    "✨ ASCII Art is cool, right?",
  ],
  "rm -rf /": [
    "⚠️  WHOA THERE! ⚠️",
    "",
    "Nice try, but this terminal is read-only! 😄",
    "Your portfolio is safe from destructive commands.",
    "",
    "However, I can help you remove bugs from your code! 🐛➡️🗑️",
  ],
};

export default function Terminal() {
  const [history, setHistory] = useState<Command[]>([
    {
      input: "",
      output: [
        "Welcome to Codex OS Terminal",
        "Copyright (c) 2025 Somu Singh. All rights reserved.",
        "",
        'Type "help" for available commands.',
        "",
      ],
      timestamp: new Date(),
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentPath] = useState("~/codex");
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

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

  // Focus input when main div is clicked
  const handleMainClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className="h-full bg-black text-green-400 font-mono flex flex-col"
      onClick={handleMainClick}
      tabIndex={0}
      role="presentation"
      style={{ outline: "none", height: "calc(100% - 5rem)" }}
    >
      {/* Terminal Content */}
      <div ref={terminalRef} className="flex-1 overflow-y-auto px-1">
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
              {command.output.map((line, lineIndex) => (
                <motion.div
                  key={lineIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: lineIndex * 0.03 }}
                  className="text-green-400 leading-relaxed whitespace-pre-wrap"
                >
                  {line}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Current Input */}
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
      </div>
    </div>
  );
}
