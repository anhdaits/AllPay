import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * True only when both env vars are present AND don't still look like the
 * placeholder values from .env.example. Callers should check this *before*
 * making a Supabase request, so a misconfigured deployment fails with a
 * clear message instead of a bare `TypeError: Failed to fetch` (which is
 * what you get when the client is created with an empty/placeholder URL and
 * the browser's fetch() can't resolve it — no useful info in that error by
 * itself).
 */
export const isSupabaseConfigured =
  !!supabaseUrl &&
  !!supabasePublishableKey &&
  !supabaseUrl.includes("YOUR_PROJECT_REF") &&
  !supabasePublishableKey.includes("your-key-here");

if (!isSupabaseConfigured) {
  console.error(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are missing " +
      "or still set to .env.example's placeholder values.\n" +
      "Locally: cp .env.example .env.local, fill in your real Supabase project values, then restart `npm run dev`.\n" +
      "On Vercel: set them under Project Settings → Environment Variables, then trigger a new deploy — " +
      "NEXT_PUBLIC_ vars are baked into the build, so adding them after a build won't take effect until you redeploy."
  );
}

// A syntactically valid (but unreachable) URL as a fallback so createClient()
// doesn't throw during module load if env vars are missing — the guard above
// (and the isSupabaseConfigured checks at each call site) is what actually
// surfaces the problem clearly, before any network call is attempted.
export const supabase = createClient(
  supabaseUrl || "https://not-configured.supabase.co",
  supabasePublishableKey || "not-configured",
  { auth: { persistSession: false } }
);
