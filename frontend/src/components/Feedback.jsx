function scoreTone(value) {
  if (value >= 86) {
    return "Excellent";
  }

  if (value >= 70) {
    return "Solid";
  }

  return "Repeat";
}

export default function Feedback({
  analysis,
  level,
  outcome,
  progress,
  recordingUrl,
  serverCapabilities,
  onContinue,
  onReset,
}) {
  const scoreCards = [
    ["Grammar", analysis.score.grammar],
    ["Fluency", analysis.score.fluency],
    ["Pronunciation", analysis.score.pronunciation],
  ];

  return (
    <main className="min-h-screen bg-transparent px-4 py-6 text-stone-900 sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col justify-center rounded-[2.2rem] border border-white/50 bg-white/82 p-6 shadow-[0_28px_90px_rgba(56,39,22,0.12)] backdrop-blur md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
          <span>Level {level.level}</span>
          <span>{progress.streak} streak</span>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.9rem] bg-[linear-gradient(140deg,_rgba(255,247,238,0.98),_rgba(255,229,206,0.96)_40%,_rgba(255,255,255,0.98))] p-6 shadow-[0_20px_55px_rgba(34,24,16,0.08)]">
            <p className="text-sm uppercase tracking-[0.28em] text-amber-700">{scoreTone(outcome.average)}</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              {outcome.guidance}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700">{analysis.explanation}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-stone-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-50">
                {analysis.analysisMode}
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-700">
                {analysis.transcriptSource || "text-analysis"}
              </span>
              <span className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-950">
                {serverCapabilities.localOnly ? "Local-only coach" : "Coach mode"}
              </span>
            </div>
          </div>

          <div className="rounded-[1.9rem] border border-stone-200 bg-white/90 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Next move</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">{outcome.actionLabel}</p>
            <p className="mt-4 text-sm leading-7 text-stone-700">
              Keep the loop fast: listen, speak, review, repeat. Weak areas will come back automatically as spaced review.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {scoreCards.map(([label, value]) => (
            <div className="rounded-[1.6rem] border border-stone-200 bg-white/82 p-4 shadow-[0_12px_30px_rgba(34,24,16,0.04)]" key={label}>
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{label}</p>
              <p className="mt-3 text-3xl font-semibold text-stone-900">{value}</p>
            </div>
          ))}
        </div>

        {analysis.voiceMetrics && (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.6rem] border border-stone-200 bg-stone-50/80 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Duration</p>
              <p className="mt-3 text-2xl font-semibold text-stone-900">{analysis.voiceMetrics.durationSeconds}s</p>
            </div>
            <div className="rounded-[1.6rem] border border-stone-200 bg-stone-50/80 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Pace</p>
              <p className="mt-3 text-2xl font-semibold text-stone-900">{analysis.voiceMetrics.wordsPerMinute} wpm</p>
            </div>
            <div className="rounded-[1.6rem] border border-stone-200 bg-stone-50/80 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Pauses</p>
              <p className="mt-3 text-2xl font-semibold text-stone-900">{analysis.voiceMetrics.pauseCount}</p>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-[1.6rem] border border-stone-200 bg-white/80 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">You said</p>
            <p className="mt-3 text-lg text-stone-800">{analysis.original || "No transcript captured."}</p>
          </article>

          <article className="rounded-[1.6rem] border border-amber-200 bg-amber-50/70 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-800">Better version</p>
            <p className="mt-3 text-lg text-stone-900">{analysis.corrected}</p>
          </article>
        </div>

        {analysis.errors.length > 0 && (
          <div className="mt-6 rounded-[1.6rem] border border-stone-200 bg-white/70 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Fix next time</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {analysis.errors.map((error) => (
                <span
                  className="rounded-full bg-stone-900 px-3 py-1 text-sm text-stone-50"
                  key={error}
                >
                  {error}
                </span>
              ))}
            </div>
          </div>
        )}

        {recordingUrl && (
          <div className="mt-6 rounded-[1.6rem] border border-stone-200 bg-white/80 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Replay</p>
            <audio className="mt-3 w-full" controls src={recordingUrl} />
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            className="rounded-full bg-stone-950 px-6 py-4 text-base font-semibold text-stone-50 transition hover:bg-stone-800"
            onClick={onContinue}
            type="button"
          >
            {outcome.actionLabel}
          </button>

          <button
            className="rounded-full border border-stone-300 px-6 py-4 text-base font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-950"
            onClick={onReset}
            type="button"
          >
            Reset progress
          </button>
        </div>
      </section>
    </main>
  );
}
