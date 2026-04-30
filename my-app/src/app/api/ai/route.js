import { NextResponse } from "next/server";

export async function POST(request) {
  const { text = "", action = "explain" } = await request.json();
  const apiKey =
    process.env.NVIDIA_API_KEY || process.env.GEMINI_API_KEY;
  const model =
    process.env.NVIDIA_MODEL || "meta/llama-3.1-8b-instruct";

  const safeText = text.trim();

  if (!safeText) {
    return NextResponse.json(
      { error: "Text is required." },
      { status: 400 }
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Missing NVIDIA_API_KEY in .env.local. If you still have the older GEMINI_API_KEY line, that works too for now.",
      },
      { status: 500 }
    );
  }

  const instruction =
    action === "summarize"
      ? "Summarize the following text clearly in 3 to 5 concise sentences."
      : "Explain the following text in simple, clear language for a general reader.";

  try {
    const nvidiaResponse = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: action === "summarize" ? 0.2 : 0.4,
          max_tokens: 400,
          messages: [
            {
              role: "system",
              content:
                "You are a concise reading assistant. Give direct, helpful answers with no preamble.",
            },
            {
              role: "user",
              content: `${instruction}\n\nText:\n${safeText}`,
            },
          ],
        }),
      }
    );

    const data = await nvidiaResponse.json();

    if (!nvidiaResponse.ok) {
      const message =
        data?.error?.message || "NVIDIA request failed. Please try again.";

      return NextResponse.json({ error: message }, { status: 500 });
    }

    const response =
      data?.choices?.[0]?.message?.content?.trim() ||
      "No response generated.";

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to reach NVIDIA right now. Please try again." },
      { status: 500 }
    );
  }
}
