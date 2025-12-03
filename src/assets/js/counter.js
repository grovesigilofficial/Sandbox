// counter.js
// Core local counter logic. Uses localStorage.
// No secrets stored here — reads CONFIG from either config.local.js (preferred) or config.default.js.

import { CONFIG as DEFAULT_CONFIG } from './config.default.js';

let CONFIG = DEFAULT_CONFIG;

// Attempt to dynamically import local config (if present)
(async () => {
  try {
    const local = await import('./config.local.js');
    if (local && local.CONFIG) CONFIG = local.CONFIG;
  } catch (e) {
    // config.local.js not present — fallback to defaults (expected)
  }
})();

// localStorage key
const KEY = CONFIG.LOCAL_COUNTER_KEY || 'grove_uberman_day';

// Counter helpers
export function getDayValue() {
  const raw = localStorage.getItem(KEY);
  const n = parseInt(raw, 10);
  return Number.isNaN(n) ? 0 : n;
}

export function setDayValue(val) {
  const num = Number(val) || 0;
  localStorage.setItem(KEY, String(num));
  // update displays if present
  updateCounterDisplay();
  return num;
}

export function incrementDayValue() {
  const cur = getDayValue();
  return setDayValue(cur + 1);
}

export function resetDayValue() {
  return setDayValue(0);
}

// DOM helpers
function el(id) { return document.getElementById(id); }

// Counter display update - safe if elements missing
export function updateCounterDisplay() {
  const display = el('counter-display');
  const current = el('current-day');
  const v = getDayValue();
  if (display) display.textContent = String(v);
  if (current) current.textContent = String(v);
}

// Timer & simple Uberman next nap generator
const SCHEDULE = ["00:00","04:00","08:00","12:00","16:00","20:00"]; // sample standard schedule

function toMinutes(hm) {
  const [h,m] = hm.split(":").map(Number);
  return h*60 + (m||0);
}

function formatTimeFromMinutes(mins) {
  const hh = Math.floor(mins / 60) % 24;
  const mm = mins % 60;
  return String(hh).padStart(2,'0') + ':' + String(mm).padStart(2,'0');
}

export function updateTimerDisplays() {
  const timerEl = el('live-timer');
  const nextEl = el('next-nap');
  const remainingEl = el('time-remaining');

  const now = new Date();
  const nowMinutes = now.getHours()*60 + now.getMinutes();

  // Find next scheduled nap in minutes
  let nextMinutes = null;
  for (let s of SCHEDULE) {
    const m = toMinutes(s);
    if (m > nowMinutes) { nextMinutes = m; break; }
  }
  if (nextMinutes === null) {
    // wrap to next day first schedule
    nextMinutes = toMinutes(SCHEDULE[0]) + 24*60;
  }

  const diff = nextMinutes - nowMinutes;
  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;
  const secs = now.getSeconds();

  if (timerEl) timerEl.textContent = now.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(now.getMilliseconds()).padStart(3,'0');
  if (nextEl) {
    // normalize nextMinutes to day time
    const nm = nextMinutes % (24*60);
    nextEl.textContent = formatTimeFromMinutes(nm);
  }
  if (remainingEl) remainingEl.textContent = `${hrs}h ${mins}m ${secs}s`;
}

// Exposed async wrappers (simulating API)
export async function getDay() { return getDayValue(); }
export async function setDay(n) { return setDayValue(n); }
export async function incrementDay() { const v = incrementDayValue(); return v; }
export async function resetDay() { const v = resetDayValue(); return v; }

// Auto-init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  updateCounterDisplay();
  updateTimerDisplays();
  // lower-frequency updates to save CPU (1000ms)
  setInterval(updateTimerDisplays, 1000);
});
