function normalizeWhitespace(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function transcribeAttempt({ providedTranscript, file }) {
  const transcript = normalizeWhitespace(providedTranscript);

  if (transcript) {
    return {
      text: transcript,
      source: "browser-speech-recognition",
    };
  }

  if (file) {
    return {
      text: "",
      source: "mock-empty-audio",
    };
  }

  return {
    text: "",
    source: "no-audio",
  };
}

module.exports = {
  transcribeAttempt,
};

