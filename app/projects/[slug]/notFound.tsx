import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">🗂️</div>
        <h1 className="text-2xl font-bold mb-2">Project not found</h1>
        <p className="text-gray-400 text-sm mb-6">
          This project doesn&apos;t exist or may have moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          ← Back to Portfolio
        </Link>
      </div>
    </div>
  );
}
