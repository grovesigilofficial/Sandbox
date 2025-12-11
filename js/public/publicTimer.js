// js/public/publicTimer.js
import { supabase } from '../supabase/supabaseClient.js';

// Anchors & nap schedule
const RITUAL_MARKER_HOUR = 4; // 4 AM
const NAP_HOURS = [0,4,8,12,16,20];

// DOM
const startCountdownEl = document.getElementById("startCountdown");
const nextNapCountdownEl = document.getElementById("nextNapCountdown");
const nextNapAtEl = document.getElementById("nextNapAt");

const activeBlock = document.getElementById("activeBlock");
const countdownBlock = document.getElementById("countdownBlock");
const publicDayEl = document.getElementById("publicDay");
const publicElapsedEl = document.getElementById("publicElapsed");
const publicNowEl = document.getElementById("publicNow");
const publicNextNapEl = document.getElementById("publicNextNap");

function two(n){ return n < 10 ? '0'+n : String(n); }
function hmsFromSec(sec){
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
  if(!start) return null;
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

async function getCurrentSession(){
  const { data, error } = await supabase
    .from('uberman_sessions')
    .select('*')
    .eq('running', true)
    .order('start_time', { ascending: false })
    .limit(1)
    .single();
  if(error) return null;
  return data ? new Date(data.start_time) : null;
}

async function tick(){
  const now = new Date();
  publicNowEl && (publicNowEl.textContent = `${two(now.getHours())}:${two(now.getMinutes())}:${two(now.getSeconds())}`);

  const start = await getCurrentSession();
  const nextNap = computeNextNap(now);
  const secToNextNap = Math.floor((nextNap - now) / 1000);
  nextNapCountdownEl && (nextNapCountdownEl.textContent = hmsFromSec(secToNextNap));
  nextNapAtEl && (nextNapAtEl.textContent = `${two(nextNap.getHours())}:00`);

  if(!start){
    countdownBlock.style.display = "block";
    activeBlock.style.display = "none";
    startCountdownEl && (startCountdownEl.textContent = 'Not scheduled — set start in Admin');
    return;
  }

  const diffMs = now - start;
  if(diffMs < 0){
    countdownBlock.style.display = "block";
    activeBlock.style.display = "none";
    startCountdownEl && (startCountdownEl.textContent = hmsFromSec(Math.floor(-diffMs/1000)));
    return;
  }

  // active
  countdownBlock.style.display = "none";
  activeBlock.style.display = "block";

  const info = ritualDayInfo(start, now);
  if(info){
    publicDayEl && (publicDayEl.textContent = `${info.dayNumber} (${info.percent}%)`);
    publicElapsedEl && (publicElapsedEl.textContent = hmsFromSec(Math.floor(info.elapsedMs/1000)));
  } else {
    publicDayEl && (publicDayEl.textContent = '—');
    publicElapsedEl && (publicElapsedEl.textContent = '—');
  }
  publicNextNapEl && (publicNextNapEl.textContent = `${two(nextNap.getHours())}:00:00`);
}

setInterval(tick, 1000);
tick();
