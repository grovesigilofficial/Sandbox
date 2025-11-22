// src/assets/js/supabase.js
// This file imports the CONFIG from either config.local.js (preferred) or config.example.js.
// It avoids crashing if CONFIG is missing; if missing, console warns and calls will fail gracefully.

let CONFIG;
try {
  // Try local secret config first (ignored by git)
  // eslint-disable-next-line import/no-unresolved
  CONFIG = (await import('./config.local.js')).CONFIG;
} catch (err) {
  // fallback to example (committed safe defaults)
  CONFIG = (await import('./config.example.js')).CONFIG;
}

import { createClient } from '@supabase/supabase-js';

if (!CONFIG || !CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY) {
  console.warn('Supabase config missing. Fill src/assets/js/config.local.js with your keys.');
}

export const supabase = createClient(CONFIG.SUPABASE_URL || '', CONFIG.SUPABASE_ANON_KEY || '');
