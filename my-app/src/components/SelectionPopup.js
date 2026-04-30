"use client";

export default function SelectionPopup({
  isVisible,
  position,
  onExplain,
  onSummarize,
}) {
  if (!isVisible || !position) {
    return null;
  }

  return (
    <div
      style={{
        top: position.top,
        left: position.left,
        transform: "translateX(-50%)",
      }}
      className="absolute z-40 flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-black/40 backdrop-blur"
    >
      <button
        type="button"
        onClick={onExplain}
        className="rounded-xl bg-white/8 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/14"
      >
        Explain
      </button>
      <button
        type="button"
        onClick={onSummarize}
        className="rounded-xl bg-cyan-400/14 px-3 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/22"
      >
        Summarize
      </button>
    </div>
  );
}
