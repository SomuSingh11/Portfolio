import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import projects from "@/data/projects";
import ProjectDetail from "@/components/Projects/ProjectDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static params for all projects
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// Dynamic OG metadata per project
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };

  const firstImage = project.media[0];
  const ogImage = firstImage?.type === "image" ? firstImage.src : undefined;

  return {
    metadataBase: new URL("https://somusingh.dev"),
    title: `${project.name} — ${project.category} | Somu Singh`,
    description: project.tagline ?? project.description,
    openGraph: {
      type: "website",
      title: `${project.name} by Somu Singh`,
      description: project.tagline ?? project.description,
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: project.name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} by Somu Singh`,
      description: project.tagline ?? project.description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
          >
            <span className="text-lg">←</span>
            <span>Somu Singh</span>
          </Link>

          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Link href="/" className="hover:text-gray-400 transition-colors">
              Portfolio
            </Link>
            <span>/</span>
            <Link
              href="/#projects"
              className="hover:text-gray-400 transition-colors"
            >
              Projects
            </Link>
            <span>/</span>
            <span className="text-gray-300">{project.name}</span>
          </div>
        </div>
      </nav>

      {/* Project detail */}
      <main>
        <ProjectDetail project={project} standalone />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center">
        <p className="text-gray-600 text-sm">
          Built by{" "}
          <Link href="/" className="text-blue-400 hover:underline">
            Somu Singh
          </Link>{" "}
          ·{" "}
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            View Source
          </a>
        </p>
      </footer>
    </div>
  );
}
