function resolveApiBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/+$/, "");
  }

  return "/api";
}

const API_BASE_URL = resolveApiBaseUrl();

export function getApiBaseUrl() {
  if (typeof window === "undefined") {
    return API_BASE_URL;
  }

  try {
    return new URL(API_BASE_URL, window.location.origin).toString().replace(/\/+$/, "");
  } catch (_error) {
    return API_BASE_URL;
  }
}

export async function getHealth() {
  return requestJson("/health", {
    method: "GET",
  });
}

async function parseResponse(response) {
  const raw = await response.text();
  let payload = {};

  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch (_error) {
      payload = {};
    }
  }

  if (!response.ok) {
    const fallbackMessage = raw?.trim().startsWith("<")
      ? `Request failed with status ${response.status}.`
      : raw;

    throw new Error(payload.message || fallbackMessage || `Request failed with status ${response.status}.`);
  }

  return payload;
}

async function requestJson(path, options = {}) {
  const headers = new Headers(options.headers || {});

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (_error) {
    throw new Error(
      `Cannot connect to trainer API at ${getApiBaseUrl()}. Start the local backend or deploy the /api functions and try again.`,
    );
  }

  return parseResponse(response);
}

export async function getLevel(levelId, focus) {
  const params = new URLSearchParams();

  if (focus) {
    params.set("focus", focus);
  }

  const query = params.toString();

  return requestJson(`/level/${levelId}${query ? `?${query}` : ""}`, {
    method: "GET",
  });
}

export async function analyzeAttempt({ level, transcript, audioMetrics }) {
  return requestJson("/analyze", {
    method: "POST",
    body: JSON.stringify({
      levelId: level.level,
      transcript: transcript || "",
      audioMetrics: audioMetrics || null,
    }),
  });
}
