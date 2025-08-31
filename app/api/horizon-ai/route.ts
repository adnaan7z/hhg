import type { NextRequest } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Missing prompt" }), { status: 400 })
    }
    const model = google("gemini-1.5-flash")
    const { text } = await generateText({
      model,
      system:
        "You are Horizon AI, a concise assistant for Hidden Horizons (Andaman & Nicobar). " +
        "Answer briefly about places, culture, food, logistics, and safety. If unsure, say you’re not sure.",
      prompt,
    })
    return new Response(JSON.stringify({ text }), { status: 200, headers: { "Content-Type": "application/json" } })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "AI error", detail: err?.message || String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
