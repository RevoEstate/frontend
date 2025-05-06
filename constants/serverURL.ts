import env from "@/env";
export const ServerURL = env.NEXT_PUBLIC_ENV === 'production'
  ? 'https://revostate.mikegirma.dev'  // production
  : 'http://localhost:3000';             // development
