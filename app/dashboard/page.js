"use client";

import { useEffect } from "react";
import { updateCounterDisplay, updateTimerDisplays } from "@/src/assets/js/counter";
import { playAlarm } from "@/src/assets/js/headphoneAlarm";

export default function Dashboard() {
  useEffect(() => {
    updateCounterDisplay();
    updateTimerDisplays();
    const interval = setInterval(updateTimerDisplays, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ padding: 40 }}>
      <h1>Sandbox Dashboard</h1>
      <section>
        <h2>Uberman Cycle</h2>
        <p>Next nap time: <strong id="next-nap">--:--</strong></p>
        <p>Time remaining: <strong id="time-remaining">--</strong></p>
        <p>Uberman Sleep Day: <strong id="counter-display">0</strong></p>
        <p>Current: <span id="live-timer">00:00:00.000</span></p>
      </section>
      <section>
        <h2>Headphone Alarm</h2>
        <button onClick={() => playAlarm()}>Test Alarm</button>
      </section>
    </main>
  );
}
