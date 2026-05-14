// ─── Education ────────────────────────────────────────────────────────────────
export interface Education {
  level: string;
  institution: string;
  details: string;
  image: string;
}

export const educationHistory: Education[] = [
  {
    level: "B.E. Computer Engineering",
    institution: "Institute of Engineering & Technology, DAVV",
    details: "GPA: 9.04 | 2022 - Present",
    image: "/about/ietDavv.jpg",
  },
  {
    level: "Higher Secondary (Class XII)",
    institution: "Mount Litera Zee School",
    details: "CBSE | 95% | 2020 - 2021",
    image: "/about/mlzs.jpg",
  },
  {
    level: "Secondary (Class X)",
    institution: "Mount Litera Zee School",
    details: "CBSE | 90% | 2018 - 2019",
    image: "/about/mlzs.jpg",
  },
];

// ─── Certifications ───────────────────────────────────────────────────────────
export interface Certification {
  name: string;
  issuer: string;
  year: string;
  image: string;
  url: string;
}

export const certifications: Certification[] = [
  {
    name: "Postman API Fundamentals Student Expert",
    issuer: "Postman",
    year: "2024",
    image: "/about/media/postmanBadge.png",
    url: "https://badgr.com/public/assertions/sZLW6V5oT5yAgMJfU5RDSw?identity__email=somusingh0110@gmail.com",
  },
  {
    name: "Networking Basics Badge",
    issuer: "Cisco",
    year: "2024",
    image: "/about/media/NetworkingBadge.png",
    url: "https://www.credly.com/badges/0e59880f-0776-4a7d-b3e4-fedb415862dc/public_url",
  },
];

// ─── Interests ────────────────────────────────────────────────────────────────
export interface Interest {
  icon: string;
  label: string;
  image: string;
}

export const interests: Interest[] = [
  {
    icon: "🤖",
    label: "Building AI Tools",
    image: "https://placehold.co/400x300/1E293B/E2E8F0?text=AI+Development",
  },
  {
    icon: "🏆",
    label: "Hackathons",
    image: "https://placehold.co/400x300/1E293B/E2E8F0?text=Hackathon+Winner",
  },
  {
    icon: "🌐",
    label: "Real-time Apps",
    image:
      "https://placehold.co/400x300/1E293B/E2E8F0?text=WebSockets+%26+WebRTC",
  },
  {
    icon: "💡",
    label: "System Design",
    image:
      "https://placehold.co/400x300/1E293B/E2E8F0?text=System+Architecture",
  },
  {
    icon: "📖",
    label: "Open Source",
    image: "https://placehold.co/400x300/1E293B/E2E8F0?text=Open+Source+Code",
  },
  {
    icon: "🎮",
    label: "Gaming",
    image: "https://placehold.co/400x300/1E293B/E2E8F0?text=Strategy+Gaming",
  },
];

// ─── Media ────────────────────────────────────────────────────────────────────
export interface MediaItem {
  name: string;
  image: string;
}

export interface Song {
  name: string;
  artist: string;
  url: string;
  image: string;
}

