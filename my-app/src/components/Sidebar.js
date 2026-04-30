"use client";

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[1.8rem] border border-white/10 bg-white/5 px-5 py-14 text-center">
      <div className="h-11 w-11 animate-spin rounded-full border-2 border-amber-100/25 border-t-amber-300" />
      <p className="mt-4 text-sm text-stone-300">Generating response...</p>
    </div>
  );
}

export default function Sidebar({
  isOpen,
  loading,
  response,
  selectedText,
  onClose,
  onCopy,
  copied,
}) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-stone-950/50 transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-white/10 bg-[#171311]/95 p-6 shadow-[0_18px_60px_rgba(13,9,7,0.55)] backdrop-blur transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/80">
              Reading Assistant
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#fff7ec]">
              Co-Pilot Panel
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-stone-300 transition hover:bg-white/8 hover:text-white"
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

        <div className="mt-6 flex-1 overflow-y-auto">
          {selectedText ? (
            <div className="rounded-[1.8rem] border border-white/8 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                Selected Text
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-200">
                {selectedText}
              </p>
            </div>
          ) : (
            <div className="rounded-[1.8rem] border border-dashed border-white/10 bg-white/4 p-6 text-sm leading-7 text-stone-400">
              Select text on the page, then choose Explain or Summarize.
            </div>
          )}

          <div className="mt-5">
            {loading ? (
              <LoadingState />
            ) : response ? (
              <div className="rounded-[1.8rem] border border-amber-200/12 bg-gradient-to-br from-amber-200/10 to-orange-200/6 p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/80">
                    Result
                  </p>
                  <button
                    type="button"
                    onClick={onCopy}
                    className="rounded-full border border-amber-200/20 px-3 py-1.5 text-xs font-medium text-amber-50 transition hover:bg-amber-300/12"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="mt-4 text-sm leading-7 whitespace-pre-wrap text-stone-100">
                  {response}
                </p>
              </div>
            ) : (
              <div className="rounded-[1.8rem] border border-white/8 bg-white/5 p-6 text-sm leading-7 text-stone-400">
                Your AI output will appear here once you trigger an action from the
                popup.
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
