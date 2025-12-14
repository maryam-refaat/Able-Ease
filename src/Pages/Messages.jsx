// ...existing code...
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../profilepagecomponents/profile.css";
import "./messages.css";
import Footer from "../Components/Footer";
import{getReceived_msgs, getSent_msgs} from "../assets/apis";


//NO API YET, USING DEMO DATA
//NO API YET, USING DEMO DATA
//NO API YET, USING DEMO DATA
//NO API YET, USING DEMO DATA
//NO API YET, USING DEMO DATA
//NO API YET, USING DEMO DATA

const DEMO_CONVERSATIONS = [
  {
    id: "c1",
    subject: "Therapy appointment confirmation",
    participants: { from: "physio@centers.com", to: "you@domain.com" },
    snippet: "Your session is confirmed for Dec 20 at 10:00.",
    unread: true,
    messages: [
      {
        from: "physio@centers.com",
        to: "you@domain.com",
        subject: "Therapy appointment confirmation",
        body: "Hello, your session is confirmed for Dec 20 at 10:00. Please arrive 10 minutes early.",
        datetime: "2025-12-14T09:20:00Z",
        caregiver: "Alex Morgan",
        program: "Balance Recovery",
        organization: "Physio Care Center",
      },
    ],
  },
  {
    id: "c2",
    subject: "Progress update - Rehab for Seniors",
    participants: { from: "therapist@ablehub.org", to: "you@domain.com" },
    snippet: "We noted improvement in balance test scores.",
    unread: false,
    messages: [
      {
        id: "m2",
        from: "therapist@ablehub.org",
        to: "you@domain.com",
        subject: "Progress update - Rehab for Seniors",
        body: "Hi, this week the patient showed steady improvement in balance tests. See attached notes.",
        datetime: "2025-12-13T14:10:00Z",
        caregiver: "Sara Khan",
        program: "Rehab for Seniors",
        organization: "Able Learning Hub",
      },
    ],
  },
  {
    id: "c3",
    subject: "Invoice for recent sessions",
    participants: { from: "billing@sunrise.com", to: "you@domain.com" },
    snippet: "Invoice #INV-2025-12 for 3 sessions.",
    unread: false,
    messages: [
      {
        id: "m3",
        from: "billing@sunrise.com",
        to: "you@domain.com",
        subject: "Invoice for recent sessions",
        body: "Please find attached invoice #INV-2025-12 for 3 sessions. Payable within 30 days.",
        datetime: "2025-12-10T08:30:00Z",
        caregiver: "",
        program: "",
        organization: "Sunrise Rehab",
      },
    ],
  },
];

