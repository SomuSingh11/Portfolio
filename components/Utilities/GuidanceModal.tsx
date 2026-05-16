"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Import Lucide React icons
import {
  MousePointer2,
  GripVertical,
  Menu,
  FolderOpen,
  User,
  Lightbulb,
  FileText,
  Terminal,
  Mail,
  Github,
} from "lucide-react";

interface GuidanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GuidanceModal({
  open,
  onOpenChange,
}: GuidanceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-600 text-white min-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Welcome to OrbitOS!
          </DialogTitle>{" "}
          <DialogDescription className="text-gray-300 pt-2 text-base">
            {" "}
            This portfolio is an interactive desktop environment. Here’s a quick
            guide on how to find everything.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 text-gray-200 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {" "}
          <div>
            <h3 className="font-semibold text-white text-lg mb-3 flex items-center">
              {" "}
              <Menu className="mr-2 h-5 w-5 text-blue-400" /> Navigation Basics
            </h3>
            <ul className="space-y-3 text-base">
              {" "}
              <li className="flex items-center">
                <MousePointer2 className="mr-3 h-4 w-4 text-blue-300 flex-shrink-0" />
                <strong>Open Apps:</strong> &nbsp;Double-click any icon.
              </li>
              <li className="flex items-center">
                <GripVertical className="mr-3 h-4 w-4 text-blue-300 flex-shrink-0" />
                <strong>Move Windows:</strong> &nbsp;Click and drag the top bar.
              </li>
              <li className="flex items-center">
                <MousePointer2 className="mr-3 h-4 w-4 text-blue-300 flex-shrink-0 transform rotate-45" />{" "}
                <strong>Get Options:</strong> &nbsp;Right-click the desktop.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg mb-3 flex items-center">
              {" "}
              <FolderOpen className="mr-2 h-5 w-5 text-blue-400" /> Applications
              Guide
            </h3>
            <ul className="space-y-3 text-base">
              {" "}
              <li className="flex items-center">
                <FolderOpen className="mr-3 h-4 w-4 text-blue-300 flex-shrink-0" />
                <strong>Projects:</strong> &nbsp;Explore my portfolio of work.
              </li>
              <li className="flex items-center">
                <User className="mr-3 h-4 w-4 text-blue-300 flex-shrink-0" />
                <strong>About Me:</strong> &nbsp;Learn about my background.
              </li>
              <li className="flex items-center">
                <Lightbulb className="mr-3 h-4 w-4 text-blue-300 flex-shrink-0" />
                <strong>Skills:</strong> &nbsp;Discover my technical expertise.
              </li>
              <li className="flex items-center">
                <FileText className="mr-3 h-4 w-4 text-blue-300 flex-shrink-0" />
                <strong>Resume:</strong> &nbsp;View or download my formal CV.
              </li>
              <li className="flex items-center">
                <Terminal className="mr-3 h-4 w-4 text-blue-300 flex-shrink-0" />
                <strong>Terminal:</strong> &nbsp;Access command-line tools.
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 h-4 w-4 text-blue-300 flex-shrink-0" />
                <strong>Contact:</strong> &nbsp;Get in touch with me directly.
              </li>
              <li className="flex items-center">
                <Github className="mr-3 h-4 w-4 text-blue-300 flex-shrink-0" />
                <strong>GitHub:</strong> &nbsp;See my code repositories.
              </li>
            </ul>
          </div>
        </div>
        <DialogFooter className="pt-4">
          {" "}
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2 text-base"
          >
            Start Exploring
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
