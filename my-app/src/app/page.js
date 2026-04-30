"use client";

import { useEffect, useState } from "react";
import FloatingButton from "@/components/FloatingButton";
import SelectionPopup from "@/components/SelectionPopup";
import Sidebar from "@/components/Sidebar";
import { requestAiResponse } from "@/utils/api";
import { getSelectedText } from "@/utils/getSelectedText";
import { useCopilotStore } from "@/store/useCopilotStore";

const articleSections = [
  {
    title: "How the Co-Pilot Works",
    body: "This lightweight reading assistant watches for text selections on the page. Once you highlight a sentence or paragraph, a compact popup appears nearby and lets you ask for a plain-language explanation or a quick summary.",
  },
  {
    title: "Minimal Interaction Model",
    body: "The interface stays quiet until you need it. There is no toolbar cluttering the page, only a floating action button for reopening the sidebar and a contextual popup that appears exactly when text is selected.",
  },
  {
    title: "Useful for Research and Review",
    body: "You can use this pattern while reading technical docs, product notes, or long-form content. It helps turn selected text into something easier to understand without forcing users to leave the page or switch tabs.",
  },
];

export default function Home() {
  const selectedText = useCopilotStore((state) => state.selectedText);
  const isSidebarOpen = useCopilotStore((state) => state.isSidebarOpen);
  const loading = useCopilotStore((state) => state.loading);
  const response = useCopilotStore((state) => state.response);
  const setSelectedText = useCopilotStore((state) => state.setSelectedText);
  const openSidebar = useCopilotStore((state) => state.openSidebar);
  const closeSidebar = useCopilotStore((state) => state.closeSidebar);
  const setLoading = useCopilotStore((state) => state.setLoading);
  const setResponse = useCopilotStore((state) => state.setResponse);

  const [popupPosition, setPopupPosition] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = getSelectedText();

      if (!selection.text || !selection.rect) {
        setPopupPosition(null);
        setSelectedText("");
        return;
      }

      setSelectedText(selection.text);
      const popupTop = selection.rect.top + window.scrollY - 56;
      const fallbackTop = selection.rect.bottom + window.scrollY + 12;
      const preferredTop =
        popupTop > window.scrollY + 12 ? popupTop : fallbackTop;
      const centeredLeft =
        selection.rect.left + window.scrollX + selection.rect.width / 2;
      const clampedLeft = Math.min(
        Math.max(centeredLeft, 110),
        window.scrollX + window.innerWidth - 110
      );

      setPopupPosition({
        top: preferredTop,
        left: clampedLeft,
      });
    };

    document.addEventListener("mouseup", handleSelectionChange);
    document.addEventListener("keyup", handleSelectionChange);

    return () => {
      document.removeEventListener("mouseup", handleSelectionChange);
      document.removeEventListener("keyup", handleSelectionChange);
    };
  }, [setSelectedText]);

  const handleAction = async (action) => {
    if (!selectedText) {
      return;
    }

    openSidebar();
    setLoading(true);
    setResponse("");
    setCopied(false);

    try {
      const data = await requestAiResponse(selectedText, action);
      setResponse(data.response);
    } catch (error) {
      setResponse(
        error instanceof Error
          ? error.message
          : "Something went wrong while generating a response."
      );
    } finally {
      setLoading(false);
      setPopupPosition(null);
    }
  };

  const handleCopy = async () => {
    if (!response) {
      return;
    }

    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(44,62,80,0.22),_transparent_38%),linear-gradient(180deg,_#0f172a_0%,_#020617_62%,_#000000_100%)] text-slate-100">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl px-6 py-10 lg:px-10">
        <div className="w-full pr-0 transition-[padding] duration-300 ease-out lg:pr-8">
          <div className="mb-10 flex max-w-3xl flex-col gap-4">
            <span className="w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
              AI Website Co-Pilot
            </span>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Highlight text and ask for a clearer explanation or a quick summary.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Select any passage in the article below to trigger the co-pilot popup.
              The answer appears in a right-side overlay without taking you away
              from the page.
            </p>
          </div>

          <section className="max-w-4xl rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
            <div className="mb-8 rounded-3xl border border-cyan-300/15 bg-slate-950/70 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">
                Demo Reading Surface
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Try selecting a sentence, phrase, or an entire paragraph. The popup
                uses <code className="rounded bg-white/8 px-1.5 py-0.5 text-cyan-100">window.getSelection()</code>
                to detect highlighted text and position the action controls close to
                your selection.
              </p>
            </div>

            <div className="space-y-8">
              {articleSections.map((section) => (
                <article
                  key={section.title}
                  className="rounded-3xl border border-white/8 bg-black/20 p-6 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <h2 className="text-2xl font-semibold text-white">
                    {section.title}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-slate-300">
                    {section.body}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <SelectionPopup
        isVisible={Boolean(popupPosition && selectedText)}
        position={popupPosition}
        onExplain={() => handleAction("explain")}
        onSummarize={() => handleAction("summarize")}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        loading={loading}
        response={response}
        selectedText={selectedText}
        onClose={closeSidebar}
        onCopy={handleCopy}
        copied={copied}
      />

      <FloatingButton onClick={openSidebar} />
    </div>
  );
}
