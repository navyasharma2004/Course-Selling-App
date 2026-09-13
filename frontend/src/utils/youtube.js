// Accepts a full YouTube URL (watch, youtu.be, embed, shorts) or a bare 11-char ID
// and returns just the video ID — which is what gets stored in the backend.
export function extractYoutubeId(input) {
  if (!input) return "";
  const trimmed = input.trim();

  // Already looks like a bare ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }

  return trimmed; // fall back to whatever was typed
}
