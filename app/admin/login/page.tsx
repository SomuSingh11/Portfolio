"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("somusingh0110@gmail.com");
  const [password, setPassword] = useState("********");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/admin",
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl"
      >
        <h1 className="mb-6 text-2xl font-bold">Admin Login</h1>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
              required
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium hover:bg-blue-500 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="mt-6 space-y-2">
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/admin" })}
            className="w-full rounded-lg border border-slate-600 px-4 py-3"
          >
            Continue with GitHub
          </button>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/admin" })}
            className="w-full rounded-lg border border-slate-600 px-4 py-3"
          >
            Continue with Google
          </button>
        </div>
      </form>
    </main>
  );
}