// ...existing code...
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../profilepagecomponents/profile.css";
import "./messages.css";
import Footer from "../Components/Footer";
import{getReceived_msgs, getSent_msgs,sendMssg} from "../assets/apis";
import Sidebar from "../Components/Sidebar";


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
  {
    id: "c4",
    subject: "Question about therapy schedule",
    participants: { from: "you@domain.com", to: "therapist@ablehub.org" },
    snippet: "I wanted to ask if we can reschedule next week's session?",
    unread: false,
    messages: [
      {
        id: "m4",
        from: "you@domain.com",
        to: "therapist@ablehub.org",
        subject: "Question about therapy schedule",
        body: "Hi Sara, I wanted to ask if we can reschedule next week's session to Thursday afternoon instead of Tuesday? Please let me know if that works for you.",
        datetime: "2025-12-12T16:45:00Z",
        caregiver: "Sara Khan",
        program: "Rehab for Seniors",
        organization: "Able Learning Hub",
      },
    ],
  },
  {
    id: "c5",
    subject: "Payment confirmation",
    participants: { from: "you@domain.com", to: "billing@sunrise.com" },
    snippet: "I've completed the payment for invoice #INV-2025-12.",
    unread: false,
    messages: [
      {
        id: "m5",
        from: "you@domain.com",
        to: "billing@sunrise.com",
        subject: "Payment confirmation",
        body: "Hello, I've completed the payment for invoice #INV-2025-12 via bank transfer. The transaction ID is TXN789456123. Please confirm receipt.",
        datetime: "2025-12-11T10:15:00Z",
        caregiver: "",
        program: "",
        organization: "Sunrise Rehab",
      },
    ],
  },
  {
    id: "c6",
    subject: "Feedback on recent session",
    participants: { from: "you@domain.com", to: "physio@centers.com" },
    snippet: "Thank you for the excellent session yesterday!",
    unread: false,
    messages: [
      {
        id: "m6",
        from: "you@domain.com",
        to: "physio@centers.com",
        subject: "Feedback on recent session",
        body: "Thank you for the excellent session yesterday! The new exercises really helped with the balance improvement. Looking forward to continuing the program.",
        datetime: "2025-12-13T08:30:00Z",
        caregiver: "Alex Morgan",
        program: "Balance Recovery",
        organization: "Physio Care Center",
      },
    ],
  },
];

