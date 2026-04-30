const extensionApi = globalThis.chrome;
const DEFAULT_MODEL = "meta/llama-3.1-8b-instruct";

function getPrompt(action, text) {
  const instruction =
    action === "summarize"
      ? "Summarize the following text clearly in 3 to 5 concise sentences."
      : "Explain the following text in simple, clear language for a general reader.";

  return `${instruction}\n\nText:\n${text}`;
}

function getStoredSettings() {
  return new Promise((resolve) => {
    extensionApi.storage.local.get(
      ["nvidiaApiKey", "nvidiaModel"],
      (items) => resolve(items)
    );
  });
}

extensionApi.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "AI_COPILOT_OPEN_OPTIONS") {
    extensionApi.runtime.openOptionsPage();
    sendResponse({ ok: true });
    return false;
  }

  if (message?.type !== "AI_COPILOT_REQUEST") {
    return undefined;
  }

  getStoredSettings()
    .then(async ({ nvidiaApiKey, nvidiaModel }) => {
      if (!nvidiaApiKey) {
        sendResponse({
          ok: false,
          error:
            "Missing NVIDIA API key. Open Settings in the panel and add your key.",
        });
        return;
      }

      const response = await fetch(
        "https://integrate.api.nvidia.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${nvidiaApiKey}`,
          },
          body: JSON.stringify({
            model: nvidiaModel || DEFAULT_MODEL,
            temperature: message.action === "summarize" ? 0.2 : 0.4,
            max_tokens: 400,
            messages: [
              {
                role: "system",
                content:
                  "You are a concise reading assistant. Give direct, helpful answers with no preamble.",
              },
              {
                role: "user",
                content: getPrompt(message.action, message.text),
              },
            ],
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        sendResponse({
          ok: false,
          error:
            data?.error?.message || "NVIDIA request failed. Please try again.",
        });
        return;
      }

      sendResponse({
        ok: true,
        response:
          data?.choices?.[0]?.message?.content?.trim() ||
          "No response generated.",
      });
    })
    .catch(() => {
      sendResponse({
        ok: false,
        error: "Unable to reach NVIDIA right now. Please try again.",
      });
    });

  return true;
});
