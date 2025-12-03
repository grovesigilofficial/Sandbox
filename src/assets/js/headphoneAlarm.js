let audioEl = null;

export async function playAlarm() {
  if (!audioEl) {
    audioEl = document.createElement('audio');
    audioEl.src = '/public/alarm.mp3';
    audioEl.loop = true;
    audioEl.preload = 'auto';
    document.body.appendChild(audioEl);
  }

  try {
    await audioEl.play();
  } catch(e) {
    console.warn('Autoplay failed', e);
  }

  setTimeout(() => {
    if(audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
    }
  }, 6000);
}
