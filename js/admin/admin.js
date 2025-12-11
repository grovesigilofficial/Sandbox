// js/admin/admin.js
import { supabase } from '../supabase/supabaseClient.js';

// CONFIG
const ADMIN_PASSWORD = "ES@2610011171";
const SESSION_USER = "Bleedvow";
const NAP_HOURS = [0,4,8,12,16,20];
const RITUAL_MARKER_HOUR = 4; // 4AM marker

// DOM handles (pages/admin.html)
const statusEl = document.getElementById("ubermanStatus");
const elapsedEl = document.getElementById("elapsed");
const currentEl = document.getElementById("currentTime");
const nextNapEl = document.getElementById("nextNap");
const startBtn = document.getElementById("startButton");
const resetBtn = document.getElementById("resetButton");
const manualInput = document.getElementById("manualStart");
const saveBtn = document.getElementById("saveManual");
const clearBtn = document.getElementById("clearManual");
const savedStartEl = document.getElementById("savedStart");
const saveStatus = document.getElementById("save-status");

// ---------- HELPERS ----------
function two(n){ return n<10?"0"+n:String(n); }
function hmsFromSeconds(sec){
  const h = Math.floor(sec/3600);
  const m = Math.floor((sec%3600)/60);
  const s = sec%60;
  return `${two(h)}:${two(m)}:${two(s)}`;
}
function computeNextNap(now=new Date()){
  for(let h of NAP_HOURS){
    const cand = new Date(now);
    cand.setHours(h,0,0,0);
    if(cand > now) return cand;
  }
  const cand = new Date(now);
  cand.setDate(cand.getDate()+1);
  cand.setHours(0,0,0,0);
  return cand;
}
function lastRitualMarkerBefore(t){
  const d = new Date(t);
  d.setHours(RITUAL_MARKER_HOUR,0,0,0);
  if(t < d) d.setDate(d.getDate()-1);
  return d;
}
function ritualDayInfo(start, now=new Date()){
  const startMarker = lastRitualMarkerBefore(start);
  const currentMarker = lastRitualMarkerBefore(now);
  const dayDiff = Math.floor((currentMarker - startMarker)/(24*60*60*1000));
  const dayNumber = 1 + Math.max(0, dayDiff);
  const nextMarker = new Date(currentMarker);
  nextMarker.setDate(nextMarker.getDate()+1);
  const percent = Math.floor(((now - currentMarker)/(nextMarker - currentMarker))*100);
  const elapsedMs = now - currentMarker;
  return { dayNumber, percent: Math.max(0, Math.min(100, percent)), elapsedMs };
}

// ---------- SUPABASE helpers ----------
export async function getCurrentSession(){
  const { data, error } = await supabase
    .from('uberman_sessions')
    .select('*')
    .eq('running', true)
    .order('start_time', { ascending: false })
    .limit(1)
    .single();

  if(error) {
    // no active session: return null
    return null;
  }
  return data || null;
}

async function insertSession(timeISO){
  const { data, error } = await supabase
    .from('uberman_sessions')
    .insert({ user: SESSION_USER, start_time: timeISO, running: true })
    .select()
    .single();
  if(error){ throw error; }
  return data;
}

async function markSessionStopped(id){
  const { data, error } = await supabase
    .from('uberman_sessions')
    .update({ running: false, last_reset: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if(error) throw error;
  return data;
}

// ---------- Actions ----------
export async function startUberman(time = new Date()){
  try{
    const inserted = await insertSession(time.toISOString());
    savedStartEl.textContent = 'Saved start: ' + new Date(inserted.start_time).toLocaleString();
    saveStatus.textContent = 'Saved start time.';
    return inserted;
  }catch(err){
    console.error(err);
    saveStatus.textContent = 'Error saving start time.';
    alert('Error starting Uberman — check console.');
    return null;
  }
}

export async function resetUberman(){
  const session = await getCurrentSession();
  if(!session){ alert('No active session'); return; }
  try{
    await markSessionStopped(session.id);
    savedStartEl.textContent = '';
    saveStatus.textContent = 'Session reset.';
  }catch(err){
    console.error(err);
    alert('Error resetting — check console.');
  }
}

// ---------- Display ----------
async function updateDisplay(){
  const now = new Date();
  if(currentEl) currentEl.textContent = 'Current Time: ' + now.toLocaleTimeString();

  const session = await getCurrentSession();
  const nextNap = computeNextNap(now);
  if(nextNapEl) nextNapEl.textContent = 'Next Nap: ' + two(nextNap.getHours()) + ':00';

  if(!session){
    if(statusEl) statusEl.textContent = 'Uberman has not been scheduled.';
    if(elapsedEl) elapsedEl.textContent = '';
    if(savedStartEl) savedStartEl.textContent = '';
    return;
  }

  const startTime = new Date(session.start_time);
  if(savedStartEl) savedStartEl.textContent = 'Saved start: ' + startTime.toLocaleString();

  const diffMs = Date.now() - startTime.getTime();
  if(diffMs < 0){
    const sec = Math.floor(-diffMs/1000);
    if(statusEl) statusEl.textContent = 'Uberman begins in: ' + hmsFromSeconds(sec);
    if(elapsedEl) elapsedEl.textContent = '';
    return;
  }

  const info = ritualDayInfo(startTime, new Date());
  if(statusEl) statusEl.textContent = `Uberman Day: ${info.dayNumber} (${info.percent}%)`;
  if(elapsedEl) elapsedEl.textContent = 'Time on Uberman: ' + hmsFromSeconds(Math.floor(info.elapsedMs/1000));
}

// ---------- Events binding ----------
startBtn && (startBtn.onclick = async ()=>{ await startUberman(new Date()); updateDisplay(); });
resetBtn && (resetBtn.onclick = async ()=>{ await resetUberman(); updateDisplay(); });

saveBtn && (saveBtn.onclick = async ()=>{
  const raw = manualInput.value;
  if(!raw) return alert('Enter a valid date/time');
  const t = new Date(raw);
  await startUberman(t);
  updateDisplay();
});

clearBtn && (clearBtn.onclick = async ()=>{
  await resetUberman();
  updateDisplay();
});

// ---------- Boot ----------
(async ()=>{
  await updateDisplay();
  setInterval(updateDisplay, 1000);
})();
