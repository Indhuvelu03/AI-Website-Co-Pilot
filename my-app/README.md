# AI Website Co-Pilot App

This folder contains the Next.js demo app and the standalone Chrome extension for AI Website Co-Pilot.

AI Website Co-Pilot lets a user select text, then ask AI to explain it clearly or summarize it in a few concise sentences. The Next.js app demonstrates the interaction on a custom reading surface. The extension brings the same behavior to regular web pages.

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- NVIDIA chat completions API
- Chrome Extension Manifest V3

## Setup

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
NVIDIA_API_KEY=your_api_key_here
NVIDIA_MODEL=meta/llama-3.1-8b-instruct
```

`NVIDIA_MODEL` is optional. The default model is `meta/llama-3.1-8b-instruct`.

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`, select any sentence in the demo article, then choose Explain or Summarize.

## Chrome Extension

The extension lives in `extension` and does not require the Next.js app to be running.

To load it:

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select this folder: `my-app/extension`.
5. Open the extension options page.
6. Add your NVIDIA API key and save.

## Scripts

```bash
npm run dev      # Start the development server
npm run build    # Build for production
npm run start    # Start the production server
npm run lint     # Run ESLint
```

## Key Files

- `src/app/page.js` - demo reading surface and selection workflow
- `src/app/api/ai/route.js` - Next.js API route for AI requests
- `src/components/SelectionPopup.js` - Explain and Summarize popup
- `src/components/Sidebar.js` - AI response panel
- `src/store/useCopilotStore.js` - small client-side store
- `extension/background.js` - extension AI request handler
- `extension/content.js` - page selection and overlay logic

## Notes

- The app prefers `NVIDIA_API_KEY`, with `GEMINI_API_KEY` still accepted as a fallback.
- The extension stores its API key with `chrome.storage.local`.
- Both app and extension use `meta/llama-3.1-8b-instruct` unless another model is configured.
