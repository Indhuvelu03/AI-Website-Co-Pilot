const extensionApi = globalThis.chrome;
const form = document.getElementById("settings-form");
const apiKeyInput = document.getElementById("api-key");
const modelInput = document.getElementById("model");
const statusNode = document.getElementById("status");

function loadSettings() {
  extensionApi.storage.local.get(
    ["nvidiaApiKey", "nvidiaModel"],
    ({ nvidiaApiKey, nvidiaModel }) => {
      apiKeyInput.value = nvidiaApiKey || "";
      modelInput.value = nvidiaModel || "meta/llama-3.1-8b-instruct";
    }
  );
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  extensionApi.storage.local.set(
    {
      nvidiaApiKey: apiKeyInput.value.trim(),
      nvidiaModel: modelInput.value.trim() || "meta/llama-3.1-8b-instruct",
    },
    () => {
      statusNode.textContent = "Settings saved.";
      globalThis.setTimeout(() => {
        statusNode.textContent = "";
      }, 1800);
    }
  );
});

loadSettings();