export default function Messages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [compose, setCompose] = useState({ to: "", subject: "", body: "" });
  const [activeTab, setActiveTab] = useState("received"); // "received" or "sent"
  const [loading, setLoading] = useState(true);
  const [userNameCache, setUserNameCache] = useState({}); // Cache SSN -> Name
  const listRef = useRef(null);
  
  // Get user data from localStorage (patient or relative)
  const [userData] = useState(() => {
    // Check if relative data exists
    const relativeDataStr = localStorage.getItem("relativeData");
    const patientDataStr = localStorage.getItem("patientData");
    
    let data = null;
    let userType = "patient"; // default
    
    // Try to load relative data first
    try {
      if (relativeDataStr) {
        data = JSON.parse(relativeDataStr);
        userType = "relative";
      }
    } catch (e) {
      console.error("Failed to parse relative data", e);
    }
    
    // If no relative data, try patient data
    if (!data) {
      try {
        if (patientDataStr) {
          data = JSON.parse(patientDataStr);
          userType = "patient";
        }
      } catch (e) {
        console.error("Failed to parse patient data", e);
      }
    }
    
    // Fallback to localStorage items
    if (!data) {
      const relativeName = localStorage.getItem("relativeName");
      const patientName = localStorage.getItem("patientName");
      const relativeSSN = localStorage.getItem("relativeSSN");
      const patientSSN = localStorage.getItem("patientSSN");
      
      if (relativeName || relativeSSN) {
        userType = "relative";
        data = {
          fullName: relativeName || "Relative Name",
          email: localStorage.getItem("relativeEmail") || "",
          phone: localStorage.getItem("relativePhone") || "",
          ssn: relativeSSN || localStorage.getItem("userSSN") || "current-user-ssn"
        };
      } else {
        data = {
          fullName: patientName || "Patient Name",
          email: localStorage.getItem("patientEmail") || "",
          phone: localStorage.getItem("patientPhone") || "",
          ssn: patientSSN || localStorage.getItem("userSSN") || "current-user-ssn"
        };
      }
    }
    
    return { ...data, userType };
  });
  
  const userSSN = userData.ssn || localStorage.getItem("ssn") || "current-user-ssn";

  // Fetch user name by SSN with caching
  const fetchUserName = async (ssn) => {
    if (!ssn || ssn === userSSN) return "You";
    if (userNameCache[ssn]) return userNameCache[ssn];
    
    try {
      const result = await getUser_data(ssn);
      const userData = result?.data;
      const name = userData?.Name || userData?.name || userData?.FullName || userData?.fullName || `User ${ssn.slice(0, 6)}`;
      setUserNameCache(prev => ({ ...prev, [ssn]: name }));
      return name;
    } catch (err) {
      console.error("Error fetching user name:", err);
      return `User ${ssn.slice(0, 6)}`;
    }
  };

  // Transform API message to conversation format
  const transformMessage = async (msg, type) => {
    const messageId = msg.MessageId ?? msg.messageId ?? `msg-${Date.now()}`;
    const senderSSN = msg.SenderSSN ?? msg.senderSSN ?? "";
    const senderName = msg.SenderName ?? msg.senderName ?? "";
    const receiverSSN = msg.ReceiverSSN ?? msg.receiverSSN ?? "";
    const receiverName = msg.ReceiverName ?? msg.receiverName ?? "";
    const subject = msg.Subject ?? msg.subject ?? "(no subject)";
    const body = msg.Body ?? msg.body ?? "";
    const sentDate = msg.SentDate ?? msg.sentDate ?? new Date().toISOString();
    const messageStatus = msg.MessageStatus ?? msg.messageStatus ?? 0;
    const messageType = msg.MessageType ?? msg.messageType ?? "";
    
    // Use provided names or fetch if not available
    const displaySenderName = senderName || await fetchUserName(senderSSN);
    const displayReceiverName = receiverName || await fetchUserName(receiverSSN);
    
    return {
      id: messageId,
      subject,
      participants: {
        from: type === "sent" ? "You" : displaySenderName,
        to: type === "sent" ? displayReceiverName : "You",
        fromSSN: senderSSN,
        toSSN: receiverSSN
      },
      snippet: body.slice(0, 120),
      unread: messageStatus === 0,
      messageType,
      messages: [{
        from: type === "sent" ? "You" : displaySenderName,
        to: type === "sent" ? displayReceiverName : "You",
        subject,
        body,
        datetime: sentDate,
        senderSSN,
        receiverSSN,
        messageStatus,
        messageType
      }]
    };
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const [receivedRes, sentRes] = await Promise.allSettled([
          getReceived_msgs(userSSN),
          getSent_msgs(userSSN)
        ]);
        
        const receivedMsgs = receivedRes.status === "fulfilled" ? (receivedRes.value?.data || []) : [];
        const sentMsgs = sentRes.status === "fulfilled" ? (sentRes.value?.data || []) : [];
        
        // If both API calls return empty, use demo data
        if (receivedMsgs.length === 0 && sentMsgs.length === 0) {
          if (mounted) {
            setConversations(DEMO_CONVERSATIONS);
            setLoading(false);
          }
          return;
        }
        
        // Transform messages with user names
        const receivedConverted = await Promise.all(
          receivedMsgs.map(msg => transformMessage(msg, "received"))
        );
        const sentConverted = await Promise.all(
          sentMsgs.map(msg => transformMessage(msg, "sent"))
        );
        
        if (mounted) {
          // Combine and sort by date
          const allConversations = [...receivedConverted, ...sentConverted]
            .sort((a, b) => new Date(b.messages[0].datetime) - new Date(a.messages[0].datetime));
          setConversations(allConversations);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        if (mounted) {
          setConversations(DEMO_CONVERSATIONS); // Fallback to demo
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    fetchMessages();
    return () => { mounted = false; };
  }, [userSSN]);

  // Filter by active tab (received or sent)
  const tabFiltered = conversations.filter((c) => {
    const lastMsg = c.messages[c.messages.length - 1];
    if (activeTab === "received") {
      return lastMsg.from !== "you@domain.com";
    } else {
      return lastMsg.from === "you@domain.com";
    }
  });

  const filtered = tabFiltered.filter(
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
        <Sidebar userType={userData.userType} />

        <div className="page-container messages-page">
          <header className="welcome-box centered">
            <h1>Messages of {userData.fullName?.split(' ')[0] || "User"}</h1>
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

              <div className="inbox-tabs">
                <button
                  className={`tab-btn ${activeTab === "received" ? "active" : ""}`}
                  onClick={() => setActiveTab("received")}
                >
                  Received
                </button>
                <button
                  className={`tab-btn ${activeTab === "sent" ? "active" : ""}`}
                  onClick={() => setActiveTab("sent")}
                >
                  Sent
                </button>
              </div>

              <div className="conversations">
                {loading && <div className="empty">Loading messages...</div>}
                {!loading && filtered.length === 0 && <div className="empty">No messages</div>}
                {!loading && filtered.map((c) => (
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