"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Volume2, Moon, Bluetooth } from "lucide-react";
import { useCurrentTime } from "@/hooks/ui/useCurrentTime";
import { PERSONAL_INFO } from "@/config/constants";
import { useGitHubData } from "@/hooks/data/useGitHubData";

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

function QuickTile({
  icon: Icon,
  label,
  active = true,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      className={`flex flex-col items-center justify-center rounded-2xl p-3 aspect-square gap-1.5 ${
        active ? "bg-white/25 text-white" : "bg-white/8 text-white/40"
      }`}
    >
      <Icon size={20} />
      <span className="text-[10px] font-medium">{label}</span>
    </motion.button>
  );
}

export default function NotificationPanel({
  open,
  onClose,
}: NotificationPanelProps) {
  const time = useCurrentTime();
  const { repos, profile } = useGitHubData();

  const latestRepo = repos[0];

  const timeStr = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const dateStr = time.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/20 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="absolute inset-x-0 top-0 z-50 rounded-b-3xl overflow-hidden"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
          >
            {/* Frosted glass background */}
            <div className="bg-black/60 backdrop-blur-2xl px-5 pt-14 pb-6">
              {/* Time */}
              <div className="mb-5">
                <div className="text-white text-5xl font-extralight tracking-tight">
                  {timeStr}
                </div>
                <div className="text-white/60 text-sm mt-1">{dateStr}</div>
              </div>

              {/* Quick toggles */}
              <div className="grid grid-cols-4 gap-2.5 mb-5">
                <QuickTile icon={Wifi} label="Wi-Fi" active />
                <QuickTile icon={Bluetooth} label="Bluetooth" active={false} />
                <QuickTile icon={Moon} label="Focus" active={false} />
                <QuickTile icon={Volume2} label="Sound" active />
              </div>

              {/* Notifications */}
              <div className="space-y-2">
                <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-3">
                  Recent Activity
                </p>

                {/* GitHub notification */}
                {latestRepo && (
                  <div className="bg-white/10 rounded-2xl p-3.5 flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">⬛</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-xs font-semibold">GitHub</p>
                      <p className="text-white/70 text-xs mt-0.5 truncate">
                        Latest: {latestRepo.name}
                      </p>
                      <p className="text-white/40 text-[10px] mt-0.5">
                        Updated{" "}
                        {new Date(latestRepo.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Profile notification */}
                <div className="bg-white/10 rounded-2xl p-3.5 flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={PERSONAL_INFO.avatarUrl}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-semibold">OrbitOS</p>
                    <p className="text-white/70 text-xs mt-0.5">
                      Welcome to {PERSONAL_INFO.name}&apos;s portfolio
                    </p>
                    <p className="text-white/40 text-[10px] mt-0.5">
                      {profile
                        ? `${profile.public_repos} public repos · ${profile.followers} followers`
                        : "Loading..."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Close handle */}
              <div className="flex justify-center mt-5">
                <button
                  onClick={onClose}
                  className="w-10 h-1 bg-white/30 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
