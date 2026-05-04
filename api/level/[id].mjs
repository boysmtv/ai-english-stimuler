import { getLevelPayload, handleError, json, methodNotAllowed } from "../_lib/trainer.mjs";

function getLevelIdFromRequest(request) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/").filter(Boolean);
  return segments[segments.length - 1];
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const levelId = getLevelIdFromRequest(request);
    const payload = getLevelPayload(levelId, {
      focus: url.searchParams.get("focus"),
    });

    return json(payload);
  } catch (error) {
    return handleError(error);
  }
}

export default {
  async fetch(request) {
    if (request.method !== "GET") {
      return methodNotAllowed(["GET"]);
    }

    return GET(request);
  },
};
