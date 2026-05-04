function resolveApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol || "http:";
    const hostname = window.location.hostname || "localhost";
    return `${protocol}//${hostname}:4000`;
  }

  return "http://localhost:4000";
}

const API_BASE_URL = resolveApiBaseUrl();

async function parseResponse(response) {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload;
}

export async function getLevel(levelId, focus) {
  const url = new URL(`${API_BASE_URL}/level/${levelId}`);

  if (focus) {
    url.searchParams.set("focus", focus);
  }

  const response = await fetch(url);
  return parseResponse(response);
}

export async function analyzeAttempt({ level, audioBlob, transcript }) {
  const formData = new FormData();
  formData.append("levelId", String(level.level));
  formData.append("transcript", transcript || "");

  if (audioBlob) {
    formData.append("audio", audioBlob, `level-${level.level}.webm`);
  }

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  return parseResponse(response);
}
