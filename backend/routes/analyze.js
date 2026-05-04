const express = require("express");

const { getAnalysisPayload } = require("../services/apiService");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const analysis = await getAnalysisPayload(req.body || {});
    return res.json(analysis);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
