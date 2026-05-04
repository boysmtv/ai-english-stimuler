const fs = require("fs");
const path = require("path");

const { buildLevelCatalog } = require("./levelTemplates");

const dataPath = path.join(__dirname, "..", "data", "levels.json");

let cachedLevels = [];

function ensureLevelData() {
  const generatedLevels = buildLevelCatalog();

  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(generatedLevels, null, 2));
  }

  try {
    const raw = fs.readFileSync(dataPath, "utf8");
    const parsed = JSON.parse(raw);

    cachedLevels = Array.isArray(parsed) && parsed.length === 100 ? parsed : generatedLevels;

    if (cachedLevels !== parsed) {
      fs.writeFileSync(dataPath, JSON.stringify(generatedLevels, null, 2));
    }
  } catch (_error) {
    cachedLevels = generatedLevels;
    fs.writeFileSync(dataPath, JSON.stringify(generatedLevels, null, 2));
  }

  return cachedLevels;
}

function adaptLevel(level, focus) {
  if (!focus) {
    return level;
  }

  const focusCopy = { ...level, reviewMode: true, coachingFocus: focus };

  if (focus === "grammar") {
    return {
      ...focusCopy,
      speaking: `${level.speaking} Focus on clean verb forms and full sentences.`,
      grammar: `${level.grammar} Extra focus: keep the structure accurate.`,
    };
  }

  if (focus === "fluency") {
    return {
      ...focusCopy,
      speaking: `${level.speaking} Say it in one smooth flow without long pauses.`,
      listeningQuestion: `${level.listeningQuestion} Keep your rhythm steady.`,
    };
  }

  if (focus === "pronunciation") {
    return {
      ...focusCopy,
      speaking: `${level.speaking} Slow down slightly and say each key word clearly.`,
      listeningQuestion: `${level.listeningQuestion} Repeat the keywords with clear stress.`,
    };
  }

  if (focus === "listening") {
    return {
      ...focusCopy,
      listeningQuestion: `${level.listeningQuestion} Answer using one complete sentence.`,
    };
  }

  return level;
}

function getLevelById(id, options = {}) {
  if (!cachedLevels.length) {
    ensureLevelData();
  }

  const level = cachedLevels.find((entry) => entry.level === id);

  if (!level) {
    return null;
  }

  return adaptLevel(level, options.focus);
}

module.exports = {
  ensureLevelData,
  getLevelById,
};

