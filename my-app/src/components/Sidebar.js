"use client";

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-white/8 bg-white/5 px-5 py-12 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-200/25 border-t-cyan-300" />
      <p className="mt-4 text-sm text-slate-300">Generating response...</p>
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
        className={`fixed inset-0 z-40 bg-slate-950/55 transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-black/50 backdrop-blur transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
              AI Response
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Co-Pilot Panel</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:bg-white/8 hover:text-white"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 flex-1 overflow-y-auto">
          {selectedText ? (
            <div className="rounded-3xl border border-white/8 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Selected Text
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-200">{selectedText}</p>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/4 p-6 text-sm leading-7 text-slate-400">
              Select text on the page, then choose Explain or Summarize.
            </div>
          )}

          <div className="mt-5">
            {loading ? (
              <LoadingState />
            ) : response ? (
              <div className="rounded-3xl border border-cyan-300/12 bg-cyan-400/8 p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
                    Result
                  </p>
                  <button
                    type="button"
                    onClick={onCopy}
                    className="rounded-full border border-cyan-300/20 px-3 py-1.5 text-xs font-medium text-cyan-100 transition hover:bg-cyan-300/12"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-100">{response}</p>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/8 bg-white/5 p-6 text-sm leading-7 text-slate-400">
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
