/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Award,
  GraduationCap,
  BookOpen,
  Calendar,
  Gamepad2,
  Film,
  Music,
} from "lucide-react";

export default function About() {
  const educationHistory = [
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

  const interests = [
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
        "https://placehold.co/400x300/1E293B/E2E8F0?text=WebSockets+&+WebRTC",
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

  const media = {
    games: [
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
        name: "Assassin's Creed Unity",
        image:
          "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGc2ODV3MXRlN29md2FyNHUwMW9mcXl3M3ltZ2c3azJrYmFldmxnMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MsXiYRKmJVwSA/giphy.gif",
      },
      {
        name: "AC Black Flag",
        image:
          "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjh0b3hrOTFheG1za3RkazI4M2ppeXJ4c3plc3ZmYnljZzZlaWozZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1Ctu1BCYf21we9tRmT/giphy.gif",
      },
      {
        name: "Batman: Arkham City",
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
        name: "Tomb Raider 2",
        image:
          "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3M3dnptY3BtNTQyOTJ3NGZ4NnAweDhtb3IyaGYzNGViOGxuaTB5NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mnvTVgxyzQsYwJXZHt/giphy.gif",
      },
      {
        name: "Prototype 2",
        image: "https://placehold.co/150x200/1E293B/E2E8F0?text=Prototype",
      },
    ],
    animes: [
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
        name: "Fullmetal Alchemist: Brotherhood",
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
        name: "Tokyo Ghoul",
        image:
          "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXlobWdleDA2ZTF4Zmt3bTBmYjB6MjU4dGQ0bWxyb3N2M202dnNuNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jlVObChD6Fb5C/giphy.gif",
      },
      {
        name: "Re:Zero",
        image:
          "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHhyNTJmczZvZzZraDZnYnhnM2xoeXoyaWJqbGk2YzA3bGM5dm90NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/y6aDJi4UcT2ow/giphy.gif",
      },
      {
        name: "Erased",
        image:
          "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3V3bnBqZTVyNGw1bmpub2NjM2Rlb2F1bHRkc2NmcHhtYWZlNHozbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/12qu77NvyAsMVi/giphy.gif",
      },
      {
        name: "Haikyuu!!",
        image:
          "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWl4OWY0bmJ1ZDdhb2lzcXpjc2JvZ2xiaDV0dTNyMWJzMGl2ZnN3OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ufmlo7OC4AOMU/giphy.gif",
      },
      {
        name: "Kuroko's Basketball",
        image:
          "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWgydzVlZDU2c2o2MW5nc21kaTQ2ZTBibG1rM3FxcDNmNjRiMW12dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/N3ZsneYZgKsYo/giphy.gif",
      },
      {
        name: "One Punch Man",
        image:
          "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWwwMHNnZXlhY2ZjNGRsMm5id284dzJveHV2dHUwc2x1MWdjaTY0aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xULW8EM7Br1usb0s9O/giphy.gif",
      },
      {
        name: "Mob Psycho 100",
        image:
          "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWFoOXFhNWZndmltbTFzOG80bnR3MmZ6MnpobWV6aHoxMWEwZDJ3dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/N6Rw5Gpc3EluM8v9jh/giphy.gif",
      },
      {
        name: "Great Teacher Onizuka",
        image:
          "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3J3bjA1bDA5czI4MzFydDhqdzl0Y3d3c2Zmdjc2MWk5bWVibmI5ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TlqRQ1nowmHIs/giphy.gif",
      },
    ],
    songs: [
      {
        name: "Lunch Break",
        artist: "Seedhe Maut",
        url: "https://open.spotify.com/track/7MXVkk9YMctZqd1Srtv4MB",
        image: "https://placehold.co/100x100/1DB954/FFFFFF?text=Lunch+Break",
      },
      {
        name: "Circles",
        artist: "Post Malone",
        url: "https://open.spotify.com/album/16PSZwABl4VFJvfDFOPOoB",
        image: "https://placehold.co/100x100/1DB954/FFFFFF?text=Circles",
      },
      {
        name: "Blinding Lights",
        artist: "The Weeknd",
        url: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
        image:
          "https://placehold.co/100x100/1DB954/FFFFFF?text=Blinding+Lights",
      },
      {
        name: "Heat Waves",
        artist: "Glass Animals",
        url: "https://open.spotify.com/track/6CDzDgIUqeDY5g8ujExx2f",
        image: "https://placehold.co/100x100/1DB954/FFFFFF?text=Heat+Waves",
      },
    ],
  };

  return (
    <div className="h-full bg-gray-900 text-white overflow-y-auto p-4 md:p-6 font-sans">
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Intro Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden"
        >
          <div className="bg-gray-900 px-4 py-2 font-mono text-sm text-gray-400">
            /home/somu/info.json
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <img
                src="https://avatars.githubusercontent.com/u/170082343?v=4"
                alt="Profile Picture"
                className="w-32 h-32 rounded-full border-4 border-gray-700 shrink-0"
              />
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold mb-1">Somu Singh</h1>
                <p className="text-blue-400 text-lg mb-4">
                  Computer Engineering Student & AI Developer
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
                  <span className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>Indore, MP</span>
                  </span>
                  <span className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span>HackByte 3.0 Finalist</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="font-mono text-green-400 mb-2">
            <span className="text-blue-400">somu@desktop</span>:
            <span className="text-gray-400">~</span>$ cat /var/log/education.log
          </div>
          <div className="space-y-6">
            {educationHistory.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col md:flex-row items-center gap-4"
              >
                <img
                  src={edu.image}
                  alt={edu.institution}
                  className="w-full md:w-48 h-32 object-cover rounded shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <GraduationCap className="w-5 h-5 text-green-400" />
                    <h3 className="font-bold text-lg">{edu.level}</h3>
                  </div>
                  <p className="text-gray-400 text-sm flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{edu.institution}</span>
                  </p>
                  <p className="text-gray-400 text-sm flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{edu.details}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Hobbies and Interests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="font-mono text-green-400 mb-2">
            <span className="text-blue-400">somu@desktop</span>:
            <span className="text-gray-400">~</span>$ ls -a /home/somu/interests
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {interests.map((interest, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden group"
              >
                <img
                  src={interest.image}
                  alt={interest.label}
                  className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-3">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <span>{interest.icon}</span>
                    {interest.label}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Media Log Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="font-mono text-green-400 mb-2">
            <span className="text-blue-400">somu@desktop</span>:
            <span className="text-gray-400">~</span>$ tail -f /var/log/media.log
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
            {/* Games */}
            <div>
              <h3 className="font-bold flex items-center gap-2 mb-3">
                <Gamepad2 className="w-5 h-5 text-purple-400" />
                Games Completed
              </h3>
              <div className="flex overflow-x-auto space-x-4 pb-4">
                {media.games.map((game) => (
                  <div
                    key={game.name}
                    className="text-center w-32 flex-shrink-0"
                  >
                    <img
                      src={game.image}
                      alt={game.name}
                      className="w-full h-40 rounded-md object-cover mb-2 border-2 border-gray-700"
                    />
                    <span className="text-xs text-gray-400">{game.name}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Anime */}
            <div>
              <h3 className="font-bold flex items-center gap-2 mb-3">
                <Film className="w-5 h-5 text-red-400" />
                Anime Logged
              </h3>
              <div className="flex overflow-x-auto space-x-4 pb-4">
                {media.animes.map((anime) => (
                  <div
                    key={anime.name}
                    className="text-center w-40 flex-shrink-0"
                  >
                    <img
                      src={anime.image}
                      alt={anime.name}
                      className="w-full h-24 rounded-md object-cover mb-2 border-2 border-gray-700"
                    />
                    <span className="text-xs text-gray-400">{anime.name}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Spotify */}
            <div>
              <h3 className="font-bold flex items-center gap-2 mb-3">
                <Music className="w-5 h-5 text-green-400" />
                Current Rotation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {media.songs.map((song) => (
                  <a
                    key={song.name}
                    href={song.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors"
                  >
                    <img
                      src={song.image}
                      alt={song.name}
                      className="w-12 h-12 rounded-md shrink-0"
                    />
                    <div>
                      <p className="font-bold text-white text-sm">
                        {song.name}
                      </p>
                      <p className="text-xs text-gray-400">{song.artist}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
