"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function DashboardHeader() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const userEmail = session?.user?.email || "Admin User";
  const userName = session?.user?.name || userEmail.split("@")[0];

  return (
    <div className="flex items-center justify-end">
      {/* Merged Single Container for User Profile & Logout */}
      <div className="flex items-center gap-3 pl-3.5 pr-2 py-2 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm backdrop-blur-sm">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-inner">
          <User className="w-4 h-4" />
        </div>
        
        <div className="text-left pr-1">
          <p className="text-xs font-semibold text-white truncate max-w-[140px]">{userName}</p>
          <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{userEmail}</p>
        </div>

        {/* Subtle Vertical Divider */}
        <div className="h-6 w-px bg-slate-800 mx-1" />

        {/* Integrated Logout Button */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 gap-1.5 transition-colors text-xs font-medium"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
