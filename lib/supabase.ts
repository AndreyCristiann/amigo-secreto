import { createClient } from "@supabase/supabase-js";

export function getSupabaseClient(headers?: Record<string, string>) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers } }
  );
}
