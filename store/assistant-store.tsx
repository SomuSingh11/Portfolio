"use client";

/**
 * Assistant Store — manages multi-turn AI chat state.
 *
 * Responsibilities:
 *  - Holds the full message history for the session
 *  - Streams tokens from /api/chat incrementally into the last message
 *  - Tracks streaming state, errors, and rate-limit metadata
 *  - Provides clearHistory() and retry helpers
 *
 * Pattern: React Context + useReducer (consistent with the rest of the codebase)
 */

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MessageRole = "user" | "model";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
}

export interface RateLimitInfo {
  remaining: number;
  resetInSeconds: number;
}

interface AssistantState {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
  rateLimitInfo: RateLimitInfo | null;
}

type AssistantAction =
  | { type: "ADD_USER_MESSAGE"; payload: ChatMessage }
  | { type: "START_STREAM"; payload: ChatMessage } // empty model message placeholder
  | { type: "APPEND_TOKEN"; payload: { id: string; token: string } }
  | { type: "FINISH_STREAM" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "CLEAR_HISTORY" }
  | { type: "SET_RATE_LIMIT"; payload: RateLimitInfo };

// ─── Reducer ──────────────────────────────────────────────────────────────────

const initialState: AssistantState = {
  messages: [],
  isStreaming: false,
  error: null,
  rateLimitInfo: null,
};

function reducer(state: AssistantState, action: AssistantAction): AssistantState {
  switch (action.type) {
    case "ADD_USER_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload], error: null };

    case "START_STREAM":
      return {
        ...state,
        isStreaming: true,
        error: null,
        messages: [...state.messages, action.payload],
      };

    case "APPEND_TOKEN":
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.payload.id
            ? { ...m, text: m.text + action.payload.token }
            : m,
        ),
      };

    case "FINISH_STREAM":
      return { ...state, isStreaming: false };

    case "SET_ERROR":
      return { ...state, isStreaming: false, error: action.payload };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    case "CLEAR_HISTORY":
      return { ...initialState };

    case "SET_RATE_LIMIT":
      return { ...state, rateLimitInfo: action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AssistantContextValue extends AssistantState {
  sendMessage: (text: string) => Promise<void>;
  clearHistory: () => void;
  clearError: () => void;
}

const AssistantContext = createContext<AssistantContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || state.isStreaming) return;

    // 1. Record the user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
      timestamp: Date.now(),
    };
    dispatch({ type: "ADD_USER_MESSAGE", payload: userMsg });

    // 2. Create an empty model placeholder for streaming into
    const modelMsgId = `model-${Date.now()}`;
    const modelMsg: ChatMessage = {
      id: modelMsgId,
      role: "model",
      text: "",
      timestamp: Date.now(),
    };
    dispatch({ type: "START_STREAM", payload: modelMsg });

    // 3. Build history to send (exclude the placeholder we just added)
    // We access the current state snapshot before dispatch settled, so we
    // reconstruct from `state.messages` plus the new userMsg.
    const historyToSend = [...state.messages, userMsg]
      .filter((m) => m.text.trim().length > 0) // skip empty placeholders
      .map((m) => ({ role: m.role, text: m.text }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: historyToSend.slice(0, -1), // exclude the current user message (sent as `message`)
        }),
      });

      // Parse rate-limit headers
      const remaining = parseInt(res.headers.get("X-RateLimit-Remaining") ?? "9");
      const resetInSeconds = parseInt(res.headers.get("X-RateLimit-Reset") ?? "0");
      dispatch({ type: "SET_RATE_LIMIT", payload: { remaining, resetInSeconds } });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unknown error." }));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      // 4. Stream tokens
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body.");

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const token = decoder.decode(value, { stream: true });
        dispatch({ type: "APPEND_TOKEN", payload: { id: modelMsgId, token } });
      }

      dispatch({ type: "FINISH_STREAM" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      dispatch({ type: "SET_ERROR", payload: msg });
    }
  }, [state.isStreaming, state.messages]);

  const clearHistory = useCallback(() => {
    dispatch({ type: "CLEAR_HISTORY" });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  return (
    <AssistantContext.Provider
      value={{ ...state, sendMessage, clearHistory, clearError }}
    >
      {children}
    </AssistantContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAssistant() {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error("useAssistant must be used within AssistantProvider");
  return ctx;
}
