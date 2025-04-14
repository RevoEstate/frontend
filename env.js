import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const env = createEnv({
  // Server-side environment variables
  server: {
    // Database URLs
    DATABASE_URL_DEVELOPMENT: z.string(),
    DATABASE_URL_PRODUCTION: z.string(),

    // Authentication credentials
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    BETTER_AUTH_SECRET: z.string(),

  },

  // Client-side public environment variables
  client: {
    // Application settings
    NEXT_PUBLIC_APP_URL: z.string(),
    NEXT_PUBLIC_CACHE_ENCRYPTION_KEY: z.string(),

  },

  // Linking runtime environment variables
  runtimeEnv: {
    // Database URLs
    DATABASE_URL_DEVELOPMENT: process.env.DATABASE_URL_DEVELOPMENT,
    DATABASE_URL_PRODUCTION: process.env.DATABASE_URL_PRODUCTION,

    // Authentication credentials
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,


    // Application settings
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CACHE_ENCRYPTION_KEY:
      process.env.NEXT_PUBLIC_CACHE_ENCRYPTION_KEY,

  },
});

export default env;
