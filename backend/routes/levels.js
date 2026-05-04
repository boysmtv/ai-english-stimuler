const express = require("express");

const { getLevelPayload } = require("../services/apiService");

const router = express.Router();

router.get("/:id", (req, res, next) => {
  try {
    const level = getLevelPayload(req.params.id, {
      focus: req.query.focus,
    });

    return res.json(level);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
