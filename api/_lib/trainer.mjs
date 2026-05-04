import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  createHttpError,
  getAnalysisPayload,
  getHealthPayload,
  getLevelPayload,
} = require("../../backend/services/apiService.js");

export { createHttpError, getAnalysisPayload, getHealthPayload, getLevelPayload };

export function json(data, init = {}) {
  return Response.json(data, init);
}

export function methodNotAllowed(allowedMethods) {
  return json(
    {
      message: `Method not allowed. Use ${allowedMethods.join(", ")}.`,
    },
    {
      status: 405,
      headers: {
        Allow: allowedMethods.join(", "),
      },
    },
  );
}

export function handleError(error) {
  console.error(error);

  return json(
    {
      message: error?.message || "Unexpected server error.",
    },
    {
      status: error?.status || 500,
    },
  );
}
