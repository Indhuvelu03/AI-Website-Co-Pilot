const extensionApi = globalThis.chrome;

if (!globalThis.__aiCopilotMounted) {
  globalThis.__aiCopilotMounted = true;

  const root = document.createElement("div");
  root.id = "ai-copilot-extension-root";
  document.documentElement.appendChild(root);

  const popup = document.createElement("div");
  popup.className = "aicp-popup aicp-hidden";
  popup.innerHTML = `
    <button type="button" data-action="explain">Explain</button>
    <button type="button" data-action="summarize">Summarize</button>
  `;

  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "aicp-launcher";
  launcher.innerHTML = `
    <span class="aicp-launcher__orb">+</span>
    <span>Open Co-Pilot</span>
  `;

  const sidebar = document.createElement("aside");
  sidebar.className = "aicp-sidebar";
  sidebar.innerHTML = `
    <div class="aicp-sidebar__backdrop"></div>
    <div class="aicp-sidebar__panel">
      <div class="aicp-sidebar__header">
        <div>
          <p class="aicp-sidebar__eyebrow">Reading Assistant</p>
          <h2>Co-Pilot Panel</h2>
        </div>
        <button type="button" class="aicp-close" aria-label="Close panel">×</button>
      </div>
      <div class="aicp-sidebar__content">
        <section class="aicp-card">
          <p class="aicp-card__label">Selected Text</p>
          <p class="aicp-selected">Select text on the page to get started.</p>
        </section>
        <section class="aicp-card aicp-card--result">
          <div class="aicp-result__header">
            <p class="aicp-card__label">Result</p>
            <div class="aicp-result__actions">
              <button type="button" class="aicp-settings">Settings</button>
              <button type="button" class="aicp-copy">Copy</button>
            </div>
          </div>
          <div class="aicp-result">Your AI output will appear here.</div>
        </section>
      </div>
    </div>
  `;

  root.appendChild(popup);
  root.appendChild(sidebar);
  root.appendChild(launcher);

  const backdrop = sidebar.querySelector(".aicp-sidebar__backdrop");
  const closeButton = sidebar.querySelector(".aicp-close");
  const copyButton = sidebar.querySelector(".aicp-copy");
  const settingsButton = sidebar.querySelector(".aicp-settings");
  const selectedNode = sidebar.querySelector(".aicp-selected");
  const resultNode = sidebar.querySelector(".aicp-result");

  const state = {
    selectedText: "",
    response: "",
    loading: false,
    copied: false,
  };

  function setSidebarOpen(isOpen) {
    sidebar.classList.toggle("aicp-sidebar--open", isOpen);
  }

  function setPopupVisible(isVisible, rect) {
    if (!isVisible || !rect) {
      popup.classList.add("aicp-hidden");
      return;
    }

    const preferredTop = rect.top - 58;
    const fallbackTop = rect.bottom + 12;
    const top = preferredTop > 12 ? preferredTop : fallbackTop;
    const left = Math.min(
      Math.max(rect.left + rect.width / 2, 116),
      globalThis.innerWidth - 116
    );

    popup.style.top = `${top + globalThis.scrollY}px`;
    popup.style.left = `${left + globalThis.scrollX}px`;
    popup.classList.remove("aicp-hidden");
  }

  function render() {
    selectedNode.textContent =
      state.selectedText || "Select text on the page to get started.";

    if (state.loading) {
      resultNode.innerHTML = `
        <div class="aicp-loading">
          <span class="aicp-loading__spinner"></span>
          <span>Generating response...</span>
        </div>
      `;
      return;
    }

    resultNode.textContent = state.response || "Your AI output will appear here.";
    copyButton.textContent = state.copied ? "Copied" : "Copy";
  }

  function handleSelectionChange() {
    const selection = globalThis.getSelection();

    if (!selection || selection.rangeCount === 0) {
      state.selectedText = "";
      setPopupVisible(false);
      render();
      return;
    }

    const text = selection.toString().trim();

    if (!text) {
      state.selectedText = "";
      setPopupVisible(false);
      render();
      return;
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect();
    state.selectedText = text;
    setPopupVisible(true, rect);
    render();
  }

  function requestAi(action) {
    if (!state.selectedText) {
      return;
    }

    state.loading = true;
    state.response = "";
    state.copied = false;
    setSidebarOpen(true);
    setPopupVisible(false);
    render();

    extensionApi.runtime.sendMessage(
      {
        type: "AI_COPILOT_REQUEST",
        text: state.selectedText,
        action,
      },
      (reply) => {
        state.loading = false;
        state.response = reply?.ok
          ? reply.response
          : reply?.error || "Failed to fetch AI response.";
        render();
      }
    );
  }

  popup.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) {
      return;
    }

    requestAi(button.dataset.action);
  });

  launcher.addEventListener("click", () => setSidebarOpen(true));
  closeButton.addEventListener("click", () => setSidebarOpen(false));
  backdrop.addEventListener("click", () => setSidebarOpen(false));

  copyButton.addEventListener("click", async () => {
    if (!state.response) {
      return;
    }

    try {
      await navigator.clipboard.writeText(state.response);
      state.copied = true;
      render();
      globalThis.setTimeout(() => {
        state.copied = false;
        render();
      }, 1600);
    } catch (error) {
      state.copied = false;
      render();
    }
  });

  settingsButton.addEventListener("click", () => {
    extensionApi.runtime.sendMessage({ type: "AI_COPILOT_OPEN_OPTIONS" });
  });

  document.addEventListener("mouseup", handleSelectionChange);
  document.addEventListener("keyup", handleSelectionChange);
  globalThis.addEventListener("scroll", () => {
    if (state.selectedText) {
      handleSelectionChange();
    }
  });

  render();
}
