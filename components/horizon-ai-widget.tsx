"use client"
import { useState } from "react"

export default function HorizonAIWidget() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([])
  const [input, setInput] = useState("")

  async function send() {
    const q = input.trim()
    if (!q) return
    setMessages((m) => [...m, { role: "user", text: q }])
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/horizon-ai", { method: "POST", body: JSON.stringify({ prompt: q }) })
      const data = await res.json()
      setMessages((m) => [...m, { role: "ai", text: data.text || "Sorry, I couldn’t respond." }])
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "Network error. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 90 }}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Horizon AI chat"
          style={{
            borderRadius: 14,
            padding: "10px 14px",
            border: "1px solid #F99C36",
            background: "linear-gradient(180deg,#F99C36,#F97316)",
            color: "#2b1203",
            fontWeight: 700,
            boxShadow: "0 16px 44px rgba(6,13,30,.35)",
          }}
        >
          Horizon AI
        </button>
      ) : (
        <div
          style={{
            width: 320,
            maxWidth: "calc(100vw - 24px)",
            background: "#101c34",
            border: "1px solid #1E3353",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 16px 44px rgba(6,13,30,.35)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 10,
              borderBottom: "1px solid #1E3353",
              color: "#F5F7FB",
            }}
          >
            <strong>Horizon AI</strong>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{ background: "transparent", color: "#F5F7FB", border: "none" }}
            >
              ✕
            </button>
          </div>
          <div style={{ height: 260, overflowY: "auto", padding: 10, color: "#EAF2FF" }}>
            {messages.length === 0 && (
              <div style={{ color: "#BFCAE0" }}>Ask about places, culture, food, safety, logistics…</div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ margin: "8px 0", color: m.role === "user" ? "#FFE1C7" : "#EAF2FF" }}>
                <b style={{ color: m.role === "user" ? "#FAD6A5" : "#16B39A" }}>
                  {m.role === "user" ? "You" : "Horizon AI"}:
                </b>{" "}
                {m.text}
              </div>
            ))}
            {loading && <div style={{ color: "#BFCAE0" }}>Thinking…</div>}
          </div>
          <div style={{ display: "flex", gap: 6, padding: 10, borderTop: "1px solid #1E3353" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder="Type your question…"
              style={{
                flex: 1,
                background: "#0f1b31",
                border: "1px solid #1E3353",
                color: "#EAF2FF",
                borderRadius: 10,
                padding: "10px 12px",
              }}
            />
            <button
              onClick={send}
              disabled={loading}
              style={{
                borderRadius: 10,
                padding: "10px 12px",
                border: "1px solid #1E3353",
                background: "#11203a",
                color: "#F5F7FB",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
