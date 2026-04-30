"use client";

export default function FloatingButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-3 rounded-full border border-stone-950/10 bg-[#201b18] px-4 py-3 text-sm font-semibold text-stone-100 shadow-[0_18px_40px_rgba(38,24,14,0.28)] transition duration-300 hover:-translate-y-1 hover:bg-[#2a231e]"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 text-base text-stone-950 shadow-inner shadow-white/20">
        +
      </span>
      <span className="pr-1">Open Co-Pilot</span>
    </button>
  );
}
