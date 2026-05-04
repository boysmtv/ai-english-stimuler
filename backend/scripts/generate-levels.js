const fs = require("fs");
const path = require("path");

const { buildLevelCatalog } = require("../services/levelTemplates");

const outputPath = path.join(__dirname, "..", "data", "levels.json");
const levels = buildLevelCatalog();

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(levels, null, 2));

console.log(`Generated ${levels.length} levels at ${outputPath}`);

