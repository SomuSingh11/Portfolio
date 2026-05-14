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
    id: 3,
    slug: "huddle",
    name: "Huddle",
    category: "Real-Time Communication Platform",
    status: "Completed",
    date: "2025-01-10",
    duration: "3 Months",
    teamSize: "Solo",
    tagline:
      "A production-ready real-time communication platform with servers, channels, and DMs. Supports role-based access, message editing, secure file uploads, and WebRTC-powered video/audio calls via LiveKit.",
    description:
      "A production-ready real-time communication platform with servers, channels, and DMs. Supports role-based access, message editing, secure file uploads, and WebRTC-powered video/audio calls via LiveKit.",
    problem:
      "Most real-time chat tutorials stop at basic WebSockets with no auth, no roles, no file uploads, no video calls. I wanted to build something that solved all of those problems together at production quality.",
    solution:
      "Huddle implements the full Discord feature set — server creation, channel management, role-based access control with three permission levels, real-time messaging with Socket.IO, file uploads, and WebRTC video and audio calls via LiveKit.",
    tech: [
      "Next.js",
      "Prisma",
      "Clerk",
      "Socket.IO",
      "LiveKit",
      "PostgreSQL",
      "Zustand",
      "React Query",
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
      { category: "Real-time Video", items: ["LiveKit", "WebRTC"] },
      { category: "File Storage", items: ["UploadThing"] },
    ],
    media: imgs([
      "/projectPhotos/Huddle/1.jpg",
      "/projectPhotos/Huddle/2.jpg",
      "/projectPhotos/Huddle/3.jpg",
      "/projectPhotos/Huddle/4.jpg",
      "/projectPhotos/Huddle/5.jpg",
      "/projectPhotos/Huddle/6.jpg",
    ]),
    featuresDeep: [
      {
        icon: "⚡",
        title: "Real-Time Messaging",
        description:
          "Messages broadcast instantly via Socket.IO with React Query cache hydration. Falls back to 1s polling when WebSocket is unavailable.",
      },
      {
        icon: "🛡️",
        title: "Role-Based Access Control",
        description:
          "ADMIN, MODERATOR, GUEST roles enforced in every Prisma query and mirrored in the UI. Admins can manage members, roles, and server settings.",
      },
      {
        icon: "📹",
        title: "Video & Audio Calls",
        description:
          "LiveKit WebRTC rooms per channel or DM. Server-side JWT tokens scoped per room and user identity.",
      },
      {
        icon: "📁",
        title: "Secure File Uploads",
        description:
          "UploadThing integration with file type validation, size limits, and direct-to-storage uploads that bypass the API server.",
      },
    ],
    myRole:
      "Built entirely solo. Designed the PostgreSQL schema, implemented the Socket.IO real-time layer, integrated LiveKit for WebRTC calls, set up Clerk authentication, and built the full Next.js frontend with Zustand and React Query.",
    contributions: [
      "Designed the server/channel/member database schema",
      "Implemented Socket.IO real-time messaging with optimistic UI",
      "Integrated LiveKit WebRTC for video and audio calls",
      "Set up Clerk auth with server-level permissions",
    ],

    demo: "https://huddle-mb7x.onrender.com/",
    repo: "https://github.com/SomuSingh11/Huddle",

    challenges: [
      {
        title: "Message ordering under concurrent load",
        problem:
          "Messages occasionally rendered out of order due to race conditions between optimistic UI updates and server-confirmed events.",
        solution:
          "Added sequence numbers at the server level and implemented client-side re-sorting on the React Query cache before rendering.",
      },
      {
        title: "LiveKit room lifecycle management",
        problem:
          "LiveKit rooms persisted after all participants left, causing stale room state on reconnection.",
        solution:
          "Implemented server-side room cleanup webhooks from LiveKit that update database state on participant-left events.",
      },
    ],
    results: [
      { metric: "6", label: "major features shipped solo", icon: "🚀" },
      { metric: "100%", label: "of Discord's core feature set", icon: "✅" },
    ],
    learnings:
      "Building Huddle gave me deep intuition for the difference between real-time and eventual consistency. You need to design your UI to handle the gap between optimistic state and confirmed state gracefully.",
    futurePlans:
      "Adding thread support, message reactions, and a React Native mobile app using the same backend.",

    relatedProjects: [1, 2],
  },
  {
    // ── Core Metadata ─────────────────────────────────────────
    id: 4,
    slug: "ashura-core-esp32",
    name: "Ashura Firmware",
    category: "Embedded Systems / IoT",
    status: "In Progress",
    date: "2024-06-15",
    tagline: "A custom ESP32-based OS for an expressive smart desk companion",
    duration: "6 months (ongoing)",
    teamSize: "Solo",

    // ── Overview ──────────────────────────────────────────────
    description:
      "Ashura is a comprehensive embedded OS firmware built for ESP32 microcontrollers, powering a real-time interactive desk companion device. It features an animated companion system with expressive mood states, a Flipper Zero-style app launcher, WLED LED control integration, persistent storage via NVS, and a robust WebSocket client for remote command handling. The architecture emphasizes modularity, event-driven design, and optimal memory management in a constrained embedded environment.",

    problem:
      "Existing ESP32 projects lack cohesive system architecture, proper state management, and scalable UI patterns. Building sophisticated interactive experiences on microcontrollers with limited RAM requires careful abstraction to balance features with performance.",

    solution:
      "Designed a layered architecture mirroring desktop OS kernels: boot sequence with prioritized service initialization, an event bus for decoupled pub/sub communication, stack-based scene navigation for UI management, and modular application services. Optimized for PROGMEM storage of animation frames, efficient string handling with ArduinoJson, and non-blocking WebSocket reconnection with exponential backoff.",

    // ── Technology Stack ─────────────────────────────────────
    tech: [
      "C++",
      "Arduino Framework",
      "ESP32 / ESP32-S3",
      "ArduinoWebsockets",
      "ArduinoJson",
      "U8g2 (OLED driver)",
      "NVS Storage",
      "mDNS Discovery",
      "NTP Time Sync",
      "PlatformIO",
    ],

    techGroups: [
      {
        category: "Microcontroller & Core",
        items: ["ESP32-S3", "Arduino Framework", "PlatformIO"],
      },
      {
        category: "Connectivity",
        items: [
          "WiFi",
          "WebSocket (ArduinoWebsockets)",
          "mDNS",
          "NTP",
          "HTTP Client",
        ],
      },
      {
        category: "Storage & Data",
        items: ["NVS Preferences", "PROGMEM (Flash)", "ArduinoJson"],
      },
      {
        category: "Display & UI",
        items: ["U8g2 (SSD1306 OLED)", "XBM Graphics", "Custom Renderer"],
      },
      {
        category: "Hardware Integration",
        items: ["GPIO Button Input", "I2C (OLED)", "HTTP (WLED Control)"],
      },
    ],

    // ── Links & Resources ────────────────────────────────────
    demo: "https://github.com/yourusername/ashura-core-esp32",
    repo: "https://github.com/yourusername/ashura-core-esp32",

    // ── Media ─────────────────────────────────────────────────
    media: [
      {
        type: "image",
        src: "/projects/ashura/companion-eyes.png",
        alt: "Animated companion eyes with expression system",
      },
      {
        type: "image",
        src: "/projects/ashura/app-launcher.png",
        alt: "Flipper Zero-style icon menu interface",
      },
      {
        type: "image",
        src: "/projects/ashura/wled-control.png",
        alt: "WLED device control screens",
      },
      {
        type: "image",
        src: "/projects/ashura/system-stats.png",
        alt: "Live system statistics display",
      },
    ],

    architectureDescription:
      "Ashura follows a layered microcontroller OS architecture: (1) Boot Layer handles initialization sequence with prioritized service startup; (2) Core Services manage display, timing, WiFi, and WebSocket connections; (3) Application Layer contains feature modules (companion, animation, WLED); (4) UI Framework provides screen stacking and event routing; (5) Network Layer handles async WebSocket with state machine and exponential backoff; (6) Storage Layer abstracts NVS preferences. The EventBus pub/sub system decouples components, while the MessageRouter chains service handlers for incoming commands.",

    myRole: "Sole Developer / Architect",

    contributions: [
      "Architected layered OS kernel with boot sequence and update loop mirroring desktop OS patterns",
      "Designed event-driven pub/sub system (EventBus) for decoupled component communication",
      "Implemented state machine WebSocket client with exponential backoff and heartbeat mechanism",
      "Built modular UI framework with screen stacking, dirty flag optimization, and input routing",
      "Created MoodEngine companion system with 8 mood states, smooth lerp transitions, and autonomous behaviors",
      "Optimized PROGMEM animation storage via XBM format for zero-copy frame playback",
      "Developed WLED integration with mDNS device discovery and HTTP control API",
      "Implemented NVS-backed persistent preferences system for user configuration",
      "Built message routing system with service registry for async command handling",
      "Engineered button debounce logic with long-press detection for 4-button input",
    ],

    // ── Features Deep Dive ────────────────────────────────────
    featuresDeep: [
      {
        icon: "eye",
        title: "Animated Companion System",
        description:
          "Expressive eye-based companion with 8 mood states (idle, happy, bored, sleepy, focused, surprised, annoyed, excited), smooth easing between mood transitions, autonomous blinking, and micro-behaviors like random glances and wide-eye expressions.",
        media: {
          type: "image",
          src: "/projects/ashura/moods.png",
          alt: "Companion mood state visualization",
        },
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
          "Full-featured LED control system supporting power toggle, brightness/speed/intensity sliders, effect selection with live preview, color picking, and automatic device discovery via mDNS.",
        media: {
          type: "image",
          src: "/projects/ashura/wled-interface.png",
          alt: "WLED control interface",
        },
      },
      {
        icon: "wifi",
        title: "WebSocket Client",
        description:
          "Persistent WebSocket connection with automatic reconnection, exponential backoff (1s → 2s → 4s → 8s → 16s → 30s), device registration flow, heartbeat monitoring, and JSON message routing.",
      },
      {
        icon: "film",
        title: "Animation Vibe System",
        description:
          "PROGMEM-optimized XBM animation player supporting two modes: autonomous full-screen playback or composited frame rendering. Includes animation picker, preview with compositing, and persistent selected vibe storage.",
      },
      {
        icon: "clock",
        title: "Clock Application",
        description:
          "Dual-mode clock display with analog face (minute/hour hands) and digital time readout. Synchronized via NTP, updates in real-time, and integrated into home screen.",
      },
      {
        icon: "activity",
        title: "System Statistics Display",
        description:
          "Live scrollable readout of system metrics: uptime, free heap memory, WiFi signal strength, assigned IP address, MAC address, CPU frequency, flash size, chip information, and SDK version.",
      },
      {
        icon: "moon",
        title: "Screensaver System",
        description:
          "Auto-launching screensaver after configurable idle timeout. Plays selected vibe animation or boot animation. Dismissed by any button press, returns to home screen.",
      },
    ],

    // ── Technical Challenges & Solutions ─────────────────────
    challenges: [
      {
        title: "PROGMEM Optimization for Animation Storage",
        problem:
          "ESP32 has limited RAM (~520KB). Storing full animation frame buffers would exhaust heap within seconds. XBM frames need to be stored in flash and read on-demand.",
        solution:
          "Implemented PROGMEM storage for animation arrays and individual frame buffers. Used pgm_read_ptr() for frame reference, allowed U8g2 to read XBM data directly from flash during rendering. Zero RAM overhead per animation.",
      },
      {
        title: "WebSocket Reconnection Under Spotty WiFi",
        problem:
          "Mobile/unstable networks cause frequent disconnections. Naive reconnection attempts drain power and spam logs. Need graceful degradation.",
        solution:
          "Designed state machine with exponential backoff: idle → connecting (1s) → 2s → 4s → 8s → 16s → 30s → failed. Provides manual retry from UI. EventBus publishes state changes for UI feedback.",
      },
      {
        title: "Screen Stack Navigation with Limited RAM",
        problem:
          "Keeping screen objects alive while navigating (push/pop) consumes memory if each screen holds large state.",
        solution:
          "Lightweight screen interface with minimal state. Each screen stores only essential data (current selection, scroll offset). Lazy-initialize heavy resources (WLED device list) on screen enter.",
      },
      {
        title: "Button Debouncing in Real-Time Loop",
        problem:
          "Raw GPIO reads are noisy at ms timescales. Need debounce without blocking 60 FPS display updates.",
        solution:
          "Implemented state machine debouncer with configurable threshold (~50ms). Tracks last state change timestamp. Detects long press (500ms) separately for context menu actions.",
      },
      {
        title: "Companion Mood Persistence Across App Switches",
        problem:
          "Mood state should survive screen transitions and be responsive to system events (WiFi connect, notifications).",
        solution:
          "Decoupled MoodEngine via EventBus subscriptions. Mood automatically transitions based on published events (WifiConnected → happy, etc). Companion renderer drawn on all screens.",
      },
      {
        title: "JSON Message Routing to Appropriate Services",
        problem:
          "WebSocket receives varied message types (WLED commands, notifications, display messages). Router must dispatch correctly without tight coupling.",
        solution:
          "Implemented MessageRouter with chain-of-responsibility pattern. Each service (DeviceService, WledService) implements IService interface. Router iterates handlers and calls canHandle() → handle() flow.",
      },
    ],

    // ── Results & Metrics ────────────────────────────────────
    results: [
      {
        metric: "128×64",
        label: "OLED Resolution (Perfect for minimalist UI)",
        icon: "monitor",
      },
      {
        metric: "8",
        label: "Companion Mood States with smooth transitions",
        icon: "smile",
      },
      {
        metric: "500KB+",
        label: "Animation Data in PROGMEM without RAM impact",
        icon: "database",
      },
      {
        metric: "60 FPS",
        label: "Display refresh rate (stable across all screens)",
        icon: "zap",
      },
      {
        metric: "< 50ms",
        label: "Button debounce latency",
        icon: "hand-pointer",
      },
      {
        metric: "9",
        label: "Major app screens implemented",
        icon: "layers",
      },
      {
        metric: "~120KB",
        label: "Typical heap usage (headroom for expansion)",
        icon: "activity",
      },
      {
        metric: "30s",
        label: "Max WebSocket reconnection backoff",
        icon: "wifi",
      },
    ],

    resultsDescription:
      "Successfully built a production-ready embedded OS firmware that balances feature richness with resource constraints. Achieved stable 60 FPS display updates, responsive button input with < 50ms latency, and seamless mood transitions. The modular architecture enables straightforward feature addition without breaking existing systems. PROGMEM optimization allows 500KB+ animations without impacting runtime memory.",

    // ── Learnings & Future ────────────────────────────────────
    learnings:
      "Designing embedded systems requires ruthless prioritization: every decision on data structures and algorithms compounds in a 520KB memory budget. Event-driven architecture (EventBus) is invaluable for decoupling—the mood engine depends on nothing but events, making it reusable and testable. PROGMEM optimization is non-negotiable for rich embedded experiences. State machines (WebSocket, buttons) provide clarity in async systems with sporadic inputs.",

    futurePlans:
      "Add voice integration via connected microphone; implement Pomodoro timer with mood transitions; expand WLED integration with rhythm-reactive effects; add Spotify playback status sync (playing → excited mood); support OTA firmware updates; implement settings UI overlay for WiFi/server credentials (currently NVS-only); build companion gesture system (head nods, winks); create notification inbox with persistent toast overlay.",

    // ── Hardware Details ───────────────────────────────────────
    architectureDiagram: "/projects/ashura/architecture-diagram.png",

    // ── Relationships & References ────────────────────────────
    relatedProjects: [],
  },
  {
    id: 5,
    slug: "huddle",
    name: "Huddle",
    category: "Full Stack",
    status: "Completed",
    date: "2024-06-17",
    tagline: "One Space. All Voices.",
    duration: "3 months",
    teamSize: "Solo",

    description:
      "A full-stack real-time communication platform inspired by Discord. Supports servers, channels, direct messaging, video/audio calls, file sharing, and role-based access control — all in a single Next.js 14 monorepo.",

    problem:
      "Building a cohesive real-time chat platform requires solving WebSocket state in a server-rendered framework, paginated message history synchronized with live events, WebRTC media rooms, and fine-grained permissions — all at once.",

    solution:
      "Mounted Socket.IO on the underlying Node.js HTTP server via a Pages Router API route, sharing the instance across all message handlers. React Query manages cursor-paginated history while a custom hook surgically hydrates the cache from socket events. LiveKit handles WebRTC rooms with server-side JWT scoping.",

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

    media: [
      {
        type: "image",
        src: "/projects/huddle/server-channel.png",
        alt: "Server and channel view",
      },
      {
        type: "image",
        src: "/projects/huddle/real-time-messaging.png",
        alt: "Real-time messaging",
      },
      {
        type: "image",
        src: "/projects/huddle/member-management.png",
        alt: "Member management",
      },
      {
        type: "image",
        src: "/projects/huddle/direct-messaging.png",
        alt: "Direct messaging",
      },
      {
        type: "image",
        src: "/projects/huddle/livekit-video-call.png",
        alt: "LiveKit video call",
      },
      {
        type: "image",
        src: "/projects/huddle/mobile-responsive-layout.png",
        alt: "Mobile responsive layout",
      },
    ],

    architectureDescription:
      "Next.js 14 monorepo combining App Router for rendering with Pages Router for Socket.IO. The socket server mounts on the Node.js HTTP layer and is shared across all message handlers. Prisma models 7 entities with cascading deletes. React Query handles cursor-paginated history; a custom useChatSocket hook updates the cache live from socket events. LiveKit rooms are keyed by channel/conversation ID with server-side JWTs.",

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

    architectureDiagram: "/projects/huddle/architecture-diagram.png",

    relatedProjects: [],
  },
];

export default projects;
