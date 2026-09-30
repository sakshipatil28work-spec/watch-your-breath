// Offscreen document: the only place a service worker can hand audio to.
//
// The bell to play is named in this document's own URL, and it plays as soon
// as this script runs. It used to be sent as a message straight after the
// document was created, which was a race the bell could lose: createDocument()
// resolves when the document exists, not when its script has run, so the
// listener below was often not attached yet and the message was dropped with
// "Receiving end does not exist". Nothing was heard, and nothing was reported.
//
// The listener stays for a document that is already open, and the document
// closes itself once the sound has finished so the next ring starts clean.

function play(url: string): Promise<boolean> {
  const audio = new Audio(url);
  audio.loop = false;
  audio.volume = 0.7;
  return audio
    .play()
    .then(() => true)
    .catch(() => false);
}

/** Close once the bell has been heard; a fresh document plays the next one. */
function closeWhenDone(): void {
  setTimeout(() => window.close(), 8000);
}

const fromUrl = new URLSearchParams(location.search).get("bell");
if (fromUrl) {
  void play(fromUrl).then(closeWhenDone);
}

chrome.runtime.onMessage.addListener((msg: { type?: string; url?: string }, _sender, sendResponse) => {
  if (msg?.type !== "wyb:offscreen-ring" || !msg.url) return false;
  void play(msg.url).then((ok) => {
    sendResponse({ ok });
    closeWhenDone();
  });
  return true;
});
