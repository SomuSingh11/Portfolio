/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { Card, CardHeader } from "@/components/ui/card";

// Icon imports
import JavaScriptIcon from "@/public/icons/squarejs.svg";
import HTMLIcon from "@/public/icons/html5.svg";
import CSSIcon from "@/public/icons/css3.svg";
import ReactIcon from "@/public/icons/react.svg";
import GithubIcon from "@/public/icons/github.svg";
import JavaIcon from "@/public/icons/java.svg";
import LinuxIcon from "@/public/icons/linux.svg";
import TailwindIcon from "@/public/icons/tailwind.svg";
import TypeScriptIcon from "@/public/icons/typescript.svg";
import NodeIcon from "@/public/icons/node.svg";
import MongoIcon from "@/public/icons/mongodb.svg";
import ExpressIcon from "@/public/icons/express.svg";
import CIcon from "@/public/icons/c.svg";
import BootstrapIcon from "@/public/icons/bootstrap.svg";
import PostmanIcon from "@/public/icons/postman.svg";
import PrismaIcon from "@/public/icons/prisma.svg";
import SqlIcon from "@/public/icons/sql.svg";
import NextIcon from "@/public/icons/next.svg";

// The tech stack data array with corrected positioning and colors
const techStack = [
  {
    title: "JavaScript",
    icon: JavaScriptIcon,
    left: "2%",
    top: "5%",
    bgColor: "bg-yellow-500",
  },
  {
    title: "React.js",
    icon: ReactIcon,
    left: "25%",
    top: "35%",
    bgColor: "bg-blue-500",
  },
  {
    title: "Next.js",
    icon: NextIcon,
    left: "75%",
    top: "8%",
    bgColor: "bg-white",
  },
  {
    title: "Node.js",
    icon: NodeIcon,
    left: "75%",
    top: "65%",
    bgColor: "bg-green-600",
  },
  {
    title: "TypeScript",
    icon: TypeScriptIcon,
    left: "5%",
    top: "68%",
    bgColor: "bg-blue-600",
  },
  {
    title: "Tailwind CSS",
    icon: TailwindIcon,
    left: "50%",
    top: "75%",
    bgColor: "bg-teal-500",
  },
  {
    title: "HTML5",
    icon: HTMLIcon,
    left: "53%",
    top: "5%",
    bgColor: "bg-orange-500",
  },
  {
    title: "MongoDB",
    icon: MongoIcon,
    left: "2%",
    top: "48%",
    bgColor: "bg-green-500",
  },
  {
    title: "Prisma",
    icon: PrismaIcon,
    left: "28%",
    top: "2%",
    bgColor: "bg-slate-200",
  },
  {
    title: "SQL",
    icon: SqlIcon,
    left: "50%",
    top: "48%",
    bgColor: "bg-indigo-500",
  },
  {
    title: "Java",
    icon: JavaIcon,
    left: "83%",
    top: "39%",
    bgColor: "bg-red-500",
  },
  {
    title: "GitHub",
    icon: GithubIcon,
    left: "45%",
    top: "25%",
    bgColor: "bg-white",
  },
  {
    title: "CSS3",
    icon: CSSIcon,
    left: "35%",
    top: "62%",
    bgColor: "bg-blue-500",
  },
  {
    title: "Express.js",
    icon: ExpressIcon,
    left: "30%",
    top: "88%",
    bgColor: "bg-gray-600",
  },
  {
    title: "C++",
    icon: CIcon,
    left: "10%",
    top: "90%",
    bgColor: "bg-blue-700",
  },
  {
    title: "Bootstrap",
    icon: BootstrapIcon,
    left: "70%",
    top: "90%",
    bgColor: "bg-purple-600",
  },
  {
    title: "Postman",
    icon: PostmanIcon,
    left: "63%",
    top: "35%",
    bgColor: "bg-orange-600",
  },
  {
    title: "Linux",
    icon: LinuxIcon,
    left: "8%",
    top: "25%",
    bgColor: "bg-yellow-400",
  },
];

export default function TechStackBox() {
  const constraintRef = useRef(null);

  return (
    <Card className="bg-gray-800 border border-gray-700">
      <CardHeader>
        <p className="text-gray-100">
          A collection of the tools and languages I&apos;m proficient with.
        </p>
      </CardHeader>
      <div className="h-[240px] relative" ref={constraintRef}>
        {techStack.map((tech) => (
          <motion.div
            key={tech.title}
            className="inline-flex gap-2.5 px-4 items-center bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-full py-1.5 absolute cursor-grab"
            style={{
              left: tech.left,
              top: tech.top,
            }}
            drag
            dragConstraints={constraintRef}
            whileHover={{ scale: 1.1 }}
            whileDrag={{ scale: 1.15, cursor: "grabbing" }}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${tech.bgColor}`}
            >
              <img
                src={tech.icon.src}
                alt={`${tech.title} logo`}
                className="w-5 h-5"
              />
            </div>
            <span className="font-medium text-gray-300">{tech.title}</span>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
