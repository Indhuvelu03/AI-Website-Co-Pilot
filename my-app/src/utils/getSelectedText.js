export function getSelectedText() {
  if (typeof window === "undefined") {
    return { text: "", rect: null };
  }

  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return { text: "", rect: null };
  }

  const text = selection.toString().trim();

  if (!text) {
    return { text: "", rect: null };
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  return { text, rect };
}
