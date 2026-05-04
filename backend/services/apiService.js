const { analyzeAttempt } = require("./analyzerService");
const { ensureLevelData, getLevelById } = require("./levelService");
const { transcribeAttempt } = require("./transcriptionService");

const CAPABILITIES = Object.freeze({
  localOnly: true,
  cloudCalls: false,
  audioMetrics: true,
  liveMicNeedsHttps: true,
  transcriptRequiredForGrammar: true,
});

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function normalizeLevelId(value) {
  const levelId = Number(value);

  if (!Number.isInteger(levelId) || levelId < 1) {
    throw createHttpError(400, "Level id must be a positive number.");
  }

  return levelId;
}

function normalizeFocus(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
}

function normalizeAudioMetrics(value) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (_error) {
      throw createHttpError(400, "Audio metrics payload is invalid JSON.");
    }
  }

  if (typeof value === "object") {
    return value;
  }

  return null;
}

function getHealthPayload() {
  ensureLevelData();

  return {
    status: "ok",
    service: "AI English Speaking Trainer API",
    capabilities: CAPABILITIES,
  };
}

function getLevelPayload(levelId, options = {}) {
  ensureLevelData();

  const normalizedId = normalizeLevelId(levelId);
  const level = getLevelById(normalizedId, {
    focus: normalizeFocus(options.focus),
  });

  if (!level) {
    throw createHttpError(404, `Level ${normalizedId} was not found.`);
  }

  return level;
}

async function getAnalysisPayload({ levelId, transcript, audioMetrics }) {
  const level = getLevelPayload(levelId);
  const transcription = transcribeAttempt({
    providedTranscript: transcript,
  });

  const analysis = await analyzeAttempt({
    transcript: transcription.text,
    level,
    audioMetrics: normalizeAudioMetrics(audioMetrics),
  });

  return {
    ...analysis,
    transcriptSource: transcription.source,
    level: {
      id: level.level,
      topic: level.topic,
    },
  };
}

module.exports = {
  CAPABILITIES,
  createHttpError,
  getAnalysisPayload,
  getHealthPayload,
  getLevelPayload,
};
