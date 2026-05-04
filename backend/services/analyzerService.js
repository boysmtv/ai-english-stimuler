const { analyzeWithMockCoach } = require("./mockCoachService");
const { analyzeWithOpenAI, hasOpenAI } = require("./openaiCoachService");

async function analyzeAttempt({ transcript, level }) {
  if (hasOpenAI()) {
    try {
      return await analyzeWithOpenAI({ transcript, level });
    } catch (error) {
      console.warn("OpenAI analysis failed, falling back to mock mode.", error.message);
    }
  }

  return analyzeWithMockCoach({ transcript, level });
}

module.exports = {
  analyzeAttempt,
};

