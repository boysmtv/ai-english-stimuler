import { useEffect, useRef, useState } from "react";

const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;

function buildRecorderMimeType() {
  if (window.MediaRecorder?.isTypeSupported?.("audio/webm;codecs=opus")) {
    return "audio/webm;codecs=opus";
  }

  return "audio/webm";
}

export default function Mic({ disabled, onComplete }) {
  const chunksRef = useRef([]);
  const recorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);
  const timeoutRef = useRef(null);
  const transcriptRef = useRef("");

  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcriptPreview, setTranscriptPreview] = useState("");

  function stopRecording() {
    recognitionRef.current?.stop();

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

    setError("");
    setTranscriptPreview("");
    transcriptRef.current = "";

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, {
        mimeType: buildRecorderMimeType(),
      });

      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        setIsRecording(false);
        setIsProcessing(true);

        const audioBlob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        try {
          await onComplete({
            audioBlob,
            transcript: transcriptRef.current.trim(),
          });
        } finally {
          setIsProcessing(false);
        }
      };

      if (SpeechRecognitionApi) {
        const recognition = new SpeechRecognitionApi();
        recognition.lang = "en-US";
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          const text = Array.from(event.results)
            .map((result) => result[0]?.transcript || "")
            .join(" ")
            .trim();

          transcriptRef.current = text;
          setTranscriptPreview(text);
        };

        recognition.onerror = () => {
          setError("Voice transcript is limited in this browser. Audio was still recorded.");
        };

        recognitionRef.current = recognition;
        recognition.start();
      } else {
        setError("Speech recognition is not supported here. Chrome or Edge will work best.");
      }

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

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());

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
      : "Tap once, speak, then tap stop.";

  return (
    <div className="space-y-4">
      <button
        className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border border-white/60 bg-[radial-gradient(circle_at_top,_#ffd3ad,_#e86923)] text-2xl font-semibold tracking-wide text-stone-950 shadow-[0_24px_70px_rgba(227,100,20,0.28)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled || isProcessing}
        onClick={isRecording ? stopRecording : startRecording}
        type="button"
      >
        {buttonLabel}
      </button>

      <p className="text-center text-sm text-stone-600">{buttonStatus}</p>

      {transcriptPreview && (
        <div className="rounded-3xl border border-stone-200 bg-white/70 px-4 py-3 text-sm text-stone-700">
          {transcriptPreview}
        </div>
      )}

      {error && <p className="text-center text-sm text-amber-700">{error}</p>}
    </div>
  );
}

