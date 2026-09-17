// The reminder bell: the author's attached recording, stored with the
// extension at assets/audio/reminder-bell.mp3. Played once, never looped.
// Only extension pages can play audio (the card, the popup, the offscreen
// document); the service worker asks the offscreen document instead.

export const BELL_URL = "assets/audio/reminder-bell.mp3";

let current: HTMLAudioElement | null = null;

/** Plays the bell once. Resolves when playback starts, or quietly when the browser refuses. */
export async function playReminderSound(soundEnabled: boolean): Promise<boolean> {
  if (!soundEnabled) return false;
  try {
    if (current) {
      current.pause();
      current = null;
    }
    const audio = new Audio(chrome.runtime.getURL(BELL_URL));
    audio.loop = false;
    audio.volume = 0.7;
    current = audio;
    await audio.play();
    return true;
  } catch {
    // autoplay refused or no output device: the reminder still shows
    return false;
  }
}
