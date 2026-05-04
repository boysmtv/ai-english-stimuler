function cleanText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function titleCaseSentence(value) {
  const sentence = cleanText(value);

  if (!sentence) {
    return sentence;
  }

  const normalized = sentence.charAt(0).toUpperCase() + sentence.slice(1);
  return /[.!?]$/.test(normalized) ? normalized : `${normalized}.`;
}

function parseAudioMetrics(input) {
  if (!input || typeof input !== "object") {
    return null;
  }

  const coerce = (value, fallback = 0) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
  };

  return {
    durationSeconds: coerce(input.durationSeconds),
    averageRms: coerce(input.averageRms),
    peakLevel: coerce(input.peakLevel),
    clippingRatio: coerce(input.clippingRatio),
    silenceRatio: coerce(input.silenceRatio),
    speechRatio: coerce(input.speechRatio),
    pauseCount: coerce(input.pauseCount),
    wordsPerMinute: coerce(input.wordsPerMinute),
  };
}

function similarityScore(a, b) {
  const left = cleanText(a).toLowerCase().split(/\W+/).filter(Boolean);
  const right = cleanText(b).toLowerCase().split(/\W+/).filter(Boolean);

  if (!left.length || !right.length) {
    return 0;
  }

  const rightSet = new Set(right);
  const overlap = left.filter((token) => rightSet.has(token)).length;
  return overlap / Math.max(left.length, right.length);
}

function collectGrammarIssues(text) {
  const issues = [];
  let corrected = cleanText(text);

  const rules = [
    {
      pattern: /\bi is\b/gi,
      replacement: "I am",
      error: "Use 'am' with 'I'.",
      explanation: "Use 'I am', not 'I is'.",
    },
    {
      pattern: /\bi are\b/gi,
      replacement: "I am",
      error: "Use 'am' with 'I'.",
      explanation: "Use 'I am' for self-introduction.",
    },
    {
      pattern: /\bhe are\b/gi,
      replacement: "he is",
      error: "Use 'is' with he.",
      explanation: "Use 'he is' for singular subjects.",
    },
    {
      pattern: /\bshe are\b/gi,
      replacement: "she is",
      error: "Use 'is' with she.",
      explanation: "Use 'she is' for singular subjects.",
    },
    {
      pattern: /\bit are\b/gi,
      replacement: "it is",
      error: "Use 'is' with it.",
      explanation: "Use 'it is' for singular subjects.",
    },
    {
      pattern: /\bmy name (?!is\b)/gi,
      replacement: "my name is",
      error: "Complete 'My name is ...'.",
      explanation: "Use the full phrase 'My name is ...'.",
    },
    {
      pattern: /\bi from\b/gi,
      replacement: "I am from",
      error: "Use 'I am from ...' for origin.",
      explanation: "Add 'am' in 'I am from ...'.",
    },
    {
      pattern: /\b(he|she|it) go\b/gi,
      replacement: (_match, subject) => `${subject} goes`,
      error: "Use third-person singular verbs.",
      explanation: "With he, she, or it, the verb often ends in 's'.",
    },
    {
      pattern: /\b(he|she|it) have\b/gi,
      replacement: (_match, subject) => `${subject} has`,
      error: "Use 'has' with he, she, or it.",
      explanation: "Use 'has' for singular third-person subjects.",
    },
    {
      pattern: /\bi has\b/gi,
      replacement: "I have",
      error: "Use 'have' with I.",
      explanation: "Use 'I have', not 'I has'.",
    },
    {
      pattern: /\b(he|she|it) don't\b/gi,
      replacement: (_match, subject) => `${subject} doesn't`,
      error: "Use 'doesn't' with he, she, or it.",
      explanation: "Singular third-person negatives use 'doesn't'.",
    },
  ];

  for (const rule of rules) {
    if (rule.pattern.test(corrected)) {
      corrected = corrected.replace(rule.pattern, rule.replacement);
      issues.push({
        error: rule.error,
        explanation: rule.explanation,
      });
    }
  }

  return {
    corrected,
    issues,
  };
}

function collectContentIssues(original, level, overlap) {
  const issues = [];
  const words = cleanText(original).split(/\s+/).filter(Boolean);

  if (!words.length) {
    return issues;
  }

  if (words.length < 3) {
    issues.push("Your answer is too short.");
  }

  if (overlap < 0.4) {
    issues.push("Use more of the target words from the task.");
  }

  if (level.stage === 2) {
    const sentenceCount = original.split(/[.!?]+/).filter((part) => cleanText(part)).length;

    if (sentenceCount < 2) {
      issues.push("Add a second short sentence for more detail.");
    }
  }

  return issues;
}

