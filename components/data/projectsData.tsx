const projects = [
  {
    id: 1,
    name: "Catalyst",
    type: "folder",
    description:
      "An integrated AI-driven productivity platform to empower developers with GitHub repository analytics, AI-powered commit summaries, and intelligent quizzes for interview preparation and concept reinforcement.",
    tech: ["Next.js", "LangChain", "GitHub API", "RAG", "Gemini"],
    demo: "https://catalyst-demo.example.com", // replace with actual link if available
    repo: "https://github.com/SomuSingh11", // update to specific repo
    status: "Completed",
    date: "2024-12-15",
    images: [
      "/projects/catalyst-1.jpg",
      "/projects/catalyst-2.jpg",
      "/projects/catalyst-3.jpg",
    ],
    features: [
      "GitWhiz: AI-powered commit summaries",
      "GitHub Repo Analytics",
      "Codebase Q&A and tutorial generation",
      "Quizzy: AI-generated quizzes for learning & interviews",
    ],
    category: "AI-Powered Developer Productivity Suite",
  },
  {
    id: 2,
    name: "Sync-City",
    type: "folder",
    description:
      "A centralized collaboration platform for government departments designed to prevent resource wastage and project conflicts through real-time coordination, AI-powered conflict detection, and geospatial awareness.",
    tech: ["Next.js", "Convex", "Dialogflow CX", "Google Vertex AI"],
    demo: "https://sync-city-demo.example.com", // replace with actual link if available
    repo: "https://github.com/SomuSingh11", // update to specific repo
    status: "Hackathon Finalist",
    date: "2024-11-20",
    images: [
      "/projects/synccity-1.jpg",
      "/projects/synccity-2.jpg",
      "/projects/synccity-3.jpg",
    ],
    features: [
      "AI-powered conflict detection",
      "Geospatial awareness for projects",
      "Custom SOPs for conflict resolution",
      "Real-time inter-department coordination",
    ],
    category: "GovTech | HackByte 3.0 Finalist",
  },
  {
    id: 3,
    name: "Huddle",
    type: "folder",
    description:
      "A production-ready real-time communication platform with servers, channels, and DMs. Supports role-based access, message editing, secure file uploads, and WebRTC-powered video/audio calls via LiveKit.",
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
    demo: "https://huddle-demo.example.com", // replace with actual link if available
    repo: "https://github.com/SomuSingh11", // update to specific repo
    status: "In Progress",
    date: "2025-01-10",
    images: [
      "/projects/huddle-1.jpg",
      "/projects/huddle-2.jpg",
      "/projects/huddle-3.jpg",
    ],
    features: [
      "Real-time messaging with Socket.IO",
      "Role-Based Access Control (Admin, Moderator, Guest)",
      "Message editing & deletion",
      "File upload support",
      "WebRTC video/audio calls with LiveKit",
      "Optimized state & data flow using Zustand + React Query",
    ],
    category: "Real-Time Communication Platform",
  },
];

export default projects;
