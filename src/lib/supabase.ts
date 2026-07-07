import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  // Don't throw here. This module is imported by client components that
  // Next.js may still render once on the server during `next build` (static
  // generation), so a hard throw would fail the entire build in any
  // environment where these vars aren't set yet — e.g. a fresh Vercel project
  // before its environment variables are configured. Missing vars will
  // instead surface as a clear Supabase error at the point of use, which the
  // UI already handles via its existing error banners.
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. " +
      "Copy .env.example to .env.local locally, or set them in your Vercel project's Environment Variables."
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabasePublishableKey ?? "", {
  auth: { persistSession: false },
});
