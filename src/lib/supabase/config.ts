// Central Supabase config. Reads from environment variables (set these in
// Vercel / .env.local for production). The fallbacks exist only so the
// production build can pre-render pages without crashing when the env vars
// are absent — the app still needs the real values at runtime to connect.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
