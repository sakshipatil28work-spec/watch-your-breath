// Offscreen document: the only place a service worker can hand audio to.
// Plays the bell once per request; used when the card window cannot open.
chrome.runtime.onMessage.addListener((msg: { type?: string; url?: string }, _sender, sendResponse) => {
  if (msg?.type !== "wyb:offscreen-ring" || !msg.url) return false;
  const audio = new Audio(msg.url);
  audio.loop = false;
  audio.volume = 0.7;
  audio
    .play()
    .then(() => sendResponse({ ok: true }))
    .catch(() => sendResponse({ ok: false }));
  return true;
});
