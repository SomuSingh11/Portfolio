const projects = [
  {
    id: 1,
    name: "Catalyst",
    type: "folder",
    description:
      "An integrated AI-driven productivity platform to empower developers with GitHub repository analytics, AI-powered commit summaries, and intelligent quizzes for interview preparation and concept reinforcement.",
    tech: ["Next.js", "LangChain", "GitHub API", "RAG", "Gemini", "trpc"],
    demo: "https://catalyst-t1ft.onrender.com/",
    repo: "https://github.com/SomuSingh11/Catalyst",
    status: "In Progress",
    date: "2025-01-28",
    images: [
      "/projectPhotos/Catalyst/1.png",
      "/projectPhotos/Catalyst/2.png",
      "/projectPhotos/Catalyst/3.png",
      "/projectPhotos/Catalyst/4.png",
      "/projectPhotos/Catalyst/5.png",
      "/projectPhotos/Catalyst/6.png",
      "/projectPhotos/Catalyst/7.png",
      "/projectPhotos/Catalyst/8.png",
      "/projectPhotos/Catalyst/9.png",
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
    demo: "https://devfolio.co/projects/synccity-a778", // replace with actual link if available
    repo: "https://github.com/SomuSingh11/syncV1", // update to specific repo
    status: "Hackathon Finalist",
    date: "2025-04-11",
    images: [
      "/projectPhotos/Synccity/1.jpeg",
      "/projectPhotos/Synccity/2.jpeg",
      "/projectPhotos/Synccity/3.jpeg",
      "/projectPhotos/Synccity/4.jpeg",
      "/projectPhotos/Synccity/5.jpeg",
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
    demo: "https://huddle-mb7x.onrender.com/", // replace with actual link if available
    repo: "https://github.com/SomuSingh11/Huddle", // update to specific repo
    status: "Completed",
    date: "2025-01-10",
    images: [
      "/projectPhotos/Huddle/1.jpg",
      "/projectPhotos/Huddle/2.jpg",
      "/projectPhotos/Huddle/3.jpg",
      "/projectPhotos/Huddle/4.jpg",
      "/projectPhotos/Huddle/5.jpg",
      "/projectPhotos/Huddle/6.jpg",
      "/projectPhotos/Huddle/7.jpg",
      "/projectPhotos/Huddle/8.jpg",
      "/projectPhotos/Huddle/9.jpg",
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