export const games: MediaItem[] = [
  {
    name: "Sekiro",
    image:
      "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHB0d3F2aHdhZ2U4c3pmZ3dodjlhcjllcnVmZzkxZTc1djRpYTc0dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PR88Zx9O7Zu4eJeRxf/giphy.gif",
  },
  {
    name: "Arkham Asylum",
    image:
      "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjdxZ2ZwenY0YW56YnlveXVvN3BpODF0aXR4YWVianNjMmdkN3ByaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ShCMwjMF5B3La/giphy.gif",
  },
  {
    name: "RDR 2",
    image:
      "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExczlpcnYyY3I1eDViNDBpMTFoejUzeXpjMjIwOWYwcHg4NDUzYTl4NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lpn1hW4FhnVHW78c7t/giphy.gif",
  },
  {
    name: "Arkham Knight",
    image:
      "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNm9heGV6bW9hbGhrbmV1OG9tZWw0eDVzeHhybTBrZGttcnA3bWI3MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NL7pwToW0Plx6/giphy.gif",
  },
  {
    name: "CS:GO",
    image:
      "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3NjbzV6bWhibmN2eDZwZnFwOWI2YWc1MWdjNzNwbno1Nm9yOGxteCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/6u36gATCpUFY16iUrr/giphy.gif",
  },
  {
    name: "Valorant",
    image:
      "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHZtaXFudTZxazd6d3F6MHlsOTNyZW0wemRzZWcyMmt2NGdhZnNqayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LNUEosTYfZ1fVJycur/giphy.gif",
  },
  {
    name: "AC Unity",
    image:
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGc2ODV3MXRlN29md2FyNHUwMW9mcXl3M3ltZ2c3azJrYmFldmxnMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MsXiYRKmJVwSA/giphy.gif",
  },
  {
    name: "AC Black Flag",
    image:
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjh0b3hrOTFheG1za3RkazI4M2ppeXJ4c3plc3ZmYnljZzZlaWozZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1Ctu1BCYf21we9tRmT/giphy.gif",
  },
  {
    name: "Arkham City",
    image:
      "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmV1eml3ZDFieTJ4aWNrYTJ2MmxqbDdnNW1zeTIzNzU1emw4eDRxdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MQHfI7JjYh75m/giphy.gif",
  },
  {
    name: "GTA V",
    image:
      "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWg2dHIyOTVzb3I1bjdrNDkwZzZ4dDUyczlvNzdqYmNtemRsM25mOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fnrWxccF43Wta/giphy.gif",
  },
  {
    name: "Watch Dogs",
    image:
      "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnJkaWlhMzFvMDNoZWUyNDZ2M3hibjk0YnZ2a3R4ajFscWdieHZyciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/D0LcnPgg68wg/giphy.gif",
  },
  {
    name: "Watch Dogs 2",
    image:
      "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGFwcncxanp5dDNnOWQ2dDY0azI2MGNpcjM2MXYwOHFuMTR5dG51aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3q2BAs9N0IItUKA0/giphy.gif",
  },
  {
    name: "Tomb Raider",
    image:
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZndzenJzdXB6OWJ0MGhnYmQ4YmJmaDc4MjJzb3JyODk1aWc3dTk2ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sZbnmZsxHWAOk/giphy.gif",
  },
  {
    name: "Rise of TR",
    image:
      "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3M3dnptY3BtNTQyOTJ3NGZ4NnAweDhtb3IyaGYzNGViOGxuaTB5NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mnvTVgxyzQsYwJXZHt/giphy.gif",
  },
];

