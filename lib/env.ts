import { z } from "zod";

const envSchema = z.object({
  // Next.js exposed variables (if any)
  NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: z.string().optional(),

  // Server-side variables
  GEMINI_API_KEY: z.string().min(1, "Gemini API key is required"),
  
  DATABASE_URL: z.string().url("Must be a valid Postgres URL"),
  DATABASE_URL_UNPOOLED: z.string().url("Must be a valid Postgres URL"),

  NEXTAUTH_SECRET: z.string().min(1, "NextAuth secret is required"),
  NEXTAUTH_URL: z.string().url("NextAuth URL must be valid"),

  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),
  
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:");
  console.error(_env.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
