import { useEffect, useState } from "react";

import Mic from "../components/Mic.jsx";

function StatChip({ label, value }) {
  return (
    <div className="rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-700 shadow-[0_8px_20px_rgba(34,24,16,0.04)]">
      {label} {value}
    </div>
  );
}

export default function Practice({
  error,
  level,
  loadingLevel,
  progress,
  submitting,
  apiBaseUrl,
  serverCapabilities,
  onReset,
  onRetry,
  onSubmit,
}) {
  const [audioState, setAudioState] = useState("idle");

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  function playListeningPrompt() {
    if (!level || !window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(level.listeningText);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    utterance.onstart = () => setAudioState("playing");
    utterance.onend = () => setAudioState("idle");
    utterance.onerror = () => setAudioState("idle");
    window.speechSynthesis.speak(utterance);
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-6 text-stone-900 sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col justify-center rounded-[2.2rem] border border-white/60 bg-white/78 p-6 shadow-[0_30px_120px_rgba(32,20,10,0.12)] backdrop-blur md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <StatChip label="Level" value={progress.level} />
            <StatChip label="Streak" value={progress.streak} />
            <StatChip label="Weak grammar" value={progress.weaknesses.grammar} />
          </div>

          <button
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-950"
            onClick={onReset}
            type="button"
          >
            Reset
          </button>
        </div>

        {loadingLevel ? (
          <div className="my-20 space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-stone-500">Loading</p>
            <h1 className="text-4xl font-semibold tracking-tight text-stone-900">Preparing your next speaking task</h1>
          </div>
        ) : !level ? (
          <div className="my-20 mx-auto max-w-2xl space-y-5 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-rose-700">Connection problem</p>
            <h1 className="text-4xl font-semibold tracking-tight text-stone-900">
              The practice level could not be loaded
            </h1>
            <p className="text-base text-stone-600">
              {error || "The frontend could not reach the backend API."}
            </p>
            <div className="rounded-[1.4rem] border border-stone-200 bg-stone-50/80 px-5 py-4 text-left text-sm text-stone-700">
              <p className="font-semibold text-stone-900">Quick check</p>
              <p className="mt-2">1. Start backend with `node app.js` inside the `backend` folder.</p>
              <p className="mt-1">2. Start the frontend dev server with `npm run dev` inside the `frontend` folder.</p>
              <p className="mt-1">3. Open the frontend URL on the same machine or Wi-Fi network. The Vite dev server will proxy `/api` to the local backend.</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                className="rounded-full bg-stone-950 px-6 py-4 text-base font-semibold text-stone-50 transition hover:bg-stone-800"
                onClick={onRetry}
                type="button"
              >
                Retry
              </button>
              <button
                className="rounded-full border border-stone-300 px-6 py-4 text-base font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-950"
                onClick={onReset}
                type="button"
              >
                Reset progress
              </button>
            </div>
            <p className="text-sm text-stone-500">API target: {apiBaseUrl}</p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
              <article className="overflow-hidden rounded-[2rem] border border-stone-200 bg-[linear-gradient(140deg,_rgba(255,248,240,0.98),_rgba(255,235,219,0.96)_40%,_rgba(255,255,255,0.98))] p-7 shadow-[0_24px_70px_rgba(44,30,16,0.08)]">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-stone-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-50">
                    {level.band}
                  </span>
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-700">
                    {level.topic}
                  </span>
                  {level.reviewMode && (
                    <span className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-950">
                      Review: {level.coachingFocus}
                    </span>
                  )}
                </div>

                <div className="mt-10 max-w-3xl">
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Speak now</p>
                  <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
                    {level.speaking}
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
                    Keep the sentence clear, confident, and natural.
                  </p>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Grammar focus</p>
                    <p className="mt-3 text-base font-medium leading-7 text-stone-900">{level.grammar}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/70 bg-stone-950 p-5 text-stone-50">
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-300">Progress rhythm</p>
                    <p className="mt-3 text-base leading-7 text-stone-50/90">
                      Score under 70 repeats this level. Score over 85 jumps you forward faster.
                    </p>
                  </div>
                </div>
              </article>

              <div className="grid gap-5">
                <article className="rounded-[1.8rem] border border-stone-200 bg-white/88 p-6 shadow-[0_18px_40px_rgba(34,24,16,0.06)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Listen first</p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">Shadow the model sentence</h2>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-[linear-gradient(135deg,rgba(255,207,172,0.95),rgba(255,140,54,0.95))]" />
                  </div>
                  <p className="mt-5 text-lg leading-8 text-stone-800">{level.listeningQuestion}</p>
                  <button
                    className="mt-6 rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-500 hover:bg-stone-50"
                    onClick={playListeningPrompt}
                    type="button"
                  >
                    {audioState === "playing" ? "Playing..." : "Play listening prompt"}
                  </button>
                  <p className="mt-4 text-sm text-stone-500">{level.listeningText}</p>
                </article>

                <article className="rounded-[1.8rem] border border-stone-200 bg-[linear-gradient(180deg,_rgba(240,248,255,0.92),_rgba(255,255,255,0.92))] p-6 shadow-[0_18px_40px_rgba(34,24,16,0.05)]">
                  <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Compatibility</p>
                  <div className="mt-4 grid gap-3 text-sm text-stone-700">
                    <p>Desktop browsers can use live mic when permission is allowed.</p>
                    <p>iPhone and Safari work best after HTTPS deploy on Vercel, with device-recorder fallback still available.</p>
                    <p>
                      This trainer runs in local-only mode with no API key.
                    </p>
                  </div>
                </article>
              </div>
            </div>

            <div className="mt-10 rounded-[2rem] border border-stone-200/80 bg-white/60 p-6 shadow-[0_20px_50px_rgba(34,24,16,0.05)]">
              <Mic
                disabled={submitting}
                onComplete={onSubmit}
                serverCapabilities={serverCapabilities}
              />
            </div>

            <div className="mt-6 min-h-6 text-center text-sm">
              {submitting && <p className="text-stone-600">Scoring your speaking right now...</p>}
              {error && <p className="text-rose-700">{error}</p>}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
