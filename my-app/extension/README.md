# AI Website Co-Pilot Extension

This extension is now standalone.

## What it does

- Detects selected text on normal web pages
- Shows a popup with `Explain` and `Summarize`
- Opens a right-side overlay panel
- Calls NVIDIA directly from the extension background worker

## Load it in Chrome

1. Open `chrome://extensions`
2. Turn on **Developer mode**
3. Click **Load unpacked**
4. Select this folder:

`C:\Users\INDHU\Music\AI-Website-Co-Pilot\my-app\extension`

## Configure it

1. Open the extension details page in Chrome
2. Click **Extension options**
3. Paste your NVIDIA API key
4. Save

## Notes

- The default model is `meta/llama-3.1-8b-instruct`
- You can change the model in the options page
- The extension no longer relies on the local Next.js app
