"use client";

import { useSyncExternalStore } from "react";

const state = {
  selectedText: "",
  isSidebarOpen: false,
  loading: false,
  response: "",
};

const listeners = new Set();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setState(partialState) {
  Object.assign(state, partialState);
  emitChange();
}

const store = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return state;
  },
  setSelectedText(selectedText) {
    setState({ selectedText });
  },
  openSidebar() {
    setState({ isSidebarOpen: true });
  },
  closeSidebar() {
    setState({ isSidebarOpen: false });
  },
  setLoading(loading) {
    setState({ loading });
  },
  setResponse(response) {
    setState({ response });
  },
};

export function useCopilotStore(selector) {
  return useSyncExternalStore(
    store.subscribe,
    () => selector({ ...store.getSnapshot(), ...store }),
    () => selector({ ...store.getSnapshot(), ...store })
  );
}