function analyzeFluency(original, audioMetrics) {
  const fillerCount = (original.match(/\b(um|uh|erm|like)\b/gi) || []).length;
  const wordList = original.split(/\s+/).filter(Boolean);
  const repeatedWords = wordList.reduce((count, word, index) => {
    return count + (index > 0 && word.toLowerCase() === wordList[index - 1].toLowerCase() ? 1 : 0);
  }, 0);

  const issues = [];
  let penalty = fillerCount * 8 + repeatedWords * 7;

  if (audioMetrics) {
    if (audioMetrics.wordsPerMinute > 165) {
      penalty += 10;
      issues.push("Slow down a little for smoother delivery.");
    } else if (audioMetrics.wordsPerMinute > 0 && audioMetrics.wordsPerMinute < 70) {
      penalty += 8;
      issues.push("Try a slightly steadier pace.");
    }

    if (audioMetrics.pauseCount >= 4) {
      penalty += 8;
      issues.push("Reduce long pauses between phrases.");
    }

    if (audioMetrics.silenceRatio > 0.48) {
      penalty += 10;
      issues.push("Keep speaking for a larger part of the attempt.");
    }
  }

  if (fillerCount > 0) {
    issues.push("Reduce filler words for smoother fluency.");
  }

  return {
    fillerCount,
    repeatedWords,
    issues,
    score: clampScore(92 - penalty),
  };
}

function analyzeVoiceDelivery(audioMetrics) {
  if (!audioMetrics || !audioMetrics.durationSeconds) {
    return {
      issues: ["Add audio for delivery scoring."],
      score: 58,
      metrics: null,
    };
  }

  const issues = [];
  let penalty = 0;

  if (audioMetrics.averageRms < 0.018) {
    penalty += 10;
    issues.push("Speak slightly louder for clearer voice energy.");
  }

  if (audioMetrics.clippingRatio > 0.015) {
    penalty += 10;
    issues.push("Move the mic a bit farther away to avoid distortion.");
  }

  if (audioMetrics.speechRatio < 0.42) {
    penalty += 10;
    issues.push("Keep your speech more continuous.");
  }

  if (audioMetrics.pauseCount >= 4) {
    penalty += 8;
  }

  const score = clampScore(88 - penalty);

  return {
    issues,
    score,
    metrics: {
      durationSeconds: clampScore(audioMetrics.durationSeconds * 10) / 10,
      wordsPerMinute: clampScore(audioMetrics.wordsPerMinute),
      pauseCount: clampScore(audioMetrics.pauseCount),
      speechRatio: clampScore(audioMetrics.speechRatio * 100),
    },
  };
}

function buildCorrectedText(original, grammarReview, level) {
  const corrected = cleanText(grammarReview.corrected);

  if (corrected) {
    return titleCaseSentence(corrected);
  }

  return titleCaseSentence(level.expectedAnswer.replace(/____/g, "..."));
}

function analyzeWithMockCoach({ transcript, level, audioMetrics }) {
  const original = cleanText(transcript);
  const normalizedAudioMetrics = parseAudioMetrics(audioMetrics);

  if (!original && !normalizedAudioMetrics?.durationSeconds) {
    return {
      original: "",
      corrected: titleCaseSentence(level.expectedAnswer.replace(/____/g, "...")),
      explanation: "Record your answer, then type the sentence for grammar coaching in local-only mode.",
      errors: ["No speech or transcript detected."],
      score: {
        grammar: 20,
        fluency: 20,
        pronunciation: 20,
      },
      analysisMode: "local",
      voiceMetrics: null,
    };
  }

  const wordList = original.split(/\s+/).filter(Boolean);
  const grammarReview = collectGrammarIssues(original);
  const overlap = similarityScore(original, level.expectedAnswer);
  const shortAnswerPenalty = wordList.length > 0 && wordList.length < 4 ? 16 : 0;
  const contentIssues = collectContentIssues(original, level, overlap);
  const fluencyReview = analyzeFluency(original, normalizedAudioMetrics);
  const deliveryReview = analyzeVoiceDelivery(normalizedAudioMetrics);

  let grammarScore = clampScore(95 - grammarReview.issues.length * 12 - shortAnswerPenalty);

  if (!original && normalizedAudioMetrics?.durationSeconds) {
    grammarScore = 34;
  }

  const errors = [
    ...grammarReview.issues.map((issue) => issue.error),
    ...contentIssues,
    ...fluencyReview.issues,
    ...deliveryReview.issues,
  ].slice(0, 6);

  const corrected = buildCorrectedText(original, grammarReview, level);

  const explanation =
    grammarReview.issues[0]?.explanation ||
    contentIssues[0] ||
    fluencyReview.issues[0] ||
    deliveryReview.issues[0] ||
    (!original && normalizedAudioMetrics?.durationSeconds && "Type the sentence you said to unlock grammar correction.") ||
    "Clear answer. Keep the rhythm natural and add one more detail next time.";

  return {
    original: titleCaseSentence(original),
    corrected,
    explanation,
    errors,
    score: {
      grammar: grammarScore,
      fluency: fluencyReview.score,
      pronunciation: deliveryReview.score,
    },
    analysisMode: "local",
    voiceMetrics: deliveryReview.metrics,
  };
}

module.exports = {
  analyzeWithMockCoach,
};
