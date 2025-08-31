;(() => {
  const styles = `
  .ai-fab{position:fixed;right:16px;bottom:16px;z-index:90;border-radius:14px;padding:10px 14px;border:1px solid #F99C36;background:linear-gradient(180deg,#F99C36,#F97316);color:#2b1203;font-weight:700;box-shadow:0 16px 44px rgba(6,13,30,.35)}
  .ai-panel{position:fixed;right:16px;bottom:16px;z-index:95;width:320px;max-width:calc(100vw - 24px);background:#101c34;border:1px solid #1E3353;border-radius:16px;overflow:hidden;box-shadow:0 16px 44px rgba(6,13,30,.35);display:none}
  .ai-header{display:flex;align-items:center;justify-content:space-between;padding:10px;border-bottom:1px solid #1E3353;color:#F5F7FB}
  .ai-body{height:260px;overflow-y:auto;padding:10px;color:#EAF2FF}
  .ai-footer{display:flex;gap:6px;padding:10px;border-top:1px solid #1E3353}
  .ai-input{flex:1;background:#0f1b31;border:1px solid #1E3353;color:#EAF2FF;border-radius:10px;padding:10px 12px}
  .ai-btn{border-radius:10px;padding:10px 12px;border:1px solid #1E3353;background:#11203a;color:#F5F7FB;cursor:pointer}
  .ai-close{background:transparent;border:none;color:#F5F7FB;cursor:pointer}
  .ai-msg-user{margin:8px 0;color:#FFE1C7}
  .ai-msg-ai{margin:8px 0;color:#EAF2FF}
  .ai-strong-user{color:#FAD6A5}
  .ai-strong-ai{color:#16B39A}
  `
  const styleEl = document.createElement("style")
  styleEl.textContent = styles
  document.head.appendChild(styleEl)

  const fab = document.createElement("button")
  fab.className = "ai-fab"
  fab.textContent = "Horizon AI"
  fab.setAttribute("aria-label", "Open Horizon AI chat")
  const panel = document.createElement("div")
  panel.className = "ai-panel"
  panel.innerHTML = `
    <div class="ai-header">
      <strong>Horizon AI</strong>
      <button class="ai-close" aria-label="Close">✕</button>
    </div>
    <div class="ai-body" id="ai-body"><div style="color:#BFCAE0">Ask about places, culture, food, logistics, safety…</div></div>
    <div class="ai-footer">
      <input class="ai-input" id="ai-input" placeholder="Type your question…"/>
      <button class="ai-btn" id="ai-send">Send</button>
    </div>
  `
  document.body.appendChild(fab)
  document.body.appendChild(panel)

  const bodyEl = panel.querySelector("#ai-body")
  const inputEl = panel.querySelector("#ai-input")
  const sendEl = panel.querySelector("#ai-send")
  panel.querySelector(".ai-close").addEventListener("click", () => {
    panel.style.display = "none"
    fab.style.display = "inline-block"
  })

  fab.addEventListener("click", () => {
    panel.style.display = "block"
    fab.style.display = "none"
    inputEl.focus()
  })

  function addMsg(role, text) {
    const div = document.createElement("div")
    div.className = role === "user" ? "ai-msg-user" : "ai-msg-ai"
    div.innerHTML =
      `<b class="${role === "user" ? "ai-strong-user" : "ai-strong-ai"}">${role === "user" ? "You" : "Horizon AI"}:</b> ` +
      (text || "")
    bodyEl.appendChild(div)
    bodyEl.scrollTop = bodyEl.scrollHeight
  }

  async function send() {
    const q = (inputEl.value || "").trim()
    if (!q) return
    addMsg("user", q)
    inputEl.value = ""
    try {
      const res = await fetch("/api/horizon-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: q }),
      })
      const data = await res.json().catch(() => ({}))
      addMsg("ai", data.text || "Sorry, I could not respond.")
    } catch (e) {
      addMsg("ai", "Network error. Please try again.")
    }
  }
  sendEl.addEventListener("click", send)
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      send()
    }
  })
})()
