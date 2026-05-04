import {
  createHttpError,
  getAnalysisPayload,
  handleError,
  json,
  methodNotAllowed,
} from "./_lib/trainer.mjs";

async function readJsonBody(request) {
  try {
    return await request.json();
  } catch (_error) {
    throw createHttpError(400, "Request body must be valid JSON.");
  }
}

export async function POST(request) {
  try {
    const body = await readJsonBody(request);
    const payload = await getAnalysisPayload(body || {});
    return json(payload);
  } catch (error) {
    return handleError(error);
  }
}

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return methodNotAllowed(["POST"]);
    }

    return POST(request);
  },
};
