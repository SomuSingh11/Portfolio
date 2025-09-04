"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const bootSequence = [
  "Booting Codex kernel v1.0...",
  "Mounting root filesystem...",
  "Loading device drivers...",
  "Configuring network interfaces...",
  "Starting system services...",
  "Initializing display manager...",
  "System integrity check: PASSED.",
  "All services started successfully.",
];

const loginPrompt = "codex login: guest";

interface SetupScreenProps {
  onComplete: () => void;
}

export default function SetupScreen({ onComplete }: SetupScreenProps) {
  const [log, setLog] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let currentStep = 0;

    const typeLine = (line: string, callback: () => void) => {
      let charIndex = 0;
      const typingInterval = setInterval(() => {
        if (!isMounted.current) {
          clearInterval(typingInterval);
          return;
        }
        if (charIndex < line.length) {
          setCurrentLine(line.substring(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setLog((prevLog) => [...prevLog, line]);
          setCurrentLine("");
          callback();
        }
      }, 40);
    };

    const nextStep = () => {
      if (currentStep < bootSequence.length) {
        typeLine(bootSequence[currentStep], () => {
          currentStep++;
          setTimeout(nextStep, 100);
        });
      } else {
        setTimeout(() => {
          if (isMounted.current) setShowLogin(true);
        }, 300);
      }
    };

    setTimeout(nextStep, 300);
  }, []);

  useEffect(() => {
    if (showLogin) {
      let charIndex = 0;
      const loginInterval = setInterval(() => {
        if (!isMounted.current) {
          clearInterval(loginInterval);
          return;
        }
        if (charIndex < loginPrompt.length) {
          setCurrentLine(loginPrompt.substring(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(loginInterval);
          setTimeout(onComplete, 1000);
        }
      }, 60);
    }
  }, [showLogin, onComplete]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [log, currentLine]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen bg-black text-[#00FF41] font-mono text-sm p-4"
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <div
        ref={logContainerRef}
        className="w-[700px] max-w-full h-[350px] overflow-y-auto p-2 rounded"
        style={{ textShadow: "0 0 5px rgba(0, 255, 65, 0.5)" }}
      >
        {log.map((line, index) => (
          <p key={index}>[ OK ] {line}</p>
        ))}
        {currentLine && (
          <p>
            {showLogin ? "" : "[ OK ] "}
            {currentLine}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-[#00FF41] ml-1"
            ></motion.span>
          </p>
        )}
      </div>

      <motion.button
        onClick={onComplete}
        className="absolute bottom-5 right-5 text-xs text-gray-500 hover:text-white hover:underline transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1 } }}
      >
        Skip Boot &gt;
      </motion.button>
    </motion.div>
  );
}
