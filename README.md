# AI English Speaking Trainer

Minimal full-stack speaking trainer built with React + Vite + TailwindCSS on the frontend and Node.js + Express on the backend.

## What it does

- 100 generated levels across five difficulty bands
- speaking loop: listen, speak, analyze, repeat
- instant grammar and fluency feedback
- localStorage progress with streaks and weakness tracking
- adaptive progression:
  - under `70` repeats the level
  - above `85` skips ahead faster
  - weak areas return every 3 levels
- optional OpenAI analysis when `OPENAI_API_KEY` is set

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

## Access from the same Wi-Fi

The app is configured for LAN access by default.

- frontend dev server listens on `0.0.0.0:5173`
- backend API listens on `0.0.0.0:4000`
- the frontend automatically calls the backend on the same machine hostname, so if you open the frontend from another device it will target that PC's port `4000`

Example on the same network:

- frontend: `http://192.168.100.50:5173`
- backend: `http://192.168.100.50:4000`

If another device still cannot connect, allow Windows Firewall access for ports `5173` and `4000`.

## Optional AI mode

Create `backend/.env` from `backend/.env.example` and set:

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5.2
```

Without an API key, the app still works with the built-in mock coach.
