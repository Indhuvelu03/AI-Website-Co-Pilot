"use client";

export default function FloatingButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30 inline-flex h-14 items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400 px-5 text-sm font-semibold text-slate-950 shadow-xl shadow-cyan-950/40 transition-transform duration-300 hover:-translate-y-1 hover:bg-cyan-300"
    >
      <span className="text-lg leading-none">+</span>
      Co-Pilot
    </button>
  );
}
