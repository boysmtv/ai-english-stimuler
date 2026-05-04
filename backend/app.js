require("dotenv").config();

const cors = require("cors");
const express = require("express");
const os = require("os");

const analyzeRouter = require("./routes/analyze");
const levelsRouter = require("./routes/levels");
const { getHealthPayload } = require("./services/apiService");
const { ensureLevelData } = require("./services/levelService");

const app = express();
const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 4000);
const apiRouter = express.Router();

ensureLevelData();

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json({ limit: "2mb" }));

apiRouter.get("/health", (_req, res) => {
  res.json(getHealthPayload());
});
apiRouter.use("/level", levelsRouter);
apiRouter.use("/analyze", analyzeRouter);

app.use("/api", apiRouter);
app.get("/health", (_req, res) => {
  res.json(getHealthPayload());
});
app.use("/level", levelsRouter);
app.use("/analyze", analyzeRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Unexpected server error.",
  });
});

function getNetworkUrls(serverHost, serverPort) {
  const interfaces = os.networkInterfaces();
  const urls = [];

  for (const entries of Object.values(interfaces)) {
    for (const entry of entries || []) {
      if (entry.family === "IPv4" && !entry.internal) {
        urls.push(`http://${entry.address}:${serverPort}`);
      }
    }
  }

  const localhostUrl =
    serverHost === "0.0.0.0" ? `http://localhost:${serverPort}` : `http://${serverHost}:${serverPort}`;

  return [localhostUrl, ...new Set(urls)];
}

app.listen(port, host, () => {
  const urls = getNetworkUrls(host, port);

  console.log("AI English Speaking Trainer backend running on:");
  urls.forEach((url) => {
    console.log(`- ${url}`);
  });
});
