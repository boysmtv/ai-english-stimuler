const express = require("express");
const multer = require("multer");

const { analyzeAttempt } = require("../services/analyzerService");
const { getLevelById } = require("../services/levelService");
const { transcribeAttempt } = require("../services/transcriptionService");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post("/", upload.single("audio"), async (req, res, next) => {
  try {
    const levelId = Number(req.body.levelId);
    const level = getLevelById(levelId);

    if (!level) {
      return res.status(404).json({
        message: `Level ${levelId} was not found.`,
      });
    }

    const transcription = transcribeAttempt({
      level,
      providedTranscript: req.body.transcript,
      file: req.file,
    });

    const analysis = await analyzeAttempt({
      transcript: transcription.text,
      level,
    });

    return res.json({
      ...analysis,
      transcriptSource: transcription.source,
      level: {
        id: level.level,
        topic: level.topic,
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