export const animes: MediaItem[] = [
  {
    name: "Attack on Titan",
    image:
      "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcncyajlhcXNmeWdvNG9namsybmRqeng3a3hxbWx4bG04dHJnNnc1OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohzdX0xTqz5TLZZK0/giphy.gif",
  },
  {
    name: "Jujutsu Kaisen",
    image:
      "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExem5oeHd3cDloZTgybW1iYmd1YW51d2xseWE4c2o0czcxNHE2NHFudSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UgV8Y7bDxsZDCP01eo/giphy.gif",
  },
  {
    name: "Solo Leveling",
    image:
      "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmpob2Fvem1hNWs2d3hpYm96cDluNjA0dTR2cmI5dHQ2a25hbzJuZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pVWuLuV1JESZJdebkI/giphy.gif",
  },
  {
    name: "Naruto",
    image:
      "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDZuODd5M2wwbTBqZ213Z3o3MHhpd2ZycGFtdGoxZmltMXl3bjl3YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3s0ddui7kadGg/giphy.gif",
  },
  {
    name: "One Piece",
    image:
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2FyNHVhd3Fjb2dlenN3cGxxcWk5czlobTlzMG03MjkyNnA5dmNtcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UTek0q3N8osh8agH4Y/giphy.gif",
  },
  {
    name: "Demon Slayer",
    image:
      "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDQxdzJydTVxdW5ybTF3eHQyM2piamFoOHh4eGp6eHJuNmxxMnlnNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tEcIyVc6ukQV2eb86t/giphy.gif",
  },
  {
    name: "My Hero Academia",
    image:
      "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjJ1Z3gzdmNsbm96bjZyZmNxbnh5Y2s0MHUycThmaHZhYzBiZTZjOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g5SW7jjVccIMM/giphy.gif",
  },
  {
    name: "Black Clover",
    image:
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdm14OWNucWpsdXFhcDZpOHRsM24yc2hhM3RpNjhndHBybXNmaGlpeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oFzm2q0Xk1Zg5k4mI/giphy.gif",
  },
  {
    name: "Chainsaw Man",
    image:
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjA3M2VpZmYzdnN1dzljMTZmaG44emVvaG4zMXB1eWdsa2dlenA4eSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/17bk69vyJWl8hw3tzJ/giphy.gif",
  },
  {
    name: "Your Name",
    image:
      "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWFlcHVtdjMzcjN6YnVlbXZ4bXFwNjM1bTRkZndub3U5bTBkNzV3biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohjV6G9UwkB190zbq/giphy.gif",
  },
  {
    name: "A Silent Voice",
    image:
      "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ29uYThjZGZ6MGkyMThxcXQzOHZkbXJsM2tmMGhjaXo4ZXJ4M2lzMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT1R9OjKLmy4RAgqac/giphy.gif",
  },
  {
    name: "FMA: Brotherhood",
    image:
      "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTk4bm55N2doNjRpM3owYW82ODZxNzE1YWlxMjlpa20wbW15bmJ0MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/10AxYSiWYJueVq/giphy.gif",
  },
  {
    name: "Death Note",
    image:
      "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmNwODU4dDhreXBkc2thZGZ0cGg4bnN5Yms1NjAzYW9scnJ4Z3Y2YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/o2KLYPem407CM/giphy.gif",
  },
  {
    name: "Steins;Gate",
    image:
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWYweHAxM3hjcjBweGZ2cG0wZHlnZnNoZnp3ZWJsY2loMjIxd2Z0cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5SCTTJqdzZQI8xRFcQ/giphy.gif",
  },
  {
    name: "One Punch Man",
    image:
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWwwMHNnZXlhY2ZjNGRsMm5id284dzJveHV2dHUwc2x1MWdjaTY0aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xULW8EM7Br1usb0s9O/giphy.gif",
  },
  {
    name: "Haikyuu!!",
    image:
      "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWl4OWY0bmJ1ZDdhb2lzcXpjc2JvZ2xiaDV0dTNyMWJzMGl2ZnN3OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ufmlo7OC4AOMU/giphy.gif",
  },
];

export const songs: Song[] = [
  {
    name: "Lunch Break",
    artist: "Seedhe Maut",
    url: "https://open.spotify.com/track/7MXVkk9YMctZqd1Srtv4MB",
    image: "https://placehold.co/100x100/1DB954/FFFFFF?text=🎵",
  },
  {
    name: "Circles",
    artist: "Post Malone",
    url: "https://open.spotify.com/album/16PSZwABl4VFJvfDFOPOoB",
    image: "https://placehold.co/100x100/1DB954/FFFFFF?text=🎵",
  },
  {
    name: "Blinding Lights",
    artist: "The Weeknd",
    url: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
    image: "https://placehold.co/100x100/1DB954/FFFFFF?text=🎵",
  },
  {
    name: "Heat Waves",
    artist: "Glass Animals",
    url: "https://open.spotify.com/track/6CDzDgIUqeDY5g8ujExx2f",
    image: "https://placehold.co/100x100/1DB954/FFFFFF?text=🎵",
  },
];
