/**
 * POST /api/chat
 *
 * Secure server-side proxy to the Google Gemini API.
 *
 * Security layers implemented:
 *  1. Rate limiting   — 10 req/min · 50 req/hr per IP (sliding window)
 *  2. Input validation — max message length, max history depth
 *  3. Secret isolation — GEMINI_API_KEY never exposed to the client
 *  4. System prompt   — injected server-side; client cannot tamper with it
 *
 * Protocol:
 *  Request body  → { message: string; history: ChatMessage[] }
 *  Response      → Server-Sent text stream (plain text chunks)
 *  Error codes   → 400 (bad input) · 429 (rate limited) · 500 (server error)
 */

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { checkRateLimit, LIMITS } from "@/lib/rateLimit";

// ─── Config ───────────────────────────────────────────────────────────────────
const MAX_MESSAGE_LENGTH = 4_000;   // characters
const MAX_HISTORY_TURNS  = 20;      // message pairs kept in context

// ─── System Prompt ────────────────────────────────────────────────────────────
// Injected server-side only — the client never sees this.
const SYSTEM_PROMPT = `You are an AI assistant embedded in Somu Singh's interactive portfolio website (OrbitOS — a macOS/Linux-inspired desktop experience built with Next.js and Framer Motion).

Your role: Help visitors learn about Somu, his work, and how to connect with him. Be warm, concise, and slightly witty — like a knowledgeable friend, not a corporate bot.

## About Somu Singh
- **Full name**: Somu Singh  
- **Location**: Indore, MP, India (IST, UTC+5:30)
- **Email**: somusingh0110@gmail.com
- **GitHub**: https://github.com/SomuSingh11
- **LinkedIn**: https://www.linkedin.com/in/somusingh11/
- **X / Twitter**: https://x.com/SomuSingh_

## Tech Stack
- **Frontend**: React 19, Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Backend/Runtime**: Node.js, Next.js API Routes
- **AI/ML**: Google Gemini API (@google/genai)
- **Tools**: Git, GitHub, VS Code, Linux

## This Portfolio (OrbitOS)
- A desktop OS simulation built in React/Next.js
- Features: draggable windows, taskbar, wallpaper preferences, terminal emulator, GitHub stats viewer, PDF resume viewer, mobile-responsive layout
- Stack: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Radix UI, react-hot-toast

## Guidelines
- Answer questions about Somu's skills, projects, background, and how to contact him
- Keep responses concise (2-4 sentences unless detail is asked for)
- Use markdown formatting where it helps (bold for names/tech, bullet lists for skills)
- If asked something you don't know, be honest but helpful — redirect to contact
- Never make up specific project details you weren't given
- You may suggest: "Check out the Projects app" or "Open GitHub" for more info`;

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface RequestBody {
  message: string;
  history: ChatMessage[];
}

// ─── Route Handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Resolve client IP for rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  // 2. Rate limit check
  const rateResult = checkRateLimit(ip);
  if (!rateResult.allowed) {
    return new NextResponse(
      JSON.stringify({
        error: `Rate limit exceeded. You can send ${LIMITS.perMinute} messages per minute and ${LIMITS.perHour} per hour. Please wait ${rateResult.resetInSeconds}s.`,
        resetInSeconds: rateResult.resetInSeconds,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rateResult.resetInSeconds),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(rateResult.resetInSeconds),
        },
      },
    );
  }

  // 3. Parse and validate body
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { message, history } = body;

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "message is required." }, { status: 400 });
  }
  if (message.trim().length === 0) {
    return NextResponse.json({ error: "message cannot be empty." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters).` },
      { status: 400 },
    );
  }
  if (!Array.isArray(history)) {
    return NextResponse.json({ error: "history must be an array." }, { status: 400 });
  }

  // 4. Trim history to the last N turns to control context size
  const trimmedHistory = history.slice(-MAX_HISTORY_TURNS);

  // 5. Build Gemini request
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[chat/route] GEMINI_API_KEY is not set.");
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 },
    );
  }

  const genAI = new GoogleGenAI({ apiKey });

  // Convert our history format to Gemini's Content format
  const geminiHistory = trimmedHistory.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.text }],
  }));

  // 6. Stream the response
  try {
    const result = await genAI.models.generateContentStream({
      model: "gemini-3.1-flash-lite",
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.75,
        maxOutputTokens: 1024,
      },
      contents: [
        ...geminiHistory,
        { role: "user", parts: [{ text: message.trim() }] },
      ],
    });

    // Pipe Gemini stream → ReadableStream → Response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          console.error("[chat/route] Stream error:", err);
          controller.enqueue(encoder.encode("\n\n[Stream interrupted]"));
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-RateLimit-Remaining": String(rateResult.remaining),
        "Cache-Control": "no-cache, no-store",
      },
    });
  } catch (err: unknown) {
    console.error("[chat/route] Gemini error:", err);
    const message =
      err instanceof Error ? err.message : "Unknown error from Gemini API.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Block all other methods
export function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
