# AI Website Co-Pilot

AI Website Co-Pilot is a selection-aware reading assistant. It lets a user highlight text, then ask AI to explain it in plain language or summarize it into a shorter takeaway.

The repository contains two related experiences:

- A Next.js demo app in `my-app` with a polished reading surface, selection popup, and slide-in response panel.
- A standalone Chrome extension in `my-app/extension` that brings the same Explain and Summarize flow to normal web pages.

## Features

- Detects selected text on a page
- Shows a compact popup with Explain and Summarize actions
- Displays AI output in a right-side panel
- Supports NVIDIA-hosted chat completions
- Includes a Chrome extension that stores the API key in extension local storage

## Project Structure

```text
.
`-- my-app
    |-- extension          # Standalone Chrome extension
    |-- public             # Static assets
    `-- src
        |-- app            # Next.js app routes and API route
        |-- components     # UI components
        |-- store          # Small client-side state store
        `-- utils          # Selection and API helpers
```

## Requirements

- Node.js 20 or newer
- npm
- An NVIDIA API key for `https://integrate.api.nvidia.com`
- Chrome or another Chromium-based browser for the extension

## Run The Next.js App

```bash
cd my-app
npm install
npm run dev
```

Open `http://localhost:3000`, select text in the reading surface, then choose Explain or Summarize.

## Environment Variables

Create `my-app/.env.local`:

```env
NVIDIA_API_KEY=your_api_key_here
NVIDIA_MODEL=meta/llama-3.1-8b-instruct
```

`NVIDIA_MODEL` is optional. If it is not set, the app uses `meta/llama-3.1-8b-instruct`.

## Load The Chrome Extension

The extension runs independently from the local Next.js app.

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select the `my-app/extension` folder.
5. Open the extension options page.
6. Add your NVIDIA API key and save.

After setup, select text on any normal `http` or `https` page and use the AI Website Co-Pilot popup.

## Scripts

Run these from `my-app`:

```bash
npm run dev      # Start the local Next.js development server
npm run build    # Build the production app
npm run start    # Start the production server
npm run lint     # Run ESLint
```

## Notes

- The Next.js demo calls `src/app/api/ai/route.js`, which forwards requests to NVIDIA.
- The extension calls NVIDIA directly from its Manifest V3 background service worker.
- The previous `GEMINI_API_KEY` environment variable is still accepted by the app as a fallback, but `NVIDIA_API_KEY` is the preferred name.
