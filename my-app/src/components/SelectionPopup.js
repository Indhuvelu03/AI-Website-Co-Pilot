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
      className="absolute z-40 flex items-center gap-1.5 rounded-full border border-stone-900/10 bg-[#201b18] p-1.5 shadow-[0_18px_30px_rgba(31,19,11,0.28)] backdrop-blur"
    >
      <button
        type="button"
        onClick={onExplain}
        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-stone-100"
      >
        Explain
      </button>
      <button
        type="button"
        onClick={onSummarize}
        className="rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:brightness-105"
      >
        Summarize
      </button>
    </div>
  );
}
