// ...existing code...
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../profilepagecomponents/profile.css";
import "./messages.css";
import Footer from "../Components/Footer";
import {
  getReceived_msgs,
  getSent_msgs,
  sendMssg,
  getAllUsernames,
  markMessageAsRead,
} from "../assets/apis";
import Sidebar from "../Components/Sidebar";
import AlertModal from "../Components/AlertModal";
import { useAlert } from "../hooks/useAlert";

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

export default function Messages({ showSidebar = true, showHeader = true }) {
  const navigate = useNavigate();
  const { alertState, showAlert, closeAlert } = useAlert();
  const [conversations, setConversations] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [compose, setCompose] = useState({ to: "", subject: "", body: "" });
  const [activeTab, setActiveTab] = useState("received"); // "received" or "sent"
  const [loading, setLoading] = useState(true);
  const [userNameCache, setUserNameCache] = useState({}); // Cache SSN -> Name
  const [allUsers, setAllUsers] = useState([]); // All users for compose combobox
  const listRef = useRef(null);

  // Get user data from localStorage (patient or relative)
  const [userData] = useState(() => {
    // Get SSN from localStorage
    const storedSSN = localStorage.getItem("ssn");

    // Check if relative data exists
    const relativeDataStr = localStorage.getItem("relativeData");
    const patientDataStr = localStorage.getItem("patientData");
    const organizationDataStr = localStorage.getItem("organizationData");
    const centerDataStr = localStorage.getItem("centerData");
    const caregiverDataStr = localStorage.getItem("caregiverData");

    let data = null;
    let userType = "patient"; // default

    // Try to load organization data first
    try {
      if (organizationDataStr) {
        data = JSON.parse(organizationDataStr);
        userType = "organization";
      }
    } catch (e) {
      console.error("Failed to parse organization data", e);
    }

    // Try to load therapy center data
    if (!data) {
      try {
        if (centerDataStr) {
          data = JSON.parse(centerDataStr);
          userType = "therapyCenter";
        }
      } catch (e) {
        console.error("Failed to parse center data", e);
      }
    }

    // Try to load caregiver data
    if (!data) {
      try {
        if (caregiverDataStr) {
          data = JSON.parse(caregiverDataStr);
          userType = "caretaker";
        }
      } catch (e) {
        console.error("Failed to parse caregiver data", e);
      }
    }

    // Try to load relative data
    if (!data) {
      try {
        if (relativeDataStr) {
          data = JSON.parse(relativeDataStr);
          userType = "relative";
        }
      } catch (e) {
        console.error("Failed to parse relative data", e);
      }
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
      const organizationName = localStorage.getItem("organizationName");
      const centerName = localStorage.getItem("centerName");

      if (organizationName) {
        userType = "organization";
        data = {
          fullName: organizationName || "Organization Name",
          name: organizationName,
          email: localStorage.getItem("organizationEmail") || "",
          phone: localStorage.getItem("organizationPhone") || "",
          ssn: storedSSN,
        };
      } else if (centerName) {
        userType = "therapyCenter";
        data = {
          fullName: centerName || "Center Name",
          name: centerName,
          email: localStorage.getItem("centerEmail") || "",
          phone: localStorage.getItem("centerPhone") || "",
          ssn: storedSSN,
        };
      } else if (relativeName) {
        userType = "relative";
        data = {
          fullName: relativeName || "Relative Name",
          email: localStorage.getItem("relativeEmail") || "",
          phone: localStorage.getItem("relativePhone") || "",
          ssn: storedSSN,
        };
      } else {
        data = {
          fullName: patientName || "Patient Name",
          email: localStorage.getItem("patientEmail") || "",
          phone: localStorage.getItem("patientPhone") || "",
          ssn: storedSSN,
        };
      }
    }

    // Make sure SSN is always from localStorage
    if (data && !data.ssn) {
      data.ssn = storedSSN;
    }

    console.log("=== Messages Component User Detection ===");
    console.log("Detected userType:", userType);
    console.log("User data:", data);
    console.log("User SSN:", data?.ssn || storedSSN);
    console.log(
      "centerData in localStorage:",
      localStorage.getItem("centerData")
    );
    console.log(
      "organizationData in localStorage:",
      localStorage.getItem("organizationData")
    );

    return { ...data, userType };
  });

  const userSSN = localStorage.getItem("ssn") || userData.ssn;

  // Fetch user name by SSN with caching
  const fetchUserName = async (ssn) => {
    if (!ssn || ssn === userSSN) return "You";
    if (userNameCache[ssn]) return userNameCache[ssn];

    try {
      const result = await getUser_data(ssn);
      const userData = result?.data;
      const name =
        userData?.Name ||
        userData?.name ||
        userData?.FullName ||
        userData?.fullName ||
        `User ${ssn.slice(0, 6)}`;
      setUserNameCache((prev) => ({ ...prev, [ssn]: name }));
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
    const displaySenderName = senderName || (await fetchUserName(senderSSN));
    const displayReceiverName =
      receiverName || (await fetchUserName(receiverSSN));

    return {
      id: messageId,
      subject,
      participants: {
        from: type === "sent" ? "You" : displaySenderName,
        to: type === "sent" ? displayReceiverName : "You",
        fromSSN: senderSSN,
        toSSN: receiverSSN,
      },
      snippet: body.slice(0, 120),
      unread: messageStatus === 0,
      messageType,
      messages: [
        {
          from: type === "sent" ? "You" : displaySenderName,
          to: type === "sent" ? displayReceiverName : "You",
          subject,
          body,
          datetime: sentDate,
          senderSSN,
          receiverSSN,
          messageStatus,
          messageType,
        },
      ],
    };
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Fetch all users when compose modal opens
  useEffect(() => {
    if (composeOpen && allUsers.length === 0) {
      const fetchUsers = async () => {
        try {
          const response = await getAllUsernames();
          const users = response?.data || [];
          console.log("All users fetched:", users);
          console.log("First user structure:", users[0]);
          setAllUsers(users);
        } catch (err) {
          console.error("Failed to fetch users:", err);
        }
      };
      fetchUsers();
    }
  }, [composeOpen, allUsers.length]);

  useEffect(() => {
    let mounted = true;

    const fetchMessages = async () => {
      // Validate userSSN before fetching
      if (!userSSN) {
        console.error("No userSSN found, cannot fetch messages");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [receivedRes, sentRes] = await Promise.allSettled([
          getReceived_msgs(userSSN),
          getSent_msgs(userSSN),
        ]);

        const receivedMsgs =
          receivedRes.status === "fulfilled"
            ? receivedRes.value?.data || []
            : [];
        const sentMsgs =
          sentRes.status === "fulfilled" ? sentRes.value?.data || [] : [];

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
          receivedMsgs.map((msg) => transformMessage(msg, "received"))
        );
        const sentConverted = await Promise.all(
          sentMsgs.map((msg) => transformMessage(msg, "sent"))
        );

        console.log("Received messages:", receivedConverted.length);
        console.log("Sent messages:", sentConverted.length);

        if (mounted) {
          // Combine and remove duplicates by messageId
          const allConversations = [...receivedConverted, ...sentConverted];

          // Remove duplicates by id
          const uniqueConversations = allConversations.filter(
            (conv, index, self) =>
              index === self.findIndex((c) => c.id === conv.id)
          );

          // Sort by date
          uniqueConversations.sort(
            (a, b) =>
              new Date(b.messages[0].datetime) -
              new Date(a.messages[0].datetime)
          );

          console.log(
            "Total unique conversations:",
            uniqueConversations.length
          );
          console.log("Sample conversation:", uniqueConversations[0]);
          console.log(
            "All conversations:",
            uniqueConversations.map((c) => ({
              id: c.id,
              subject: c.subject,
              senderSSN: c.messages[0].senderSSN,
              receiverSSN: c.messages[0].receiverSSN,
            }))
          );
          setConversations(uniqueConversations);
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
    return () => {
      mounted = false;
    };
  }, [userSSN]);

  // Filter by active tab (received or sent)
  const tabFiltered = conversations.filter((c) => {
    const lastMsg = c.messages[c.messages.length - 1];

    // Skip messages without SSN fields (demo data)
    if (!lastMsg.senderSSN || !lastMsg.receiverSSN) {
      console.log("Skipping message without SSN fields:", c.id);
      return false;
    }

    if (activeTab === "received") {
      // Received messages: user is receiver (including self-messages)
      const isReceived = lastMsg.receiverSSN === userSSN;
      console.log(
        `Message ${c.id}: receiverSSN=${lastMsg.receiverSSN}, senderSSN=${lastMsg.senderSSN}, userSSN=${userSSN}, isReceived=${isReceived}`
      );
      return isReceived;
    } else {
      // Sent messages: user is sender AND not to self (exclude self-messages, they show in received)
      const isSent =
        lastMsg.senderSSN === userSSN && lastMsg.receiverSSN !== userSSN;
      console.log(
        `Message ${c.id}: senderSSN=${lastMsg.senderSSN}, userSSN=${userSSN}, isSent=${isSent}`
      );
      return isSent;
    }
  });

  const filtered = tabFiltered.filter(
    (c) =>
      c.subject.toLowerCase().includes(query.toLowerCase()) ||
      c.snippet.toLowerCase().includes(query.toLowerCase()) ||
      c.participants.from.toLowerCase().includes(query.toLowerCase())
  );

  const selectConversation = async (id) => {
    setSelectedId(id);
    const conversation = conversations.find((c) => c.id === id);

    // Mark as read in UI
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: false } : c))
    );

    // If message is unread and in received tab, mark as read on server
    if (conversation && conversation.unread && activeTab === "received") {
      try {
        await markMessageAsRead(userSSN, id);
        console.log("Message marked as read:", id);
      } catch (err) {
        console.error("Failed to mark message as read:", err);
      }
    }
  };

  const selected = conversations.find((c) => c.id === selectedId) || null;

  const handleSend = async () => {
    if (!compose.to || !compose.body) {
      showAlert("Please select a recipient and write a message.", "warning");
      return;
    }

    try {
      const payload = {
        senderSSN: userSSN,
        receiverSSN: compose.to,
        subject: compose.subject || "(no subject)",
        body: compose.body,
      };

      console.log("Sending message:", payload);
      const response = await sendMssg(payload);
      console.log("Message sent successfully:", response);

      // Create optimistic UI update
      const selectedUser = allUsers.find((u) => u.ssn === compose.to);
      const newConv = {
        id: response.messageId || `c${Date.now()}`,
        subject: compose.subject || "(no subject)",
        participants: {
          from: "You",
          to: selectedUser?.username || selectedUser?.name || "User",
          fromSSN: userSSN,
          toSSN: compose.to,
        },
        snippet: compose.body.slice(0, 120),
        unread: false,
        messages: [
          {
            from: "You",
            to: selectedUser?.username || selectedUser?.name || "User",
            subject: compose.subject || "(no subject)",
            body: compose.body,
            datetime: new Date().toISOString(),
            senderSSN: userSSN,
            receiverSSN: compose.to,
            messageStatus: 0,
            messageType: "contact",
          },
        ],
      };

      setConversations((prev) => [newConv, ...prev]);
      setCompose({ to: "", subject: "", body: "" });
      setComposeOpen(false);
      setSelectedId(newConv.id);

      showAlert("Message sent successfully!", "success");
    } catch (err) {
      console.error("Failed to send message:", err);
      showAlert("Failed to send message. Please try again.", "error");
    }
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
      prev.map((c) =>
        c.id === selected.id
          ? {
              ...c,
              messages: [...c.messages, reply],
              snippet: reply.body.slice(0, 120),
            }
          : c
      )
    );
    // optionally persist via API
  };

  const messagesLayoutContent = (
    <div className="messages-layout">
      <aside className="inbox-list-full" ref={listRef}>
        <div className="inbox-toolbar">
          <button className="compose-btn" onClick={() => setComposeOpen(true)}>
            Write Message
          </button>
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
          {!loading && filtered.length === 0 && (
            <div className="empty">No messages</div>
          )}
          {!loading &&
            filtered.map((c) => (
              <div
                key={c.id}
                className={`conversation-row ${
                  c.id === selectedId ? "selected" : ""
                } ${c.unread ? "unread" : ""}`}
                onClick={() => selectConversation(c.id)}
              >
                <div className="subject">{c.subject}</div>
                <div className="snippet">{c.snippet}</div>
                <div className="meta">
                  {activeTab === "received"
                    ? `From: ${c.participants.from}`
                    : `To: ${c.participants.to}`}
                </div>
              </div>
            ))}
        </div>
      </aside>

      <main className="message-detail">
        {!selected && (
          <div className="empty">Select a conversation to view</div>
        )}
        {selected && (
          <>
            <h2 className="detail-subject">{selected.subject}</h2>
            <div className="messages-thread">
              {selected.messages.map((m, i) => (
                <div key={i} className="message-bubble">
                  <div className="msg-meta">
                    <strong>{m.from}</strong> →{" "}
                    <span className="msg-to">{m.to}</span>
                    <span className="msg-time">
                      {new Date(m.datetime).toLocaleString()}
                    </span>
                  </div>
                  <div className="msg-body">{m.body}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );

  return (
    <>
      {showSidebar ? (
        <div className="with-sidebar">
          <Sidebar userType={userData.userType} />
          <div className="page-container messages-page">
            {showHeader && (
              <header className="welcome-box centered">
                <h1>
                  Messages of {userData.fullName?.split(" ")[0] || "User"}
                </h1>
                <p>{new Date().toLocaleDateString()}</p>
              </header>
            )}
            {messagesLayoutContent}
          </div>
        </div>
      ) : (
        <>
          {showHeader && (
            <header className="welcome-box centered">
              <h1>Messages of {userData.fullName?.split(" ")[0] || "User"}</h1>
              <p>{new Date().toLocaleDateString()}</p>
            </header>
          )}
          {messagesLayoutContent}
        </>
      )}

      {composeOpen && (
        <div
          className="message-modal-overlay"
          onClick={() => setComposeOpen(false)}
        >
          <div className="message-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setComposeOpen(false)}
            >
              ✕
            </button>
            <h2>New Message</h2>
            <div className="compose-form">
              <select
                className="compose-input"
                value={compose.to}
                onChange={(e) => setCompose({ ...compose, to: e.target.value })}
                required
              >
                <option value="">Select recipient</option>
                {allUsers.map((user, idx) => (
                  <option
                    key={user.ssn || user.SSN || idx}
                    value={user.ssn || user.SSN}
                  >
                    {user.username || user.name || `User ${idx + 1}`}
                  </option>
                ))}
              </select>
              <input
                className="compose-input"
                placeholder="Subject"
                value={compose.subject}
                onChange={(e) =>
                  setCompose({ ...compose, subject: e.target.value })
                }
              />
              <textarea
                className="compose-textarea"
                placeholder="Write your message..."
                value={compose.body}
                onChange={(e) =>
                  setCompose({ ...compose, body: e.target.value })
                }
              />
              <div className="reply-actions">
                <button
                  onClick={() => {
                    setComposeOpen(false);
                    setCompose({ to: "", subject: "", body: "" });
                  }}
                >
                  Cancel
                </button>
                <button className="send-btn" onClick={handleSend}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        message={alertState.message}
        type={alertState.type}
      />

      {showSidebar && <Footer />}
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
        <button
          onClick={() => {
            setText("");
          }}
        >
          Discard
        </button>
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
