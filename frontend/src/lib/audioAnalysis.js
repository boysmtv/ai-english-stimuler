function averageChannels(audioBuffer) {
  const channelCount = audioBuffer.numberOfChannels;
  const sampleCount = audioBuffer.length;
  const mono = new Float32Array(sampleCount);

  for (let channel = 0; channel < channelCount; channel += 1) {
    const data = audioBuffer.getChannelData(channel);

    for (let index = 0; index < sampleCount; index += 1) {
      mono[index] += data[index] / channelCount;
    }
  }

  return mono;
}

export async function analyzeAudioBlob(audioBlob, transcript = "") {
  if (!audioBlob || typeof window === "undefined") {
    return null;
  }

  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextCtor) {
    return null;
  }

  const context = new AudioContextCtor();

  try {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await context.decodeAudioData(arrayBuffer.slice(0));
    const mono = averageChannels(audioBuffer);
    const frameSize = 2048;
    const hopSize = 1024;
    const frameRms = [];
    let peakLevel = 0;
    let sumSquares = 0;
    let clippedSamples = 0;

    for (let i = 0; i < mono.length; i += 1) {
      const absolute = Math.abs(mono[i]);
      peakLevel = Math.max(peakLevel, absolute);
      sumSquares += mono[i] * mono[i];

      if (absolute > 0.98) {
        clippedSamples += 1;
      }
    }

    for (let start = 0; start + frameSize <= mono.length; start += hopSize) {
      let frameSquares = 0;

      for (let i = start; i < start + frameSize; i += 1) {
        frameSquares += mono[i] * mono[i];
      }

      frameRms.push(Math.sqrt(frameSquares / frameSize));
    }

    const averageRms = Math.sqrt(sumSquares / Math.max(1, mono.length));
    const threshold = Math.max(0.012, averageRms * 0.42);
    const frameDuration = hopSize / audioBuffer.sampleRate;

    let speechFrames = 0;
    let pauseCount = 0;
    let currentSilence = 0;
    let inSpeech = false;

    for (const rms of frameRms) {
      if (rms >= threshold) {
        speechFrames += 1;

        if (currentSilence >= 0.25 && inSpeech) {
          pauseCount += 1;
        }

        currentSilence = 0;
        inSpeech = true;
      } else {
        currentSilence += frameDuration;
      }
    }

    const durationSeconds = audioBuffer.duration;
    const silenceRatio = frameRms.length ? 1 - speechFrames / frameRms.length : 1;
    const speechRatio = frameRms.length ? speechFrames / frameRms.length : 0;
    const wordCount = String(transcript).trim().split(/\s+/).filter(Boolean).length;
    const wordsPerMinute =
      durationSeconds > 0 && wordCount > 0 ? (wordCount / durationSeconds) * 60 : 0;

    return {
      durationSeconds: Number(durationSeconds.toFixed(2)),
      averageRms: Number(averageRms.toFixed(4)),
      peakLevel: Number(peakLevel.toFixed(4)),
      clippingRatio: Number((clippedSamples / Math.max(1, mono.length)).toFixed(4)),
      silenceRatio: Number(silenceRatio.toFixed(4)),
      speechRatio: Number(speechRatio.toFixed(4)),
      pauseCount,
      wordsPerMinute: Number(wordsPerMinute.toFixed(1)),
    };
  } catch (_error) {
    return null;
  } finally {
    await context.close().catch(() => {});
  }
}
