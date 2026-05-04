const express = require("express");

const { getLevelById } = require("../services/levelService");

const router = express.Router();

router.get("/:id", (req, res) => {
  const levelId = Number(req.params.id);
  const focus = typeof req.query.focus === "string" ? req.query.focus : null;
  const level = getLevelById(levelId, { focus });

  if (!level) {
    return res.status(404).json({
      message: `Level ${levelId} was not found.`,
    });
  }

  return res.json(level);
});

module.exports = router;

