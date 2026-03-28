import { useState, useRef, useEffect } from "react";

export default function Index() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Assalam o Alaikum! Main Claude AI hoon. Breeches.com store ke baare mein kuch bhi poochho — products, orders, customers sab!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.answer }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Koi error aa gaya, dobara try karo!" }]);
    }
    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      maxWidth: "800px",
      margin: "0 auto",
      fontFamily: "sans-serif",
      background: "#f6f6f7"
    }}>
      {/* Header */}
      <div style={{
        background: "#008060",
        color: "white",
        padding: "16px 24px",
        fontSize: "18px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        🤖 Claude AI — Breeches.com Store Assistant
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
          }}>
            <div style={{
              maxWidth: "70%",
              padding: "12px 16px",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.role === "user" ? "#008060" : "white",
              color: msg.role === "user" ? "white" : "#333",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              fontSize: "14px",
              lineHeight: "1.5"
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "12px 16px",
              borderRadius: "18px 18px 18px 4px",
              background: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              color: "#888",
              fontSize: "14px"
            }}>
              ⏳ Soch raha hoon...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "16px",
        background: "white",
        borderTop: "1px solid #e5e5e5",
        display: "flex",
        gap: "10px"
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Kuch bhi poochho... jaise 'Kitne orders pending hain?'"
          rows={2}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "12px",
            border: "1px solid #ddd",
            fontSize: "14px",
            resize: "none",
            outline: "none",
            fontFamily: "sans-serif"
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: loading ? "#ccc" : "#008060",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "bold"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}