export type MediaType = "image" | "gif" | "video" | "youtube";

export interface MediaItem {
  type: MediaType;
  src: string;
  alt?: string;
  poster?: string;
}

export interface TechGroup {
  category: string;
  items: string[];
}

export interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  media?: MediaItem;
}

export interface Challenge {
  title: string;
  problem: string;
  solution: string;
}

export interface Result {
  metric: string;
  label: string;
  icon?: string;
}

export interface Project {
  id: number;
  slug: string;
  name: string;
  category: string;
  status: "Completed" | "In Progress" | "Hackathon Finalist";
  date: string;
  description: string;
  tech: string[];
  demo: string;
  repo: string;
  media: MediaItem[];
  tagline?: string;
  duration?: string;
  teamSize?: string;
  problem?: string;
  solution?: string;
  techGroups?: TechGroup[];
  architectureDiagram?: string;
  architectureDescription?: string;
  featuresDeep?: FeatureCard[];
  myRole?: string;
  contributions?: string[];
  challenges?: Challenge[];
  results?: Result[];
  resultsDescription?: string;
  learnings?: string;
  futurePlans?: string;
  relatedProjects?: number[];
}

function imgs(paths: string[]): MediaItem[] {
  return paths.map((src) => ({
    type: (src.endsWith(".gif") ? "gif" : "image") as MediaType,
    src,
    alt: src.split("/").pop(),
  }));
}

