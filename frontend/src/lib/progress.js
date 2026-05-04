const STORAGE_KEY = "ai-speaking-trainer-progress";

export function createDefaultProgress() {
  return {
    level: 1,
    streak: 0,
    scheduledFocus: null,
    averageScore: 0,
    weaknesses: {
      grammar: 0,
      fluency: 0,
      pronunciation: 0,
    },
  };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return createDefaultProgress();
    }

    const parsed = JSON.parse(raw);

    return {
      ...createDefaultProgress(),
      ...parsed,
      weaknesses: {
        ...createDefaultProgress().weaknesses,
        ...(parsed.weaknesses || {}),
      },
    };
  } catch (_error) {
    return createDefaultProgress();
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function averageScore(score) {
  return Math.round((score.grammar + score.fluency + score.pronunciation) / 3);
}

function strongestNeed(weaknesses) {
  return Object.entries(weaknesses).sort((left, right) => right[1] - left[1])[0]?.[0] || null;
}

function clampLevel(level) {
  return Math.max(1, Math.min(100, level));
}

export function evaluateAttempt(progress, analysis) {
  const average = averageScore(analysis.score);

  const weaknesses = {
    grammar:
      progress.weaknesses.grammar + (analysis.score.grammar < 80 || analysis.errors.length > 0 ? 1 : 0),
    fluency:
      progress.weaknesses.fluency + (analysis.score.fluency < 80 || analysis.score.pronunciation < 78 ? 1 : 0),
    pronunciation:
      progress.weaknesses.pronunciation + (analysis.score.pronunciation < 80 ? 1 : 0),
  };

  let nextLevel = progress.level;
  let actionLabel = "Repeat level";
  let guidance = "Repeat this level and tighten the sentence.";
  let streak = 0;

  if (average < 70) {
    nextLevel = progress.level;
    streak = 0;
  } else if (average > 85) {
    nextLevel = clampLevel(progress.level + 2);
    streak = progress.streak + 1;
    actionLabel = `Jump to level ${nextLevel}`;
    guidance = "Strong answer. The trainer is moving you faster.";
  } else {
    nextLevel = clampLevel(progress.level + 1);
    streak = progress.streak + 1;
    actionLabel = nextLevel === 100 ? "Finish level 100" : `Go to level ${nextLevel}`;
    guidance = "Good work. Keep the rhythm and move ahead.";
  }

  const crossedReviewGate =
    Math.floor((progress.level - 1) / 3) !== Math.floor((nextLevel - 1) / 3);
  const nextFocus = crossedReviewGate ? strongestNeed(weaknesses) : null;

  const nextProgress = {
    ...progress,
    level: nextLevel,
    streak,
    scheduledFocus: nextFocus,
    averageScore: average,
    weaknesses,
  };

  return {
    average,
    actionLabel,
    guidance,
    nextFocus,
    nextLevel,
    nextProgress,
  };
}

