'use client';

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/admin/login");
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Manage your portfolio content</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>

        {/* User Info */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Logged in as</h2>
          <div className="text-slate-300">
            <p>
              <span className="font-medium text-slate-400">Email:</span> {session?.user?.email}
            </p>
            <p>
              <span className="font-medium text-slate-400">Name:</span> {session?.user?.name || "N/A"}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Projects */}
          <Link href="/admin/projects">
            <div className="bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-lg p-8 cursor-pointer transition transform hover:scale-105">
              <h3 className="text-xl font-semibold text-white mb-3">📋 Projects</h3>
              <p className="text-slate-400 mb-4">View, create, edit, and delete your projects</p>
              <span className="text-blue-400 hover:text-blue-300 font-medium">Manage Projects →</span>
            </div>
          </Link>

          {/* Settings */}
          <Link href="/admin/settings">
            <div className="bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-lg p-8 cursor-pointer transition transform hover:scale-105">
              <h3 className="text-xl font-semibold text-white mb-3">⚙️ Settings</h3>
              <p className="text-slate-400 mb-4">Manage your profile and account settings</p>
              <span className="text-blue-400 hover:text-blue-300 font-medium">View Settings →</span>
            </div>
          </Link>
        </div>

        {/* Stats (optional) */}
        <div className="mt-12 bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Quick Stats</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-700 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm mb-1">Total Projects</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm mb-1">Published</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm mb-1">Drafts</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
