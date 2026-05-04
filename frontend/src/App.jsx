import { startTransition, useEffect, useState } from "react";

import Feedback from "./components/Feedback.jsx";
import { analyzeAudioBlob } from "./lib/audioAnalysis.js";
import { analyzeAttempt, getApiBaseUrl, getHealth, getLevel } from "./lib/api.js";
import { createDefaultProgress, evaluateAttempt, loadProgress, saveProgress } from "./lib/progress.js";
import Practice from "./pages/Practice.jsx";

function App() {
  const [progress, setProgress] = useState(() => loadProgress());
  const [level, setLevel] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [recordingUrl, setRecordingUrl] = useState("");
  const [loadingLevel, setLoadingLevel] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [serverCapabilities, setServerCapabilities] = useState({
    localOnly: true,
    cloudCalls: false,
    audioMetrics: true,
    liveMicNeedsHttps: true,
    transcriptRequiredForGrammar: true,
  });

  async function loadLevel(levelNumber, focus) {
    setLoadingLevel(true);
    setError("");

    try {
      const [health, nextLevel] = await Promise.all([
        getHealth().catch(() => null),
        getLevel(levelNumber, focus),
      ]);

      startTransition(() => {
        setLevel(nextLevel);
        setFeedback(null);
        setOutcome(null);
      });

      if (health?.capabilities) {
        setServerCapabilities(health.capabilities);
      }
    } catch (loadError) {
      setLevel(null);
      setError(loadError.message || "Unable to load the next level.");
    } finally {
      setLoadingLevel(false);
    }
  }

  useEffect(() => {
    loadLevel(progress.level, progress.scheduledFocus);
  }, []);

  useEffect(() => {
    return () => {
      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl);
      }
    };
  }, [recordingUrl]);

  async function handleAttempt(recording) {
    if (!level) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const analysis = await analyzeAttempt({
        level,
        transcript: recording.transcript,
        audioMetrics: await analyzeAudioBlob(recording.audioBlob, recording.transcript),
      });

      const nextOutcome = evaluateAttempt(progress, analysis);
      saveProgress(nextOutcome.nextProgress);
      setProgress(nextOutcome.nextProgress);

      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl);
      }

      setRecordingUrl(recording.audioBlob ? URL.createObjectURL(recording.audioBlob) : "");
      setFeedback(analysis);
      setOutcome(nextOutcome);
    } catch (submissionError) {
      setError(submissionError.message || "Analysis failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleContinue() {
    if (!outcome) {
      return;
    }

    loadLevel(outcome.nextLevel, outcome.nextFocus);
  }

  function handleReset() {
    const freshProgress = createDefaultProgress();
    saveProgress(freshProgress);
    setProgress(freshProgress);

    if (recordingUrl) {
      URL.revokeObjectURL(recordingUrl);
    }

    setRecordingUrl("");
    loadLevel(freshProgress.level, null);
  }

  if (feedback && outcome && level) {
    return (
      <Feedback
        analysis={feedback}
        level={level}
        outcome={outcome}
        progress={progress}
        recordingUrl={recordingUrl}
        serverCapabilities={serverCapabilities}
        onContinue={handleContinue}
        onReset={handleReset}
      />
    );
  }

  return (
    <Practice
      error={error}
      level={level}
      loadingLevel={loadingLevel}
      progress={progress}
      submitting={submitting}
      apiBaseUrl={getApiBaseUrl()}
      serverCapabilities={serverCapabilities}
      onReset={handleReset}
      onRetry={() => loadLevel(progress.level, progress.scheduledFocus)}
      onSubmit={handleAttempt}
    />
  );
}

export default App;
