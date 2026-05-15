// @/data/about.ts
// Replace placeholder URLs with your actual image URLs

export const BIO = {
  name: "Somu Singh",
  tagline: "Plot twist: I graduated. Now the real arc begins.",
  location: "India",
  status: "Open to opportunities",
  avatar: "/images/avatar.jpg", // replace with your actual avatar
  socials: [
    { label: "GitHub", url: "https://github.com/yourusername", icon: "github" },
    {
      label: "LinkedIn",
      url: "https://linkedin.com/in/yourusername",
      icon: "linkedin",
    },
    { label: "Email", url: "mailto:you@email.com", icon: "mail" },
  ],
  badges: [
    { label: "HackByte 3.0 Finalist", color: "yellow" },
    { label: "CE Graduate", color: "cyan" },
  ],
};

export const EDUCATION = [
  {
    id: "be",
    degree: "B.E. Computer Engineering",
    institution: "Your College Name",
    year: "2021 – 2025",
    grade: "X.XX CGPA",
  },
  {
    id: "hsc",
    degree: "Higher Secondary (XII)",
    institution: "Your School Name",
    year: "2021",
    grade: "XX%",
  },
  {
    id: "ssc",
    degree: "Secondary (X)",
    institution: "Your School Name",
    year: "2019",
    grade: "XX%",
  },
];

export const STACK = [
  {
    category: "Languages",
    items: ["Python", "TypeScript", "C/C++", "JavaScript", "Rust"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    category: "Backend",
    items: ["Node.js", "FastAPI", "PostgreSQL", "Redis"],
  },
  {
    category: "AI / ML",
    items: ["PyTorch", "LangChain", "OpenAI API", "Anthropic API", "Ollama"],
  },
  {
    category: "Embedded",
    items: ["ESP32", "ESP-IDF", "PlatformIO", "FreeRTOS", "U8g2"],
  },
  {
    category: "Tools",
    items: ["Git", "Docker", "Linux", "VS Code", "Figma"],
  },
];

export const INTERESTS = {
  games: [
    { name: "Hollow Knight", image: "/images/games/hollow-knight.jpg" },
    { name: "Sekiro", image: "/images/games/sekiro.jpg" },
    { name: "Elden Ring", image: "/images/games/elden-ring.jpg" },
    { name: "Celeste", image: "/images/games/celeste.jpg" },
    { name: "Hades", image: "/images/games/hades.jpg" },
  ],
  anime: [
    { name: "Vinland Saga", image: "/images/anime/vinland-saga.jpg" },
    { name: "Frieren", image: "/images/anime/frieren.jpg" },
    { name: "Attack on Titan", image: "/images/anime/aot.jpg" },
    { name: "Steins;Gate", image: "/images/anime/steins-gate.jpg" },
    { name: "Mushishi", image: "/images/anime/mushishi.jpg" },
  ],
  music: [
    {
      name: "Bury the Light",
      artist: "Casey Edwards",
      url: "#",
      image: "/images/music/bury-the-light.jpg",
    },
    {
      name: "My War",
      artist: "Shingeki no Kyojin OST",
      url: "#",
      image: "/images/music/my-war.jpg",
    },
    {
      name: "Inferno",
      artist: "Mrs. GREEN APPLE",
      url: "#",
      image: "/images/music/inferno.jpg",
    },
    {
      name: "Racing into the Night",
      artist: "YOASOBI",
      url: "#",
      image: "/images/music/racing.jpg",
    },
  ],
};

export const NOW = {
  building: "ashura-core-s3-idf — ESP32-S3 embedded firmware",
  watching: "Frieren: Beyond Journey's End",
  listening: "YOASOBI — Into The Night",
  reading: "The Pragmatic Programmer",
};
