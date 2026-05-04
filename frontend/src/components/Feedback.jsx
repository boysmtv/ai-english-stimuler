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
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-4xl flex-col justify-center rounded-[2rem] border border-white/50 bg-white/80 p-6 shadow-[0_28px_90px_rgba(56,39,22,0.12)] backdrop-blur md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
          <span>Level {level.level}</span>
          <span>{progress.streak} streak</span>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-sm uppercase tracking-[0.28em] text-amber-700">{scoreTone(outcome.average)}</p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            {outcome.guidance}
          </h1>
          <p className="max-w-2xl text-base text-stone-600">{analysis.explanation}</p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {scoreCards.map(([label, value]) => (
            <div className="rounded-[1.6rem] border border-stone-200 bg-stone-50/80 p-4" key={label}>
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{label}</p>
              <p className="mt-3 text-3xl font-semibold text-stone-900">{value}</p>
            </div>
          ))}
        </div>

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

