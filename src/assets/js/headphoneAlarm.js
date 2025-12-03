// GrovePortal-Sandbox — Headphone Alarm Module

let audio;

// Preload soft loop sound
async function loadSound() {
  if (!audio) {
    audio = new Audio("public/alarm.mp3"); // Corrected path
    audio.loop = true;
  }
  return audio;
}

export async function playAlarm() {
  const sound = await loadSound();
  try {
    await sound.play();
    console.log("Alarm started — GrovePortal-Sandbox");
  } catch (e) {
    console.log("Playback blocked, waiting for user gesture — GrovePortal-Sandbox");
  }
}

export function stopAlarm() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    console.log("Alarm stopped — GrovePortal-Sandbox");
  }
}
