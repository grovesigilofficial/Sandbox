// js/supabase/supabaseClient.js
// Reads credentials from window.__SUPABASE_URL__ and window.__SUPABASE_ANON__
// On Vercel, set these as global injection or replace with explicit values (not recommended to commit keys).

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = window.__SUPABASE_URL__ || '';
const SUPABASE_KEY = window.__SUPABASE_ANON__ || '';

if(!SUPABASE_URL || !SUPABASE_KEY){
  console.warn('Supabase keys not set. Set window.__SUPABASE_URL__ and window.__SUPABASE_ANON__ in the global scope (Vercel inject).');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
