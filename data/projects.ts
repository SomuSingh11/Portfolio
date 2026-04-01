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
    duration: "6 weeks",
    teamSize: "Solo",
    tagline: "A production-grade Discord alternative, built from scratch.",
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
          "Next.js",
          "TailwindCSS",
          "shadcn/ui",
          "Zustand",
          "React Query",
        ],
      },
      { category: "Backend", items: ["Node.js", "Socket.IO", "Prisma"] },
      { category: "Database", items: ["PostgreSQL"] },
      { category: "Auth", items: ["Clerk"] },
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
        title: "Real-time Messaging",
        description:
          "Socket.IO powers sub-100ms message delivery with optimistic UI updates. Messages persist to PostgreSQL with full edit and delete history.",
      },
      {
        icon: "🛡️",
        title: "Role-Based Access Control",
        description:
          "Three-tier permission system — Admin, Moderator, Guest — enforced at both API and UI layers.",
      },
      {
        icon: "📹",
        title: "WebRTC Video & Audio Calls",
        description:
          "Integrated LiveKit for production-grade video and audio calls inside channels, handling signalling and TURN servers.",
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
    demo: "https://huddle-mb7x.onrender.com/",
    repo: "https://github.com/SomuSingh11/Huddle",
    relatedProjects: [1, 2],
  },
];

export default projects;
