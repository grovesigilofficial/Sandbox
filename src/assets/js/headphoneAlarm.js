let alarmAudio = new Audio("/sandbox-private/public/alarm.mp3");

export function playAlarm() {
    alarmAudio.play();
}

export function stopAlarm() {
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
}
