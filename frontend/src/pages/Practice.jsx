import { useEffect, useState } from "react";

import Mic from "../components/Mic.jsx";

function StatChip({ label, value }) {
  return (
    <div className="rounded-full border border-white/60 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-600">
      {label} {value}
    </div>
  );
}

export default function Practice({ error, level, loadingLevel, progress, submitting, onReset, onSubmit }) {
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
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col justify-center rounded-[2rem] border border-white/50 bg-white/80 p-6 shadow-[0_28px_90px_rgba(56,39,22,0.12)] backdrop-blur md:p-8">
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

        {loadingLevel || !level ? (
          <div className="my-20 space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-stone-500">Loading</p>
            <h1 className="text-4xl font-semibold tracking-tight text-stone-900">Preparing your next speaking task</h1>
          </div>
        ) : (
          <>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-900">
                {level.band}
              </span>
              <span className="rounded-full bg-stone-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-700">
                {level.topic}
              </span>
              {level.reviewMode && (
                <span className="rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-50">
                  Focus review: {level.coachingFocus}
                </span>
              )}
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
              <article className="rounded-[1.8rem] border border-stone-200 bg-[linear-gradient(135deg,_rgba(255,246,236,0.9),_rgba(255,255,255,0.9))] p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Speak now</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                  {level.speaking}
                </h1>
                <p className="mt-6 text-base text-stone-600">Grammar: {level.grammar}</p>
              </article>

              <article className="rounded-[1.8rem] border border-stone-200 bg-white/70 p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Listen first</p>
                <p className="mt-3 text-lg text-stone-800">{level.listeningQuestion}</p>
                <button
                  className="mt-6 rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-500"
                  onClick={playListeningPrompt}
                  type="button"
                >
                  {audioState === "playing" ? "Playing..." : "Play listening prompt"}
                </button>
                <p className="mt-4 text-sm text-stone-500">{level.listeningText}</p>
              </article>
            </div>

            <div className="mt-10 rounded-[2rem] border border-stone-200 bg-white/60 p-6">
              <Mic disabled={submitting} onComplete={onSubmit} />
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

