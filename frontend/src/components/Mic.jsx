import { useEffect, useMemo, useRef, useState } from "react";

function buildRecorderConfig() {
  if (typeof window === "undefined" || !window.MediaRecorder) {
    return {
      mimeType: "",
      extension: "webm",
    };
  }

  const candidates = [
    ["audio/webm;codecs=opus", "webm"],
    ["audio/mp4", "m4a"],
    ["audio/webm", "webm"],
    ["audio/ogg;codecs=opus", "ogg"],
  ];

  for (const [mimeType, extension] of candidates) {
    if (window.MediaRecorder.isTypeSupported?.(mimeType)) {
      return { mimeType, extension };
    }
  }

  return {
    mimeType: "",
    extension: "webm",
  };
}

function isHttpsOrLocalhost() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.isSecureContext || ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

export default function Mic({ disabled, onComplete, serverCapabilities }) {
  const chunksRef = useRef([]);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const timeoutRef = useRef(null);
  const transcriptRef = useRef("");
  const fileInputRef = useRef(null);
  const audioUrlRef = useRef("");
  const capturedFileNameRef = useRef("");

  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [transcriptPreview, setTranscriptPreview] = useState("");
  const [captureLabel, setCaptureLabel] = useState("");
  const [pendingSource, setPendingSource] = useState("");

  const support = useMemo(() => {
    const hasWindow = typeof window !== "undefined";
    const canUseMediaDevices = Boolean(hasWindow && navigator.mediaDevices?.getUserMedia);
    const canUseMediaRecorder = Boolean(hasWindow && window.MediaRecorder);
    const secureContext = isHttpsOrLocalhost();
    const canUseLiveMic = canUseMediaDevices && canUseMediaRecorder && secureContext;

    return {
      canUseLiveMic,
      canUseMediaRecorder,
      secureContext,
    };
  }, []);

  function clearCapturedAudio() {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = "";
    }

    setAudioBlob(null);
    setAudioUrl("");
    setCaptureLabel("");
    setPendingSource("");
    capturedFileNameRef.current = "";
  }

  function updateCapturedAudio(nextBlob, fileName, sourceLabel) {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
    }

    const nextAudioUrl = URL.createObjectURL(nextBlob);

    audioUrlRef.current = nextAudioUrl;
    capturedFileNameRef.current = fileName;
    setAudioBlob(nextBlob);
    setAudioUrl(nextAudioUrl);
    setCaptureLabel(fileName);
    setPendingSource(sourceLabel);
  }

  function stopRecording() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  }

  async function startRecording() {
    if (disabled || isProcessing) {
      return;
    }

    if (!support.canUseLiveMic) {
      setError(
        support.secureContext
          ? "Live recording is limited in this browser. Use device recorder below."
          : "Live microphone needs HTTPS or localhost in many mobile browsers. Use device recorder below.",
      );
      return;
    }

    setError("");
    clearCapturedAudio();
    setTranscriptPreview("");
    transcriptRef.current = "";

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorderConfig = buildRecorderConfig();

      const recorder = recorderConfig.mimeType
        ? new MediaRecorder(stream, { mimeType: recorderConfig.mimeType })
        : new MediaRecorder(stream);

      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        setIsRecording(false);

        const audioBlob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        updateCapturedAudio(audioBlob, `speaking-attempt.${recorderConfig.extension}`, "Live capture");
      };

      recorder.start();
      setIsRecording(true);

      timeoutRef.current = setTimeout(() => {
        stopRecording();
      }, 12000);
    } catch (recordingError) {
      setError(recordingError.message || "Microphone access was blocked.");
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }

  function openDeviceRecorder() {
    if (disabled || isProcessing) {
      return;
    }

    setError("");
    fileInputRef.current?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    clearCapturedAudio();
    updateCapturedAudio(file, file.name || "voice-note.m4a", "Device recorder");

    if (!transcriptRef.current.trim()) {
      setTranscriptPreview("");
    }

    event.target.value = "";
  }

  async function handleAnalyze() {
    if (disabled || isProcessing || (!audioBlob && !transcriptRef.current.trim())) {
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      await onComplete({
        audioBlob,
        transcript: transcriptRef.current.trim(),
      });
    } finally {
      setIsProcessing(false);
    }
  }

  function handleTranscriptChange(event) {
    const value = event.target.value;
    transcriptRef.current = value;
    setTranscriptPreview(value);
  }

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      clearCapturedAudio();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const buttonLabel = isRecording ? "Stop" : "Speak";
  const buttonStatus = isProcessing
    ? "Analyzing your answer..."
    : isRecording
      ? "Listening for up to 12 seconds..."
      : support.canUseLiveMic
        ? "Tap once, speak, then tap stop."
        : "Use live mic on secure browsers, or switch to the device recorder below.";

  const captureHint = serverCapabilities.localOnly
    ? "Local-only mode is active. Audio stays on your device and only metrics plus text are scored."
    : "Coach mode is active.";

  return (
    <div className="space-y-5">
      <input
        accept="audio/*,.m4a,.mp3,.wav,.webm"
        capture
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file"
      />

      <div className="rounded-[1.8rem] border border-stone-200/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.95),rgba(255,244,236,0.88))] p-5 shadow-[0_25px_60px_rgba(34,24,16,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Voice input</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">Speak naturally, then review fast</h2>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em]">
            <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
              {support.secureContext ? "Secure mic ready" : "HTTPS needed for live mic"}
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-2 text-amber-900">
              {serverCapabilities.transcriptRequiredForGrammar ? "Transcript needed for grammar" : "Transcript optional"}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.6rem] bg-[radial-gradient(circle_at_top,_rgba(255,206,176,0.94),rgba(236,106,24,0.94))] p-6 text-stone-950 shadow-[0_30px_70px_rgba(227,100,20,0.28)]">
            <button
              className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border border-white/70 bg-white/25 text-2xl font-semibold tracking-wide backdrop-blur transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={disabled || isProcessing}
              onClick={isRecording ? stopRecording : startRecording}
              type="button"
            >
              {buttonLabel}
            </button>

            <p className="mt-5 text-center text-sm font-medium text-stone-900/80">{buttonStatus}</p>
            <p className="mt-3 text-center text-sm text-stone-900/75">{captureHint}</p>
          </div>

          <div className="rounded-[1.6rem] border border-stone-200 bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Fallback for iPhone and Safari</p>
            <p className="mt-3 text-sm leading-6 text-stone-700">
              If live mic is blocked on mobile, use the device recorder. Then type the sentence you said for local grammar coaching.
            </p>
            <button
              className="mt-5 w-full rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:border-stone-500 hover:bg-stone-50"
              disabled={disabled || isProcessing}
              onClick={openDeviceRecorder}
              type="button"
            >
              Use device recorder
            </button>

            <div className="mt-5 grid gap-2 text-sm text-stone-600">
              <p>1. Record or upload your voice note.</p>
              <p>2. Review the transcript if needed.</p>
              <p>3. Tap Analyze answer.</p>
            </div>
          </div>
        </div>
      </div>

      {(audioBlob || transcriptPreview) && (
        <div className="rounded-[1.8rem] border border-stone-200/80 bg-white/85 p-5 shadow-[0_18px_45px_rgba(34,24,16,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Review before scoring</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">
                {captureLabel || "Transcript or audio ready"}
              </h3>
            </div>
            {pendingSource && (
              <span className="rounded-full bg-stone-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700">
                {pendingSource}
              </span>
            )}
          </div>

          {audioUrl && (
            <audio className="mt-5 w-full" controls src={audioUrl} />
          )}

          <label className="mt-5 block text-sm font-semibold text-stone-700">
            Transcript
            <textarea
              className="mt-2 min-h-28 w-full rounded-[1.2rem] border border-stone-200 bg-stone-50/80 px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-stone-400"
              onChange={handleTranscriptChange}
              placeholder="Type the sentence you just said. In strict local-only mode, this text drives grammar correction while the browser measures pace and pauses from the audio."
              value={transcriptPreview}
            />
          </label>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              className="rounded-full bg-stone-950 px-6 py-4 text-base font-semibold text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={disabled || isProcessing || (!audioBlob && !transcriptPreview.trim())}
              onClick={handleAnalyze}
              type="button"
            >
              Analyze answer
            </button>
            <button
              className="rounded-full border border-stone-300 px-6 py-4 text-base font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-950"
              disabled={disabled || isRecording || isProcessing}
              onClick={() => {
                clearCapturedAudio();
                transcriptRef.current = "";
                setTranscriptPreview("");
                setError("");
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              type="button"
            >
              Clear take
            </button>
          </div>
        </div>
      )}

      {!support.secureContext && (
        <div className="rounded-[1.4rem] border border-sky-200 bg-sky-50/80 px-4 py-3 text-sm text-sky-900">
          Browser microphone APIs generally require HTTPS or localhost. Phones on plain `http://192.168.x.x` may need the device-recorder fallback instead of live mic.
        </div>
      )}

      {error && <p className="text-center text-sm text-amber-700">{error}</p>}
    </div>
  );
}