export default function Messages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState(DEMO_CONVERSATIONS);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [compose, setCompose] = useState({ to: "", subject: "", body: "" });
  const listRef = useRef(null);

  useEffect(() => {
    // If you have an API, fetch conversations here and setConversations(apiRes)
    // Example:
    // getConversations().then(res => setConversations(res.data || DEMO_CONVERSATIONS))
  }, []);

  const filtered = conversations.filter(
    (c) =>
      c.subject.toLowerCase().includes(query.toLowerCase()) ||
      c.snippet.toLowerCase().includes(query.toLowerCase()) ||
      c.participants.from.toLowerCase().includes(query.toLowerCase())
  );

  const selectConversation = (id) => {
    setSelectedId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: false } : c))
    );
  };

  const selected = conversations.find((c) => c.id === selectedId) || null;

  const handleSend = () => {
    if (!compose.to || !compose.body) return;
    const newConv = {
      id: `c${Date.now()}`,
      subject: compose.subject || "(no subject)",
      participants: { from: compose.to, to: "you@domain.com" },
      snippet: compose.body.slice(0, 120),
      unread: false,
      messages: [
        {
          id: `m${Date.now()}`,
          from: "you@domain.com",
          to: compose.to,
          subject: compose.subject,
          body: compose.body,
          datetime: new Date().toISOString(),
          caregiver: "",
          program: "",
          organization: "",
        },
      ],
    };
    setConversations((prev) => [newConv, ...prev]);
    setCompose({ to: "", subject: "", body: "" });
    setComposeOpen(false);
    setSelectedId(newConv.id);
    // TODO: call sendMessage API to persist
  };

  const handleReply = (text) => {
    if (!selected) return;
    const reply = {
      id: `m${Date.now()}`,
      from: "you@domain.com",
      to: selected.participants.from,
      subject: selected.subject,
      body: text,
      datetime: new Date().toISOString(),
      caregiver: "",
      program: "",
      organization: "",
    };
    setConversations((prev) =>
      prev.map((c) => (c.id === selected.id ? { ...c, messages: [...c.messages, reply], snippet: reply.body.slice(0,120) } : c))
    );
    // optionally persist via API
  };

  return (
    <>
      <div className="with-sidebar">
        <div className="side-rect" aria-hidden="true">
          <div className="side-icons">
            <button className="side-btn" aria-label="overview" onClick={() => navigate('/patient-profile')}>
              <i className="fa-solid fa-user" aria-hidden="true"></i>
            </button>
            <button className="side-btn" aria-label="messages" onClick={() => navigate('/messages')}>
              <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
            </button>
            <button className="side-btn" aria-label="reports" onClick={() => navigate('/patient-reports')}>
              <i className="fa-solid fa-clipboard-list" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <div className="page-container messages-page">
          <header className="welcome-box centered">
            <h1>Messages</h1>
            <p>{new Date().toLocaleDateString()}</p>
          </header>

          <div className="messages-layout">
            <aside className="inbox-list-full" ref={listRef}>
              <div className="inbox-toolbar">
                <button className="compose-btn" onClick={() => setComposeOpen(true)}>Write Message</button>
                <input
                  className="inbox-search"
                  placeholder="Search mail"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="conversations">
                {filtered.length === 0 && <div className="empty">No messages</div>}
                {filtered.map((c) => (
                  <div
                    key={c.id}
                    className={`conversation-row ${c.id === selectedId ? "selected" : ""}`}
                    onClick={() => selectConversation(c.id)}
                  >
                    <div className="conv-left">
                      <div className="conv-from">{c.participants.from}</div>
                      <div className="conv-subject">{c.subject}</div>
                    </div>
                    <div className="conv-right">
                      {c.unread && <div className="unread-badge">●</div>}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          {selected && (
            <div className="message-modal-overlay" onClick={() => setSelectedId(null)}>
              <div className="message-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedId(null)}>✕</button>
                <div className="message-header">
                  <h2 className="message-subject">{selected.subject}</h2>
                  <div className="message-meta">
                    <div><strong>From:</strong> {selected.participants.from}</div>
                    <div><strong>To:</strong> {selected.participants.to}</div>
                    <div><strong>Date:</strong> {new Date(selected.messages[selected.messages.length - 1].datetime).toLocaleString()}</div>
                    {selected.messages[selected.messages.length - 1].organization && (
                      <div><strong>Organization:</strong> {selected.messages[selected.messages.length - 1].organization}</div>
                    )}
                    {selected.messages[selected.messages.length - 1].program && (
                      <div><strong>Program:</strong> {selected.messages[selected.messages.length - 1].program}</div>
                    )}
                  </div>
                </div>

                <div className="message-thread">
                  {selected.messages.map((m) => (
                    <div key={m.id} className={`message-item ${m.from === "you@domain.com" ? "sent" : "received"}`}>
                      <div className="message-item-header">
                        <div className="message-item-from">{m.from}</div>
                        <div className="message-item-time">{new Date(m.datetime).toLocaleString()}</div>
                      </div>
                      <div className="message-item-body">{m.body}</div>
                    </div>
                  ))}
                </div>

                <ReplyForm onSend={handleReply} />
              </div>
            </div>
          )}

          {composeOpen && (
            <div className="message-modal-overlay" onClick={() => setComposeOpen(false)}>
              <div className="message-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setComposeOpen(false)}>✕</button>
                <h2>New Message</h2>
                <div className="compose-form">
                  <input
                    className="compose-input"
                    placeholder="To"
                    value={compose.to}
                    onChange={(e) => setCompose({ ...compose, to: e.target.value })}
                  />
                  <input
                    className="compose-input"
                    placeholder="Subject"
                    value={compose.subject}
                    onChange={(e) => setCompose({ ...compose, subject: e.target.value })}
                  />
                  <textarea
                    className="compose-textarea"
                    placeholder="Write your message..."
                    value={compose.body}
                    onChange={(e) => setCompose({ ...compose, body: e.target.value })}
                  />
                  <div className="reply-actions">
                    <button onClick={() => { setComposeOpen(false); setCompose({ to: "", subject: "", body: "" }); }}>Cancel</button>
                    <button className="send-btn" onClick={handleSend}>Send</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

function ReplyForm({ onSend }) {
  const [text, setText] = useState("");
  return (
    <div className="reply-form">
      <textarea
        placeholder="Write a reply..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="reply-actions">
        <button onClick={() => { setText(""); }}>Discard</button>
        <button
          className="send-btn"
          onClick={() => {
            if (!text.trim()) return;
            onSend(text.trim());
            setText("");
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}