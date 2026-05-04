const { analyzeWithMockCoach } = require("./mockCoachService");

async function analyzeAttempt({ transcript, level, audioMetrics }) {
  return analyzeWithMockCoach({ transcript, level, audioMetrics });
}

module.exports = {
  analyzeAttempt,
};