const projects: Project[] = [
  {
    id: 1,
    slug: "catalyst",
    name: "Catalyst",
    category: "AI-Powered Developer Productivity Suite",
    status: "In Progress",
    date: "2025-01-28",
    duration: "Ongoing",
    teamSize: "Solo",
    tagline: "Your AI-powered co-pilot for smarter development workflows.",
    description:
      "An integrated AI-driven productivity platform to empower developers with GitHub repository analytics, AI-powered commit summaries, and intelligent quizzes for interview preparation and concept reinforcement.",
    problem:
      "Developers spend an enormous amount of time context-switching — reading through commit history, understanding unfamiliar codebases, and preparing for interviews in isolation from their actual work. There was no unified tool that combined real-time repository intelligence with active learning.",
    solution:
      "Catalyst plugs directly into your GitHub workflow. It summarises what changed and why using LLM-powered commit analysis, lets you ask questions about any codebase using RAG over the actual source files, and generates quizzes from the concepts you're working with — turning passive code reading into active learning.",
    tech: ["Next.js", "LangChain", "GitHub API", "RAG", "Gemini", "tRPC"],
    techGroups: [
      { category: "Frontend", items: ["Next.js", "TailwindCSS", "shadcn/ui"] },
      { category: "Backend", items: ["tRPC", "Node.js"] },
      {
        category: "AI & ML",
        items: ["LangChain", "Gemini API", "RAG Pipeline"],
      },
      { category: "APIs", items: ["GitHub API"] },
      { category: "Database", items: ["PostgreSQL", "Prisma"] },
    ],
    media: imgs([
      "/projectPhotos/Catalyst/1.png",
      "/projectPhotos/Catalyst/2.png",
      "/projectPhotos/Catalyst/3.png",
      "/projectPhotos/Catalyst/4.png",
      "/projectPhotos/Catalyst/5.png",
      "/projectPhotos/Catalyst/6.png",
    ]),
    featuresDeep: [
      {
        icon: "🤖",
        title: "GitWhiz — AI Commit Summaries",
        description:
          "Automatically summarises commit diffs into plain-English explanations, saving developers from parsing cryptic commit messages.",
      },
      {
        icon: "📊",
        title: "Repo Analytics Dashboard",
        description:
          "Visual breakdown of commit frequency, top contributors, language distribution, and activity trends across any GitHub repository.",
      },
      {
        icon: "💬",
        title: "Codebase Q&A",
        description:
          "Ask natural language questions about any codebase. Powered by RAG over the actual source files — not hallucination.",
      },
      {
        icon: "🧠",
        title: "Quizzy — Adaptive Interview Prep",
        description:
          "Generates quizzes based on the concepts in your current codebase, making interview prep contextual rather than generic.",
      },
    ],
    myRole:
      "Built end-to-end as a solo project. Designed the RAG pipeline architecture, integrated the GitHub API for real-time repository data, implemented the LangChain chains for commit summarisation and Q&A, and built the full Next.js frontend with tRPC for type-safe API communication.",
    challenges: [
      {
        title: "RAG accuracy on large codebases",
        problem:
          "Early versions hallucinated answers when the codebase exceeded the context window.",
        solution:
          "Implemented chunking with overlap and semantic similarity search using embeddings, so only the most relevant code sections are passed to the LLM.",
      },
      {
        title: "GitHub API rate limiting",
        problem:
          "Fetching full commit diffs for large repos quickly exhausted the unauthenticated rate limit.",
        solution:
          "Added OAuth GitHub authentication, request queuing with exponential backoff, and PostgreSQL result caching with TTL.",
      },
    ],
    results: [
      { metric: "Solo", label: "end-to-end build", icon: "👤" },
      { metric: "4", label: "core AI features shipped", icon: "🚀" },
    ],
    learnings:
      "Building RAG systems taught me that the retrieval step matters far more than the generation step. A perfectly tuned LLM with poor retrieval gives worse results than a basic LLM with precise retrieval.",
    futurePlans:
      "Adding GitLab and Bitbucket support, a VS Code extension for inline commit summaries, and a team dashboard for engineering managers.",
    demo: "https://catalyst-t1ft.onrender.com/",
    repo: "https://github.com/SomuSingh11/Catalyst",
    relatedProjects: [2, 3],
  },
  
  {
    id: 2,
    slug: "ashura-core-s3-idf",
    name: "Ashura Core (ESP-IDF)",
    category: "Embedded Systems / IoT",
    status: "In Progress",
    date: "2024-11-20",
    tagline: "A custom dual-core ESP-IDF OS architected for a highly expressive smart desk companion.",
    duration: "Ongoing",
    teamSize: "Solo",
    description:
      "Ashura is a comprehensive embedded OS firmware natively built in ESP-IDF for the ESP32-S3, powering a real-time interactive desk companion device. It features an animated companion system with expressive mood states, a Flipper Zero-style app launcher, WLED LED control integration, persistent storage via NVS, and a robust WebSocket client. The architecture emphasizes true dual-core FreeRTOS multitasking, event-driven design, and optimal memory management.",
    problem:
      "Building a highly expressive smart desk companion requires balancing fluid OLED animations, complex UI state, persistent Wi-Fi WebSockets, and heavy future audio processing pipelines. Constructing this on constrained microcontrollers without a rigid, OS-like architecture inevitably leads to blocking code, memory exhaustion, and janky display updates.",
    solution:
      "Engineered a scalable, layered microcontroller OS natively in ESP-IDF. The system leverages FreeRTOS for true dual-core multitasking—isolating the UI rendering, networking, and application logic on Core 1, while strictly reserving Core 0 for an upcoming ML-powered audio processing pipeline. The architecture utilizes a decoupled EventBus, stack-based scene navigation, and PROGMEM optimization to ensure silky-smooth performance.",
    tech: [
      "C++",
      "ESP-IDF",
      "ESP32-S3",
      "FreeRTOS",
      "U8g2 (OLED driver)",
      "WebSockets",
      "NVS Storage",
      "I2S",
    ],
    techGroups: [
      {
        category: "Microcontroller & Core",
        items: ["ESP32-S3", "ESP-IDF", "FreeRTOS", "C++"],
      },
      {
        category: "Display & UI",
        items: ["U8g2 (SSD1306 OLED)", "XBM Graphics", "Custom Renderer"],
      },
      {
        category: "Connectivity & Storage",
        items: ["WiFi", "WebSockets", "NVS Preferences", "PROGMEM (Flash)"],
      },
      {
        category: "Audio & Voice (Upcoming)",
        items: ["I2S Driver", "WakeNet", "MultiNet"],
      },
    ],
    demo: "https://github.com/SomuSingh11/Ashura-core-s3-idf",
    repo: "https://github.com/SomuSingh11/Ashura-core-s3-idf",
    media: imgs([
      "/projectPhotos/Ashura/1.jpeg",
      "/projectPhotos/Ashura/2.jpeg",
    ]),
    architectureDescription:
      "Ashura follows a modular, component-based OS architecture powered by FreeRTOS task pinning. Core 1 runs the primary event loop, orchestrating the `display` (U8g2), `ui` (stack-based scene navigation), `network` (WebSocket client), and `storage` (NVS) components. An `EventBus` provides decoupled pub/sub communication across the system, while a `MessageRouter` within the `services` component chains handlers for incoming remote commands. Core 0 is deliberately reserved for the `audio` and `voice` components (currently in development) to poll an I2S microphone for intent recognition. All inter-core communication is handled safely via bounded FreeRTOS Queues.",
    myRole: "Sole Developer / Architect",
    architectureDiagram: "/projectPhotos/Ashura/Ashura-Core-background.png",
    contributions: [
      "Architected a modular ESP-IDF kernel with prioritized service initialization and FreeRTOS dual-core task pinning",
      "Engineered a thread-safe, cross-core EventBus using FreeRTOS Queues for decoupled component communication",
      "Created MoodEngine companion system with 8 mood states, smooth lerp transitions, and autonomous behaviors",
      "Built a modular UI framework with screen stacking, dirty flag optimization, and input routing",
      "Implemented a robust MessageRouter to handle and dispatch incoming WebSocket JSON commands",
      "Optimized PROGMEM animation storage via XBM format for zero-copy frame playback",
      "Developed WLED integration with mDNS device discovery and HTTP control API",
      "Designed an upcoming audio pipeline structure for the INMP441 I2S microphone with DMA buffer management",
    ],
    featuresDeep: [
      {
        icon: "cpu",
        title: "Dual-Core Processing",
        description:
          "Strict separation of concerns: Core 1 drives the fluid OLED display and networking, while Core 0 is reserved for intensive upcoming audio DSP and ML inference.",
      },
      {
        icon: "layers",
        title: "Event-Driven Architecture",
        description:
          "Custom Pub/Sub EventBus built on FreeRTOS Queues for thread-safe cross-core communication, paired with a chain-of-responsibility MessageRouter for JSON payload dispatching.",
      },
      {
        icon: "eye",
        title: "Animated Companion System",
        description:
          "Expressive eye-based companion with 8 mood states, smooth easing between mood transitions, autonomous blinking, and micro-behaviors like random glances.",
      },
      {
        icon: "apps",
        title: "App Launcher",
        description:
          "Flipper Zero-inspired icon-based app menu with 3-row scrollable layout, visual scrollbar, XBM icon rendering, and push/pop navigation stack for submenu support.",
      },
      {
        icon: "lightbulb",
        title: "WLED Integration",
        description:
          "Full-featured LED control system supporting power toggle, brightness/speed/intensity sliders, effect selection, and automatic device discovery via mDNS.",
      },
      {
        icon: "wifi",
        title: "WebSocket Client",
        description:
          "Persistent WebSocket connection with automatic reconnection, exponential backoff (1s → 30s), device registration flow, heartbeat monitoring, and JSON message routing.",
      },
      {
        icon: "mic",
        title: "Native Voice Commands (Ongoing)",
        description:
          "Architecting real-time voice activity detection (VAD) and offline command recognition (e.g., 'open settings') without requiring cloud processing. Currently in active development.",
      },
      {
        icon: "film",
        title: "Animation Vibe System",
        description:
          "PROGMEM-optimized XBM animation player supporting two modes: autonomous full-screen playback or composited frame rendering.",
      },
      {
        icon: "clock",
        title: "System Apps",
        description:
          "Includes a dual-mode Clock Display synchronized via NTP, and a live System Statistics readout tracking heap memory, uptime, and WiFi signal.",
      },
    ],
    challenges: [
      {
        title: "Cross-Core Communication",
        problem:
          "Passing complex event data between the audio core and the UI core caused race conditions and memory leaks.",
        solution:
          "Implemented a lightweight `VoiceEvent` struct passed via a bounded FreeRTOS Queue. The UI core drains this queue safely on every tick.",
      },
      {
        title: "PROGMEM Optimization for Animation Storage",
        problem:
          "ESP32 has limited RAM (~520KB). Storing full animation frame buffers would exhaust heap within seconds. XBM frames need to be stored in flash and read on-demand.",
        solution:
          "Implemented PROGMEM storage for animation arrays and individual frame buffers. Used pgm_read_ptr() for frame reference, allowing U8g2 to read directly from flash.",
      },
      {
        title: "WebSocket Reconnection Under Spotty WiFi",
        problem:
          "Mobile/unstable networks cause frequent disconnections. Naive reconnection attempts drain power and spam logs.",
        solution:
          "Designed state machine with exponential backoff: idle → connecting (1s) → 2s → 4s → 8s → 16s → 30s → failed. Provides manual retry from UI.",
      },
      {
        title: "Screen Stack Navigation with Limited RAM",
        problem:
          "Keeping screen objects alive while navigating (push/pop) consumes memory if each screen holds large state.",
        solution:
          "Lightweight screen interface with minimal state. Each screen stores only essential data (current selection, scroll offset). Lazy-initialize heavy resources.",
      },
    ],
    results: [
      {
        metric: "128×64",
        label: "OLED Resolution (Perfect for minimalist UI)",
        icon: "monitor",
      },
      {
        metric: "Smooth",
        label: "Jank-free UI animation frame rate",
        icon: "zap",
      },
      {
        metric: "8",
        label: "Companion Mood States with smooth transitions",
        icon: "smile",
      },
      {
        metric: "2 Cores",
        label: "True parallel processing with FreeRTOS",
        icon: "cpu",
      },
      {
        metric: "500KB+",
        label: "Animation Data in PROGMEM without RAM impact",
        icon: "database",
      },
      {
        metric: "< 50ms",
        label: "Button debounce latency",
        icon: "hand-pointer",
      },
    ],
    resultsDescription:
      "Successfully built a professional-grade embedded OS that balances feature richness with tight resource constraints. Achieved silky-smooth display updates, responsive button input with < 50ms latency, and seamless mood transitions. The FreeRTOS architecture unlocks the full potential of the ESP32-S3's dual cores, leaving ample headroom for the upcoming voice pipeline.",
    learnings:
      "Designing a custom embedded OS requires rigorous understanding of FreeRTOS task scheduling and memory management. Event-driven architecture (EventBus) is invaluable for decoupling—the mood engine depends on nothing but events, making it reusable and testable.",
    futurePlans:
      "Finalize the local voice recognition pipeline, implement cloud fallback for ambiguous voice commands, implement Pomodoro timer with mood transitions, expand WLED integration with rhythm-reactive effects, and build companion gesture system (head nods, winks).",
  },
  
  {
    id: 3,
    slug: "huddle",
    name: "Huddle",
    category: "Full Stack",
    status: "Completed",
    date: "2024-06-17",
    tagline: "A production-ready real-time communication platform with servers, channels, and DMs. Supports role-based access, message editing, secure file uploads, and WebRTC-powered video/audio calls via LiveKit.",
    duration: "3 months",
    teamSize: "Solo",

    description:
      "A full-stack real-time communication platform inspired by Discord. Supports servers, channels, direct messaging, video/audio calls, file sharing, and role-based access control — all in a single Next.js 14 monorepo.",

    problem:
      "Building a cohesive real-time chat platform requires solving WebSocket state in a server-rendered framework, paginated message history synchronized with live events, WebRTC media rooms, and fine-grained permissions — all at once.",

    solution:
      "Huddle is a real-time collaboration platform featuring server and channel management, role-based access control, live messaging, file uploads, and WebRTC-powered audio/video communication via LiveKit. Real-time communication is handled using Socket.IO mounted on the Node.js HTTP server, while React Query manages cursor-paginated chat history with live cache synchronization through custom socket event handlers.",

    tech: [
      "Next.js 14",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Socket.IO",
      "LiveKit",
      "Clerk",
      "Tailwind CSS",
      "Zustand",
      "React Query",
      "UploadThing",
      "Radix UI",
      "Zod",
    ],

    techGroups: [
      {
        category: "Frontend",
        items: [
          "Next.js 14 (App Router)",
          "TypeScript",
          "Tailwind CSS",
          "Radix UI / shadcn",
          "Zustand",
          "React Query",
          "React Hook Form + Zod",
        ],
      },
      {
        category: "Backend",
        items: [
          "Next.js API Routes",
          "Socket.IO",
          "Prisma ORM",
          "PostgreSQL",
          "Clerk",
          "UploadThing",
          "LiveKit Server SDK",
        ],
      },
      {
        category: "Real-time & Media",
        items: ["Socket.IO", "LiveKit WebRTC", "@livekit/components-react"],
      },
      {
        category: "DevOps",
        items: ["Render", "Prisma Migrations", "next-pwa"],
      },
    ],

    demo: "https://huddle-mb7x.onrender.com/",
    repo: "https://github.com/yourusername/huddle",

    media: imgs([
      "/projectPhotos/Huddle/1.jpg",
      "/projectPhotos/Huddle/2.jpg",
      "/projectPhotos/Huddle/3.jpg",
      "/projectPhotos/Huddle/4.jpg",
      "/projectPhotos/Huddle/5.jpg",
      "/projectPhotos/Huddle/6.jpg",
    ]),
    
    architectureDescription:
      "Next.js 14 monorepo combining App Router for rendering with Pages Router for Socket.IO. The socket server mounts on the Node.js HTTP layer and is shared across all message handlers. Prisma models 7 entities with cascading deletes. React Query handles cursor-paginated history; a custom useChatSocket hook updates the cache live from socket events. LiveKit rooms are keyed by channel/conversation ID with server-side JWTs.",

    architectureDiagram: "/projectPhotos/Huddle/Huddle-architecture.png",
    myRole: "Sole Developer / Architect",

    contributions: [
      "Designed 7-model Prisma schema with cascading deletes and indexed foreign keys",
      "Solved Socket.IO + App Router integration by mounting on the Pages Router HTTP layer",
      "Built cursor-based infinite scroll with React Query and live WebSocket cache hydration",
      "Integrated LiveKit WebRTC with server-side JWT token generation per room",
      "Implemented 3-tier RBAC enforced at both API and UI layer",
      "Built 11-modal system via a single Zustand store with typed variants",
      "Configured UploadThing for server images and in-chat file/image attachments",
      "Set up Clerk auth with middleware-level route protection and server-side profile utilities",
    ],

    featuresDeep: [
      {
        icon: "message-square",
        title: "Real-Time Messaging",
        description:
          "Messages broadcast instantly via Socket.IO with React Query cache hydration. Falls back to 1s polling when WebSocket is unavailable.",
      },
      {
        icon: "shield",
        title: "Role-Based Access Control",
        description:
          "ADMIN, MODERATOR, GUEST roles enforced in every Prisma query and mirrored in the UI. Admins can manage members, roles, and server settings.",
      },
      {
        icon: "video",
        title: "Video & Audio Calls",
        description:
          "LiveKit WebRTC rooms per channel or DM. Server-side JWT tokens scoped per room and user identity.",
      },
      {
        icon: "mail",
        title: "Direct Messaging",
        description:
          "1:1 conversations lazily created via getOrCreateConversation. Fully paginated with infinite scroll and real-time sync.",
      },
      {
        icon: "paperclip",
        title: "File Sharing",
        description:
          "Images render inline via next/image. PDFs render as linked attachments. Both uploaded via UploadThing with client-side preview.",
      },
      {
        icon: "edit",
        title: "Message Editing & Soft Delete",
        description:
          "Inline editing with keyboard shortcuts. Soft delete replaces content with a tombstone string. All changes broadcast via socket update events.",
      },
    ],

    challenges: [
      {
        title: "Socket.IO with Next.js App Router",
        problem:
          "App Router does not expose the Node.js HTTP server that Socket.IO needs to attach to.",
        solution:
          "Mounted Socket.IO in a Pages Router API route and stored the `io` instance on `res.socket.server.io` for reuse across all message handlers.",
      },
      {
        title: "Live Cache Sync with React Query",
        problem:
          "Paginated message cache must update from socket events without refetching all pages.",
        solution:
          "Used `queryClient.setQueryData` to prepend new messages to `pages[0].items` and replace updated messages in-place by ID.",
      },
      {
        title: "Reverse Infinite Scroll",
        problem:
          "Loading older messages at the top causes scroll position to jump.",
        solution:
          "Custom `useChatScroll` hook tracks distance from bottom and only auto-scrolls on init or when the user is within 100px of the bottom.",
      },
      {
        title: "Hydration-Safe Modals",
        problem:
          "Radix UI Dialog portals rely on `document`, causing SSR hydration mismatches.",
        solution:
          "All modals use an `isMounted` guard set inside `useEffect`, rendering null on the server.",
      },
    ],

    results: [
      {
        metric: "7",
        label: "Prisma models with relational integrity",
        icon: "database",
      },
      {
        metric: "3",
        label: "Channel types — TEXT, AUDIO, VIDEO",
        icon: "hash",
      },
      {
        metric: "11",
        label: "Modal types via one Zustand store",
        icon: "layers",
      },
      {
        metric: "RBAC",
        label: "3 roles enforced at API + UI level",
        icon: "shield",
      },
      {
        metric: "WebRTC",
        label: "Live video/audio via LiveKit",
        icon: "video",
      },
      {
        metric: "PWA",
        label: "Installable with service worker caching",
        icon: "smartphone",
      },
    ],

    resultsDescription:
      "Huddle demonstrates production-grade real-time full-stack patterns: shared WebSocket state in Next.js, surgical React Query cache updates, WebRTC media rooms, and a normalized relational schema with role-based access — all in one deployable codebase.",

    learnings:
      "App Router's architecture intentionally avoids exposing the raw HTTP server, requiring the Pages Router fallback for Socket.IO. Designing the Prisma schema upfront prevented painful migrations. React Query's infinite cache requires immutable update patterns — replacing the full cache on each socket event breaks pagination. The `isMounted` hydration guard is essential for any portal-based UI in Next.js.",

    futurePlans:
      "Message threads, emoji reactions, push notifications via PWA, message search with full-text indexing, and migrating Socket.IO to a managed provider for horizontal scaling.",

    relatedProjects: [1, 2],
  },
  
  {
    id: 4,
    slug: "sync-city",
    name: "Sync-City",
    category: "GovTech | HackByte 3.0 Finalist",
    status: "Hackathon Finalist",
    date: "2025-04-11",
    duration: "48-hour hackathon",
    teamSize: "Team of 4",
    tagline: "Preventing government project conflicts before they cost crores.",
    description:
      "A centralized collaboration platform for government departments designed to prevent resource wastage and project conflicts through real-time coordination, AI-powered conflict detection, and geospatial awareness.",
    problem:
      "Government departments in India frequently initiate overlapping infrastructure projects — roads dug up weeks after new pavement, utility lines laid through active construction zones. Departments operate in silos with no shared visibility into each other's projects.",
    solution:
      "Sync-City provides a unified dashboard where all departments register their projects geospatially. An AI layer continuously monitors for conflicts and generates custom SOPs for resolution when conflicts are detected.",
    tech: ["Next.js", "Convex", "Dialogflow CX", "Google Vertex AI"],
    techGroups: [
      { category: "Frontend", items: ["Next.js", "TailwindCSS", "Leaflet.js"] },
      { category: "Backend", items: ["Convex"] },
      { category: "AI", items: ["Dialogflow CX", "Google Vertex AI"] },
      { category: "Maps", items: ["Leaflet.js", "OpenStreetMap"] },
    ],
    media: imgs([
      "/projectPhotos/Synccity/1.jpeg",
      "/projectPhotos/Synccity/2.jpeg",
      "/projectPhotos/Synccity/3.jpeg",
      "/projectPhotos/Synccity/4.jpeg",
      "/projectPhotos/Synccity/5.jpeg",
    ]),
    featuresDeep: [
      {
        icon: "🗺️",
        title: "Geospatial Project Registry",
        description:
          "Departments plot their projects on an interactive map with timeline overlays, making spatial conflicts immediately visible.",
      },
      {
        icon: "⚡",
        title: "AI Conflict Detection",
        description:
          "Vertex AI analyses project overlaps across time, geography, and resource type — flagging conflicts before they begin.",
      },
      {
        icon: "📋",
        title: "Auto-generated SOPs",
        description:
          "When a conflict is detected, the system generates a custom Standard Operating Procedure based on the specific conflict type.",
      },
      {
        icon: "🔄",
        title: "Real-time Coordination",
        description:
          "Powered by Convex — when one department updates a project, all affected departments are notified instantly.",
      },
    ],
    myRole:
      "Led frontend development and the AI conflict detection integration. Built the interactive Leaflet.js map, integrated Dialogflow CX for the department chatbot, and handled Convex real-time subscriptions.",
    contributions: [
      "Built the entire interactive map interface with Leaflet.js",
      "Integrated Dialogflow CX for natural language department queries",
      "Designed the conflict detection data model",
      "Led the live demo presentation to judges",
    ],
    challenges: [
      {
        title: "Real-time geospatial conflict detection in 48 hours",
        problem:
          "Implementing polygon intersection detection for arbitrary project boundaries with real-time updates under hackathon time pressure.",
        solution:
          "Used bounding box approximation for the MVP with Leaflet's built-in bounds intersection, with a note that production would use Turf.js.",
      },
    ],
    results: [
      {
        metric: "Top 10",
        label: "out of 120+ teams at HackByte 3.0",
        icon: "🏆",
      },
      { metric: "48hrs", label: "to build the full prototype", icon: "⚡" },
    ],
    resultsDescription:
      "Reached the finals at HackByte 3.0, one of the largest collegiate hackathons in Central India. Judges highlighted the real-world applicability and AI conflict detection as standout features.",
    learnings:
      "Hackathons taught me that architectural decisions made in the first two hours determine whether you ship or not. Choosing Convex instead of building custom WebSockets saved roughly eight hours.",
    demo: "https://devfolio.co/projects/synccity-a778",
    repo: "https://github.com/SomuSingh11/syncV1",
    relatedProjects: [1, 3],
  },
  
  {
    id: 5,
    slug: "orbitos",
    name: "OrbitOS",
    category: "Frontend / Creative Portfolio",
    status: "Completed",
    date: "2024-05-16",
    tagline: "A full-fledged desktop operating system environment running entirely in the browser.",
    duration: "Ongoing",
    teamSize: "Solo",
    description: "OrbitOS is my personal portfolio reimagined as a web-based operating system. It features a window management system, functional built-in applications like a Terminal and Browser, AI integration for an interactive assistant, and a highly customizable UI.",
    problem: "Traditional portfolios can be static and fail to demonstrate complex state management, real-time interactivity, and system-level design thinking in modern frontend development.",
    solution: "Built a simulated desktop environment with React and Next.js, featuring draggable/resizable windows, z-index management, a functional terminal, context-aware AI interactions, and mobile responsiveness.",
    tech: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "Gemini AI"],
    techGroups: [
      { category: "Frontend", items: ["Next.js 15", "React 19", "TailwindCSS v4", "Framer Motion"] },
      { category: "AI & APIs", items: ["Google Gemini SDK"] },
      { category: "UI/UX", items: ["Lucide React"] }
    ],
    demo: "/",
    repo: "https://github.com/SomuSingh11/Portfolio",
    media: [],
    featuresDeep: [
      {
        icon: "apps",
        title: "Window Management System",
        description: "Built a robust window manager supporting dragging, resizing, maximizing, minimizing, and dynamic z-index stacking."
      },
      {
        icon: "monitor",
        title: "Functional Terminal",
        description: "A custom terminal emulator with built-in commands, auto-completion, and customizable themes."
      },
      {
        icon: "zap",
        title: "AI Integration",
        description: "Integrated Google's Gemini SDK for a conversational AI assistant directly within the OS environment."
      },
      {
        icon: "smartphone",
        title: "Mobile Responsiveness",
        description: "A dedicated mobile experience mimicking a smartphone OS with a lock screen, notification panel, and app launcher."
      }
    ],
    myRole: "Sole Developer / Designer",
    contributions: [
      "Designed and implemented the core window management system with Framer Motion.",
      "Integrated the @google/genai SDK for the AI assistant application.",
      "Built the global preferences store for dynamic theming (fonts, wallpapers, terminal themes).",
      "Developed mobile-specific interfaces including a lock screen and Home Screen."
    ],
    challenges: [
      {
        title: "Complex State Management for Windows",
        problem: "Managing the state of multiple draggable, resizable windows, including their focus, z-index, and minimized states without causing excessive re-renders.",
        solution: "Used centralized state management with targeted updates and memoization to keep the window manager performant and responsive."
      }
    ],
    results: [
      { metric: "1", label: "Unified OS Interface", icon: "monitor" },
      { metric: "Mobile", label: "Native-feeling mobile view", icon: "smartphone" }
    ],
    resultsDescription: "Successfully created an interactive, highly personalized portfolio that effectively showcases frontend capabilities, state management, and creative design.",
    learnings: "Building a simulated OS from scratch provided deep insights into complex state management, DOM event handling (dragging, resizing), and creating responsive layouts that adapt radically between desktop and mobile paradigms.",
    futurePlans: "Implement a fully functional file system API using IndexedDB, add more interactive applications, and expand the AI assistant's system-level context.",
    relatedProjects: [1, 3],
  },
];

export default projects;
