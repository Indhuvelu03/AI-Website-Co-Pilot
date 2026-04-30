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
    title: "Context On Demand",
    body: "The co-pilot stays invisible until you select text. Once a sentence or paragraph is highlighted, it appears near the selection and gives you fast ways to unpack meaning or condense the passage into a shorter takeaway.",
  },
  {
    title: "Editorial, Not Distracting",
    body: "The reading surface is designed to feel like a polished article instead of a demo box. The popup is compact, the motion is subtle, and the response panel lives off to the side so the document keeps center stage.",
  },
  {
    title: "Built For The Extension Path",
    body: "This same interaction model translates naturally into a Chrome extension. Users can select text on any page, trigger Explain or Summarize, and read the response without leaving the tab they were already focused on.",
  },
];

const highlights = [
  "Selection-aware popup",
  "Real NVIDIA-backed responses",
  "Right-side reader panel",
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(223,190,147,0.35),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(37,99,235,0.16),_transparent_24%),linear-gradient(180deg,_#f6efe3_0%,_#f3eadb_44%,_#efe5d3_100%)] text-stone-900">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
        <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.2fr]">
          <section className="flex flex-col justify-between overflow-hidden rounded-[2rem] border border-stone-900/8 bg-[#201b18] p-7 text-stone-100 shadow-[0_30px_80px_rgba(41,27,18,0.24)] sm:p-9">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full border border-amber-200/20 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-100/90">
                  AI Website Co-Pilot
                </span>
                <span className="text-xs uppercase tracking-[0.26em] text-stone-400">
                  Live Reader
                </span>
              </div>

              <h1 className="mt-8 max-w-xl text-4xl font-semibold leading-[1.02] tracking-tight text-[#fff7ec] sm:text-6xl">
                Turn selected text into something instantly more useful.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-8 text-stone-300 sm:text-lg">
                Highlight any sentence in the reading canvas and launch a
                beautifully minimal co-pilot that explains it clearly or
                compresses it into a short summary.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {highlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-stone-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-white/8 to-white/4 p-5">
              <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.22em] text-stone-400">
                <span>Interaction Pattern</span>
                <span>Selection to Insight</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-black/20 p-4">
                  <p className="text-sm font-medium text-stone-100">1. Highlight</p>
                  <p className="mt-2 text-sm leading-6 text-stone-400">
                    Select a phrase directly in the article.
                  </p>
                </div>
                <div className="rounded-2xl bg-black/20 p-4">
                  <p className="text-sm font-medium text-stone-100">2. Trigger</p>
                  <p className="mt-2 text-sm leading-6 text-stone-400">
                    Choose Explain or Summarize from the popup.
                  </p>
                </div>
                <div className="rounded-2xl bg-black/20 p-4">
                  <p className="text-sm font-medium text-stone-100">3. Read</p>
                  <p className="mt-2 text-sm leading-6 text-stone-400">
                    View the AI response in the sliding side panel.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[2rem] border border-stone-900/8 bg-[#fffaf2] shadow-[0_30px_80px_rgba(110,84,47,0.16)]">
            <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(180deg,_rgba(191,150,91,0.18),_transparent)]" />
            <div className="relative px-6 pb-8 pt-8 sm:px-8 lg:px-10">
              <div className="flex flex-col gap-5 border-b border-stone-900/8 pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-700">
                    Demo Reading Surface
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                    An interface that feels closer to a magazine than a dashboard.
                  </h2>
                </div>
                <div className="max-w-sm rounded-2xl border border-stone-900/8 bg-stone-950 px-4 py-3 text-sm leading-6 text-stone-300 shadow-lg">
                  Try selecting any sentence below. The popup uses{" "}
                  <code className="rounded bg-white/10 px-1.5 py-0.5 text-amber-100">
                    window.getSelection()
                  </code>{" "}
                  and sends the chosen text to the AI route.
                </div>
              </div>

              <div className="mt-8 grid gap-6">
                {articleSections.map((section, index) => (
                  <article
                    key={section.title}
                    className="group relative overflow-hidden rounded-[1.8rem] border border-stone-900/8 bg-white px-6 py-7 shadow-[0_18px_40px_rgba(112,87,50,0.08)] transition duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-amber-500 to-orange-300" />
                    <div className="pl-3">
                      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
                        <span>{`0${index + 1}`}</span>
                        <span>Reading Note</span>
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-stone-950 sm:text-[2rem]">
                        {section.title}
                      </h3>
                      <p className="mt-4 max-w-3xl text-[15px] leading-8 text-stone-700 sm:text-[17px]">
                        {section.body}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
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
