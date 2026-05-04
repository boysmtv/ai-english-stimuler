function normalizeWhitespace(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function transcribeAttempt({ providedTranscript }) {
  const transcript = normalizeWhitespace(providedTranscript);

  if (transcript) {
    return {
      text: transcript,
      source: "manual-or-browser-transcript",
    };
  }

  return {
    text: "",
    source: "no-transcript",
  };
}

module.exports = {
  normalizeWhitespace,
  transcribeAttempt,
};
