const OpenAI = require("openai");

const STRICT_COACH_PROMPT = [
  "You are a strict English speaking coach.",
  "Be concise.",
  "Fix grammar.",
  "Give 1 short explanation.",
  "Return JSON only.",
].join("\n");

let client;

function hasOpenAI() {
  return Boolean(process.env.OPENAI_API_KEY);
}

function getClient() {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return client;
}

function clampScore(value, fallback) {
  const numeric = Number.isFinite(Number(value)) ? Number(value) : fallback;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function sanitizePayload(payload, transcript) {
  return {
    original: String(payload.original || transcript || "").trim(),
    corrected: String(payload.corrected || transcript || "").trim(),
    explanation: String(payload.explanation || "Keep the sentence short and accurate.").trim(),
    errors: Array.isArray(payload.errors) ? payload.errors.map((item) => String(item)).slice(0, 6) : [],
    score: {
      grammar: clampScore(payload.score?.grammar, 70),
      fluency: clampScore(payload.score?.fluency, 70),
      pronunciation: clampScore(payload.score?.pronunciation, 70),
    },
    analysisMode: "openai",
  };
}

async function analyzeWithOpenAI({ transcript, level }) {
  const prompt = [
    `Level: ${level.level}`,
    `Band: ${level.band}`,
    `Topic: ${level.topic}`,
    `Speaking task: ${level.speaking}`,
    `Grammar focus: ${level.grammar}`,
    `Expected answer pattern: ${level.expectedAnswer}`,
    `Learner transcript: ${transcript}`,
    "Return JSON with keys: original, corrected, explanation, errors, score.",
    "The score object must contain grammar, fluency, and pronunciation as integers from 0 to 100.",
  ].join("\n");

  const response = await getClient().responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.2",
    instructions: STRICT_COACH_PROMPT,
    input: prompt,
    text: {
      format: {
        type: "json_object",
      },
    },
    max_output_tokens: 250,
  });

  const parsed = JSON.parse(response.output_text);
  return sanitizePayload(parsed, transcript);
}

module.exports = {
  analyzeWithOpenAI,
  hasOpenAI,
};

