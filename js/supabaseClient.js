// js/supabaseClient.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Browser-compatible Supabase client
export const supabase = createClient(
  window.__SUPABASE_URL__,
  window.__SUPABASE_ANON_KEY__
);

