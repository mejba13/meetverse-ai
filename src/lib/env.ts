import { z } from "zod";

/**
 * Server-side environment variables schema
 * These are validated at build time and runtime
 */
const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Auth
  AUTH_SECRET: z.string().min(32),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  AUTH_GITHUB_ID: z.string().optional(),
  AUTH_GITHUB_SECRET: z.string().optional(),

  // LiveKit
  LIVEKIT_API_KEY: z.string().optional(),
  LIVEKIT_API_SECRET: z.string().optional(),

  // AI Services
  ANTHROPIC_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  DEEPGRAM_API_KEY: z.string().optional(),

  // Redis
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Storage
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),

  // Email
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  // Environment
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

/**
 * Client-side environment variables schema
 * Only NEXT_PUBLIC_ prefixed variables are available on the client
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("MeetVerse AI"),
  NEXT_PUBLIC_LIVEKIT_URL: z.string().url().optional(),
});

// Server environment (only available on server)
const serverEnv = serverEnvSchema.safeParse(process.env);

// Client environment (available everywhere)
const clientEnv = clientEnvSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_LIVEKIT_URL: process.env.NEXT_PUBLIC_LIVEKIT_URL,
});

if (!serverEnv.success && typeof window === "undefined") {
  console.error("Invalid server environment variables:", serverEnv.error.format());
  // Don't throw in development for easier setup
  if (process.env.NODE_ENV === "production") {
    throw new Error("Invalid server environment variables");
  }
}

if (!clientEnv.success) {
  console.error("Invalid client environment variables:", clientEnv.error.format());
}

/**
 * Type-safe server environment variables
 * Only import this on the server
 */
export const serverConfig = serverEnv.success ? serverEnv.data : ({} as z.infer<typeof serverEnvSchema>);

/**
 * Type-safe client environment variables
 * Safe to import anywhere
 */
export const clientConfig = clientEnv.success ? clientEnv.data : {
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  NEXT_PUBLIC_APP_NAME: "MeetVerse AI",
  NEXT_PUBLIC_LIVEKIT_URL: undefined,
};

/**
 * Combined environment config
 * Use this for convenience when you need both
 */
export const env = {
  ...serverConfig,
  ...clientConfig,
};
