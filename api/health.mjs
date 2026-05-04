import { getHealthPayload, handleError, json, methodNotAllowed } from "./_lib/trainer.mjs";

export async function GET() {
  try {
    return json(getHealthPayload());
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
