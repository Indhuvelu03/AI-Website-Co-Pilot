import { NextResponse } from "next/server";

export async function POST(request) {
  const { text = "", action = "explain" } = await request.json();
  const apiKey = process.env.GEMINI_API_KEY;

  const safeText = text.trim();

  if (!safeText) {
    return NextResponse.json(
      { error: "Text is required." },
      { status: 400 }
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY in .env.local." },
      { status: 500 }
    );
  }

  const instruction =
    action === "summarize"
      ? "Summarize the following text clearly in 3 to 5 concise sentences."
      : "Explain the following text in simple, clear language for a general reader.";

  try {
    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${instruction}\n\nText:\n${safeText}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      const message =
        data?.error?.message || "Gemini request failed. Please try again.";

      return NextResponse.json({ error: message }, { status: 500 });
    }

    const response =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .filter(Boolean)
        .join("\n")
        .trim() || "No response generated.";

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to reach Gemini right now. Please try again." },
      { status: 500 }
    );
  }
}
