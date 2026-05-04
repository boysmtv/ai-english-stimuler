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

function analyzeWithMockCoach({ transcript, level }) {
  const original = cleanText(transcript);

  if (!original) {
    return {
      original: "",
      corrected: titleCaseSentence(level.expectedAnswer.replace(/____/g, "...")),
      explanation: "No speech was detected, so repeat the task in one short sentence.",
      errors: ["No speech detected."],
      score: {
        grammar: 25,
        fluency: 20,
        pronunciation: 20,
      },
      analysisMode: "mock",
    };
  }

  const fillerCount = (original.match(/\b(um|uh|erm|like)\b/gi) || []).length;
  const wordList = original.split(/\s+/).filter(Boolean);
  const repeatedWords = wordList.reduce((count, word, index) => {
    return count + (index > 0 && word.toLowerCase() === wordList[index - 1].toLowerCase() ? 1 : 0);
  }, 0);

  const grammarReview = collectGrammarIssues(original);
  const overlap = similarityScore(original, level.expectedAnswer);
  const shortAnswerPenalty = wordList.length < 4 ? 18 : 0;

  const grammarScore = clampScore(96 - grammarReview.issues.length * 18 - shortAnswerPenalty);
  const fluencyScore = clampScore(94 - fillerCount * 10 - repeatedWords * 8 - shortAnswerPenalty);
  const pronunciationScore = clampScore(45 + overlap * 55 - fillerCount * 4);

  const errors = grammarReview.issues.map((issue) => issue.error);

  if (overlap < 0.45) {
    errors.push("Use more of the target words from the task.");
  }

  if (fillerCount > 0) {
    errors.push("Reduce filler words for smoother fluency.");
  }

  const explanation =
    grammarReview.issues[0]?.explanation ||
    (fillerCount > 0 && "Keep a steadier pace and avoid filler words.") ||
    (overlap < 0.45 && "Use the target sentence pattern more closely.") ||
    "Clear answer. Add one more detail next time.";

  return {
    original: titleCaseSentence(original),
    corrected: titleCaseSentence(grammarReview.corrected),
    explanation,
    errors,
    score: {
      grammar: grammarScore,
      fluency: fluencyScore,
      pronunciation: pronunciationScore,
    },
    analysisMode: "mock",
  };
}

module.exports = {
  analyzeWithMockCoach,
};

