// js/supabaseClient.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Use the keys you already set in login.html or index.html
export const supabase = createClient(
  window.__SUPABASE_URL__,
  window.__SUPABASE_ANON_KEY__
);
