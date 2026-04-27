import { NextResponse } from "next/server";

export const runtime = "nodejs";

function jsonError(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return jsonError("Missing GEMINI_API_KEY (or GOOGLE_API_KEY) env var on the server.", 500);

  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body.");
  }

  const prompt = typeof body?.prompt === "string" ? body.prompt : "";
  const model = typeof body?.model === "string" ? body.model : "gemini-flash-latest";
  const max_tokens = Number.isFinite(body?.max_tokens) ? body.max_tokens : 1000;

  if (!prompt.trim()) return jsonError("Missing prompt.");

  try {
    // Google Generative Language API (Gemini)
    // Docs: https://ai.google.dev/
    const callModel = async (m) => {
      const url =
        `https://generativelanguage.googleapis.com/v1beta/models/` +
        encodeURIComponent(m) +
        `:generateContent?key=` +
        encodeURIComponent(apiKey);

      return await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            maxOutputTokens: max_tokens,
            temperature: 0.7,
          },
        }),
      });
    };

    let r = await callModel(model);
    if (r.status === 404) {
      // If a model was retired/unavailable, fall back to a commonly available default.
      r = await callModel("gemini-flash-latest");
    }

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const msg = data?.error?.message || `Gemini error (${r.status})`;
      return jsonError(msg, 500);
    }

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => (typeof p?.text === "string" ? p.text : ""))
        .join("") || "";
    return NextResponse.json({ text });
  } catch (e) {
    return jsonError(e?.message || "Upstream request failed.", 500);
  }
}

