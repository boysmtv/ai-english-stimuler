# AI English Speaking Trainer - Brief v1

## Goal

Evolve the existing AI English Speaking Trainer into a browser-compatible speaking practice app that works reliably across desktop browsers, Android browsers, and iOS browsers. The app should keep the current local-first learning loop while improving device compatibility, microphone handling, speaker/playback behavior, and fallback flows when browser permissions or platform restrictions block the ideal experience.

## Existing Project Source Of Truth

This is an existing project and must be evolved from its real files:

- Frontend: React + Vite + Tailwind in `frontend`.
- Local backend: Node.js + Express in `backend`.
- Deploy backend: Vercel Functions in `api`.
- Current learning flow: listen, speak, analyze, repeat.
- Current scoring mode: local-only rule-based coaching plus browser audio metrics.
- Current progress mode: `localStorage`.

Templates or scaffold examples may be used only as references. Do not replace the project with a generic React, Node, Vercel, or language-learning scaffold.

## Primary Use Cases

- Learner opens the app from desktop, Android, or iOS browser.
- Learner listens to a model sentence through browser audio/speaker playback.
- Learner records a speaking attempt with the device microphone when supported.
- Learner can still complete a level when live microphone APIs are blocked.
- Learner receives feedback for grammar, fluency, pronunciation/delivery, and next-step progression.
- Learner progress survives browser refreshes and normal app restarts.
- App can run locally on a PC and be opened from another device on the same Wi-Fi.
- App can also be deployed to Vercel with same-origin `/api` endpoints.

## Compatibility Target

The app should support these browser/device classes:

- Windows desktop:
  - Chrome
  - Edge
  - Firefox
- Android:
  - Chrome for Android
  - Samsung Internet where possible
  - Android WebView-like browser behavior where practical
- iOS/iPadOS:
  - Safari
  - Chrome on iOS
  - Edge on iOS

Because iOS browsers share WebKit limitations, the app must not assume that live mic capture behaves the same as desktop Chrome.

## Device Permission Requirements

The app must handle permission and browser capability states explicitly:

- Microphone permission:
  - Detect whether `navigator.mediaDevices.getUserMedia` is available.
  - Detect whether `MediaRecorder` is available.
  - Detect whether the page is in a secure context.
  - Request mic permission only after a direct user action.
  - Show a recoverable state when permission is denied, dismissed, unavailable, or blocked by browser policy.
- Speaker/audio playback:
  - Use user-triggered playback for listening prompts.
  - Handle browser autoplay restrictions.
  - Keep playback controls usable on mobile.
  - Stop or reset speech synthesis/audio playback when changing screens.
- Device recorder fallback:
  - Provide upload/capture fallback for mobile browsers that block live mic on plain LAN HTTP.
  - Accept common mobile audio formats such as `m4a`, `mp3`, `wav`, `webm`, and `ogg`.
  - Preserve the current manual transcript fallback for grammar scoring.
- Secure context behavior:
  - Live mic should work on `localhost` where browser allows it.
  - LAN HTTP access may not support live mic on many mobile browsers, especially iOS.
  - The app should explain the fallback inside the workflow without requiring the user to understand browser internals.

## Learning Flow

The core v1 flow should remain:

1. Load the learner's current level.
2. Show the speaking task, grammar focus, and listening prompt.
3. Let the learner play the prompt.
4. Let the learner record with live mic when available.
5. Offer device-recorder/upload fallback when live mic is unavailable.
6. Let the learner type or correct the transcript.
7. Analyze the attempt using local scoring.
8. Show corrected sentence, explanation, errors, voice metrics, and next action.
9. Update local progress and schedule weak-area review.

## Backend Scope

The backend should continue supporting:

- `GET /api/health`
- `GET /api/level/:id`
- `POST /api/analyze`

The local Express backend and Vercel Functions should stay behaviorally aligned. Shared scoring and level logic should remain in reusable backend service modules where practical.

## Frontend Scope

The frontend should improve compatibility and resilience around:

- Capability detection.
- Permission-specific error states.
- Audio recording format selection.
- iOS and Android fallback flows.
- Speaker/playback controls.
- Small-screen layout.
- Recovery from failed API requests.
- Progress persistence and reset.

The app should remain a usable learning application as the first screen, not a marketing or landing page.

## Local-Only Mode

v1 should keep the current privacy posture:

- No API key required.
- No cloud speech-to-text required.
- Audio stays in the browser for local playback and browser-side metrics.
- Backend receives only transcript text and lightweight audio metrics.
- OpenAI or other cloud coaching may exist only as future optional mode, not required for v1.

## Network And Deployment Scope

- Local development:
  - Frontend Vite server on `0.0.0.0:5173`.
  - Backend Express server on `0.0.0.0:4000`.
  - Frontend calls relative `/api` and uses Vite proxy locally.
- Same Wi-Fi access:
  - Other devices should be able to open `http://<host-ip>:5173`.
  - Backend should remain reachable through frontend `/api` proxy during development.
  - Windows Firewall instructions should be documented for ports `5173` and `4000`.
- Vercel deployment:
  - Frontend builds from `frontend`.
  - API functions run under same-origin `/api`.
  - HTTPS deployment should be the preferred path for full mobile mic compatibility.

## Deliverables

- Updated brief v1 for the project.
- Compatibility improvements for mic, speaker, and fallback flows.
- Validation of core API behavior.
- Frontend lint/build cleanup where needed.
- README updates explaining:
  - local run,
  - same-Wi-Fi access,
  - browser compatibility expectations,
  - iOS/Android mic limitations,
  - fallback device-recorder flow.

## Acceptance Criteria

- Existing app behavior is preserved: listen, speak, analyze, repeat.
- Frontend build passes.
- Frontend lint passes or has documented, intentional exceptions.
- Backend health, level, and analyze flows return valid payloads.
- Desktop Chrome/Edge can use live mic on `localhost`.
- Android Chrome can use live mic where browser and secure context allow it.
- iOS Safari has a usable fallback path when live mic is blocked.
- Listening prompt playback is user-triggered and works without autoplay assumptions.
- Permission denied/unavailable states do not dead-end the learner.
- LAN usage is documented, including the limitation that mobile live mic may require HTTPS.
- Vercel HTTPS deployment remains compatible with same-origin `/api`.
- No secrets or local environment files are committed.

## Out Of Scope For v1

- Full cloud speech-to-text.
- Mandatory OpenAI coaching.
- User accounts.
- Server-side learner profiles.
- Payment/subscription features.
- Native Android or iOS apps.
- Public production hardening beyond normal Vercel HTTPS behavior.
- Advanced pronunciation phoneme analysis.
- LMS integration.

## Known Current Gaps

- `brief.v1.md` was previously empty.
- Frontend lint currently reports errors that should be cleaned before release.
- Local build may fail inside restricted sandbox environments, but normal build succeeds.
- Manual transcript is still required for useful grammar feedback.
- iOS live mic behavior can be limited on plain LAN HTTP, so fallback flow is required.

## Notes

- Keep this project focused on practical speaking repetition, not a broad LMS.
- Prefer robust browser fallbacks over fragile device-specific hacks.
- Existing project files are authoritative; improve them incrementally.
