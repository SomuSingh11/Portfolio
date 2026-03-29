/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, memo } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import TechStackBox from "@/components/Utilities/TechStack";
import {
  educationHistory,
  certifications,
  interests,
  games,
  animes,
  songs,
} from "@/data/about";
import { PERSONAL_INFO, SOCIAL_LINKS } from "@/config/constants";

// ─── Sub-components ───────────────────────────────────────────────────────────

const HeroCard = memo(function HeroCard() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden"
    >
      <div className="bg-gray-900 px-4 py-2 font-mono text-sm text-gray-400">
        /home/somu/info.json
      </div>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {!imageLoaded && (
            <Skeleton className="w-32 h-32 rounded-full border-4 border-gray-700 flex-shrink-0" />
          )}
          <img
            src={PERSONAL_INFO.avatarUrl}
            alt="Somu Singh"
            className={`w-32 h-32 rounded-full border-4 border-gray-700 flex-shrink-0 transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0 absolute"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold mb-1">{PERSONAL_INFO.name}</h1>
            <p className="text-blue-400 text-lg mb-4">
              Computer Engineering Student & AI Developer
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-sm">
              <span className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>{PERSONAL_INFO.location}</span>
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
  );
});

const SectionLabel = memo(function SectionLabel({
  command,
}: {
  command: string;
}) {
  return (
    <div className="font-mono text-green-400 mb-3 text-sm">
      <span className="text-blue-400">somu@desktop</span>
      <span className="text-gray-400">:~$</span>{" "}
      <span className="text-gray-300">{command}</span>
    </div>
  );
});

const EducationSection = memo(function EducationSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <SectionLabel command="cat /var/log/education.log" />
      <div className="space-y-4">
        {educationHistory.map((edu, i) => (
          <motion.div
            key={edu.level}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col md:flex-row items-center gap-4"
          >
            <img
              src={edu.image}
              alt={edu.institution}
              className="w-full md:w-48 h-28 object-cover rounded flex-shrink-0"
              loading="lazy"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <GraduationCap className="w-5 h-5 text-green-400 flex-shrink-0" />
                <h3 className="font-bold">{edu.level}</h3>
              </div>
              <p className="text-gray-400 text-sm flex items-center space-x-2">
                <BookOpen className="w-4 h-4 flex-shrink-0" />
                <span>{edu.institution}</span>
              </p>
              <p className="text-gray-400 text-sm flex items-center space-x-2 mt-1">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{edu.details}</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

const CertificationsSection = memo(function CertificationsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <SectionLabel command="cat /var/log/certifications.log" />
      <div className="space-y-4">
        {certifications.map((cert, i) => (
          <motion.div
            key={cert.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.08 }}
            className="bg-gray-800 border border-blue-700/40 rounded-lg p-4 flex flex-col md:flex-row items-center gap-4"
          >
            <img
              src={cert.image}
              alt={cert.name}
              className="w-full md:w-28 h-20 object-contain rounded flex-shrink-0"
              loading="lazy"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Award className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-300 hover:underline"
                >
                  {cert.name}
                </a>
              </div>
              <p className="text-gray-400 text-sm">
                {cert.issuer}{" "}
                <span className="text-blue-400 ml-1">{cert.year}</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

const InterestsSection = memo(function InterestsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <SectionLabel command="ls /home/somu/interests/" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {interests.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 + i * 0.05 }}
            className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden group"
          >
            <img
              src={item.image}
              alt={item.label}
              className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="p-3">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </h4>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

/** Horizontal scroll strip */
const MediaStrip = memo(function MediaStrip({
  items,
  imgClass = "h-36",
}: {
  items: Array<{ name: string; image: string }>;
  imgClass?: string;
}) {
  return (
    <div className="flex overflow-x-auto space-x-3 pb-3 scrollbar-none">
      {items.map((item) => (
        <div key={item.name} className="text-center flex-shrink-0 w-28">
          <img
            src={item.image}
            alt={item.name}
            className={`w-full ${imgClass} rounded-md object-cover border border-gray-700`}
            loading="lazy"
          />
          <span className="text-xs text-gray-400 mt-1 block leading-tight">
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
});

const MediaSection = memo(function MediaSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
    >
      <SectionLabel command="tail -f /var/log/media.log" />
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 space-y-6">
        {/* Games */}
        <div>
          <h3 className="font-bold flex items-center gap-2 mb-3 text-sm">
            <Gamepad2 className="w-4 h-4 text-purple-400" />
            Games Completed
          </h3>
          <MediaStrip items={games} imgClass="h-40" />
        </div>

        {/* Anime */}
        <div>
          <h3 className="font-bold flex items-center gap-2 mb-3 text-sm">
            <Film className="w-4 h-4 text-red-400" />
            Anime Logged
          </h3>
          <MediaStrip items={animes} imgClass="h-24" />
        </div>

        {/* Songs */}
        <div>
          <h3 className="font-bold flex items-center gap-2 mb-3 text-sm">
            <Music className="w-4 h-4 text-green-400" />
            Current Rotation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {songs.map((song) => (
              <a
                key={song.name}
                href={song.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 p-2.5 rounded-lg transition-colors"
              >
                <img
                  src={song.image}
                  alt={song.name}
                  className="w-10 h-10 rounded flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-white text-sm truncate">
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
  );
});

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function About() {
  return (
    <div className="h-full bg-gray-900 text-white overflow-y-auto p-4 md:p-6 font-sans">
      <div className="space-y-8 max-w-4xl mx-auto">
        <HeroCard />
        <EducationSection />
        <CertificationsSection />
        <InterestsSection />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SectionLabel command="ls /home/somu/techStack/" />
          <TechStackBox />
        </motion.div>

        <MediaSection />
      </div>
    </div>
  );
}
