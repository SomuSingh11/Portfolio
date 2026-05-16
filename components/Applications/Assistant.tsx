"use client";

/**
 * Assistant — Clean ChatGPT-style AI chat interface.
 *
 * Design principles:
 *  - AI messages: plain text, left-aligned, no bubble — just like ChatGPT
 *  - User messages: pill bubble on the right
 *  - Dark neutral background (#212121)
 *  - Streaming cursor visible in real-time as tokens arrive
 *  - Minimal header, clean input bar at the bottom
 */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AssistantProvider,
  useAssistant,
  type ChatMessage,
} from "@/store/assistant-store";
import { useDevice } from "@/provider/device-provider";

// ─── Markdown renderer ───────────────────────────────────────────────────────
// Lightweight — handles what Gemini commonly produces
function renderMarkdown(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Fenced code blocks
    .replace(
      /```[\w]*\n?([\s\S]*?)```/g,
      '<pre class="ai-code-block"><code>$1</code></pre>',
    )
    // Inline code
    .replace(/`([^`\n]+)`/g, '<code class="ai-inline-code">$1</code>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Bullet list
    .replace(/^[-•]\s+(.+)$/gm, '<li class="ai-list-item">$1</li>')
    // Numbered list
    .replace(/^\d+\.\s+(.+)$/gm, '<li class="ai-list-item">$1</li>')
    // Links
    .replace(
      /(https?:\/\/[^\s<>"]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="ai-link">$1</a>',
    )
    // Newlines
    .replace(/\n/g, "<br/>");
}

// ─── Streaming cursor ────────────────────────────────────────────────────────
function StreamCursor() {
  return (
    <span
      className="inline-block w-[2px] h-[1em] bg-gray-300 align-middle ml-[1px] rounded-sm"
      style={{ animation: "cursorBlink 0.9s step-end infinite" }}
    />
  );
}

// ─── Single message row ──────────────────────────────────────────────────────
function MessageRow({
  msg,
  showCursor,
}: {
  msg: ChatMessage;
  showCursor: boolean;
}) {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(msg.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [msg.text]);

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="flex justify-end px-4 md:px-8"
      >
        <div className="max-w-[70%] bg-[#303030] text-[#ececec] text-sm leading-relaxed rounded-3xl px-4 py-3 whitespace-pre-wrap break-words">
          {msg.text}
        </div>
      </motion.div>
    );
  }

  // AI message — no bubble, plain text like ChatGPT
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="flex gap-3 px-4 md:px-8 group"
    >
      {/* Small model icon */}
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center mt-0.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L9.5 9.5L2 12L9.5 14.5L12 22L14.5 14.5L22 12L14.5 9.5L12 2Z"
            fill="#212121"
          />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <div
          className="text-sm text-[#ececec] leading-relaxed ai-prose"
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(msg.text) + (showCursor ? "" : ""),
          }}
        />
        {/* Live streaming cursor */}
        {showCursor && <StreamCursor />}

        {/* Copy — appears on hover once done streaming */}
        {!showCursor && msg.text.length > 0 && (
          <button
            onClick={handleCopy}
            className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-300"
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                Copied
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Typing dots (before first token arrives) ─────────────────────────────────
function ThinkingDots() {
  return (
    <div className="flex gap-3 px-4 md:px-8">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center mt-0.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L9.5 9.5L2 12L9.5 14.5L12 22L14.5 14.5L22 12L14.5 9.5L12 2Z" fill="#212121" />
        </svg>
      </div>
      <div className="flex items-center gap-1 h-6">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gray-500"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Empty state / welcome screen ─────────────────────────────────────────────
const SUGGESTIONS = [
  "What's his tech stack?",
  "Tell me about his projects",
  "How can I contact Somu?",
  "What are his achievements?",
];

function WelcomeScreen({ onPrompt }: { onPrompt: (p: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center h-full gap-6 px-6 text-center"
    >
      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L9.5 9.5L2 12L9.5 14.5L12 22L14.5 14.5L22 12L14.5 9.5L12 2Z" fill="#212121" />
        </svg>
      </div>
      <div>
        <h2 className="text-white text-xl font-semibold">Ask me about Somu</h2>
        <p className="text-gray-400 text-sm mt-1">
          Skills, projects, background, how to reach him — I know it all.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onPrompt(s)}
            className="text-left text-xs text-gray-300 bg-[#2f2f2f] hover:bg-[#3a3a3a] border border-[#444] rounded-xl px-3 py-2.5 transition-colors leading-snug"
          >
            {s}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main chat panel ──────────────────────────────────────────────────────────
function AssistantChat() {
  const {
    messages,
    isStreaming,
    error,
    sendMessage,
    clearHistory,
    clearError,
  } = useAssistant();

  const { isMobile } = useDevice();

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on every message update (including streamed tokens)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [input]);

  const handleSend = useCallback(() => {
    const t = input.trim();
    if (!t || isStreaming) return;
    sendMessage(t);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [input, isStreaming, sendMessage]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  // The last model message receives the streaming cursor
  const lastModelId = [...messages]
    .reverse()
    .find((m) => m.role === "model")?.id;

  // Show thinking dots only when streaming hasn't produced any text yet
  const lastMsg = messages[messages.length - 1];
  const showThinking =
    isStreaming && lastMsg?.role === "model" && lastMsg.text === "";

  const isEmpty = messages.length === 0;

  return (
    <div className="h-full flex flex-col bg-[#212121] overflow-hidden">
      {/* ── Minimal header — mobile only ── */}
      {isMobile && (
        <div className="flex-shrink-0 flex items-center justify-between px-4 h-12 border-b border-[#2f2f2f]">
          <span className="text-sm font-medium text-gray-200">AI Assistant</span>
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              New chat
            </button>
          )}
        </div>
      )}

      {/* ── Message list ── */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-thin scrollbar-thumb-[#3a3a3a] scrollbar-track-transparent">
        {isEmpty ? (
          <WelcomeScreen onPrompt={sendMessage} />
        ) : (
          <>
            {messages.map((msg) => {
              // If it's a new streaming message with no text yet, show the dots
              if (msg.id === lastModelId && isStreaming && msg.text === "") {
                return <ThinkingDots key={msg.id} />;
              }
              // Otherwise, show the actual message row
              return (
                <MessageRow
                  key={msg.id}
                  msg={msg}
                  showCursor={
                    msg.id === lastModelId && isStreaming && msg.text.length > 0
                  }
                />
              );
            })}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Error banner ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex-shrink-0 mx-4 mb-2 px-3 py-2 bg-red-900/30 border border-red-800/50 rounded-lg flex items-center justify-between gap-2 text-xs text-red-300"
          >
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-200 flex-shrink-0"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Input bar ── */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2">
        <div
          className={`flex items-end gap-2 bg-[#2f2f2f] rounded-2xl px-4 py-3 border transition-colors ${
            isStreaming
              ? "border-[#3a3a3a]"
              : "border-[#3a3a3a] focus-within:border-[#555]"
          }`}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming ? "Generating…" : "Message AI Assistant"}
            disabled={isStreaming}
            className="flex-1 resize-none bg-transparent text-sm text-[#ececec] placeholder-gray-500 outline-none leading-relaxed py-0 min-h-[22px] scrollbar-none disabled:cursor-not-allowed"
            style={{ maxHeight: "160px" }}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="flex-shrink-0 w-8 h-8 rounded-lg bg-white hover:bg-gray-200 disabled:bg-[#444] disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            aria-label="Send"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={input.trim() && !isStreaming ? "#212121" : "#888"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-600 mt-1.5">
          Shift + Enter for new line · Powered by Gemini
        </p>
      </div>
    </div>
  );
}

// ─── Export (wraps its own provider) ─────────────────────────────────────────
export default function Assistant() {
  return (
    <AssistantProvider>
      <AssistantChat />
    </AssistantProvider>
  );
}
