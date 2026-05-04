# AI English Speaking Trainer

Minimal full-stack speaking trainer built with React + Vite + TailwindCSS on the frontend and Node.js + Express on the backend.

## What it does

- 100 generated levels across five difficulty bands
- speaking loop: listen, speak, analyze, repeat
- instant grammar and fluency feedback
- local-only grammar coach and local voice-delivery analysis
- localStorage progress with streaks and weakness tracking
- adaptive progression:
  - under `70` repeats the level
  - above `85` skips ahead faster
  - weak areas return every 3 levels

## Run it

### Backend

```bash
cd backend
npm install
node app.js
```

Runs on `http://localhost:4000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

## Local development flow

- The frontend calls relative `/api` endpoints.
- During local development, Vite proxies `/api` to `http://localhost:4000`.
- This keeps the local flow close to production while staying light on your PC.

Local test order:

1. Start the backend in `backend`
2. Start the frontend in `frontend`
3. Open `http://localhost:5173` or the LAN URL from Vite

Because the proxy runs inside Vite, phones on the same Wi-Fi only need to reach the frontend dev server.

## Access from the same Wi-Fi

The app is configured for LAN access by default.

- frontend dev server listens on `0.0.0.0:5173`
- backend API listens on `0.0.0.0:4000`
- the frontend now uses `/api`, and Vite forwards those calls to the local backend during development

Example on the same network:

- frontend: `http://192.168.100.50:5173`
- backend: `http://192.168.100.50:4000`

If another device still cannot connect, allow Windows Firewall access for ports `5173` and `4000`.

## Deploy to Vercel

This repository is now prepared for Vercel with:

- root `api` functions for `/api/health`, `/api/level/:id`, and `/api/analyze`
- a root `vercel.json`
- production frontend requests that stay on same-origin `/api`

The current `vercel.json` builds the Vite frontend from `frontend` and serves `frontend/dist` as the static output:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build --prefix frontend",
  "installCommand": "npm install --prefix frontend",
  "outputDirectory": "frontend/dist"
}
```

After deploy, the app automatically uses:

- frontend: your Vercel domain
- backend: the same Vercel domain under `/api`

## Local-only mode

- No API key is required.
- No cloud speech-to-text is used.
- Audio stays in the browser for playback and local voice metrics.
- The backend receives only the typed transcript and lightweight audio metrics for scoring.

## Cross-device note

- Desktop browsers can use the live mic directly when permission is granted.
- iPhone and Safari may block live mic on plain LAN `http://` pages because browser mic APIs often need HTTPS or localhost.
- For those devices, use the built-in device-recorder fallback, then type the sentence you said.
