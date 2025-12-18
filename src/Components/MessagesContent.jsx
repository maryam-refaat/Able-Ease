import React, { useEffect, useState, useRef } from "react";
import "../Pages/messages.css";
import {
  getReceived_msgs,
  getSent_msgs,
  sendMssg,
  getAllUsernames,
  markMessageAsRead,
} from "../assets/apis";
import AlertModal from "./AlertModal";
import { useAlert } from "../hooks/useAlert";

export default function MessagesContent() {
  const { alertState, showAlert, closeAlert } = useAlert();
  const [conversations, setConversations] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [compose, setCompose] = useState({ to: "", subject: "", body: "" });
  const [activeTab, setActiveTab] = useState("received");
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const listRef = useRef(null);

  const userSSN = localStorage.getItem("ssn");

  // Fetch all users when compose modal opens
  useEffect(() => {
    if (composeOpen && allUsers.length === 0) {
      const fetchUsers = async () => {
        try {
          const response = await getAllUsernames();
          const users = response?.data || [];
          console.log("All users fetched:", users);
          setAllUsers(users);
        } catch (err) {
          console.error("Failed to fetch users:", err);
        }
      };
      fetchUsers();
    }
  }, [composeOpen]);

  // Transform API message to conversation format
  const transformMessage = (msg, type) => {
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

    return {
      id: messageId,
      subject,
      participants: {
        from: type === "sent" ? "You" : senderName,
        to: type === "sent" ? receiverName : "You",
        fromSSN: senderSSN,
        toSSN: receiverSSN,
      },
      snippet: body.slice(0, 120),
      unread: messageStatus === 0,
      messageType,
      messages: [
        {
          from: type === "sent" ? "You" : senderName,
          to: type === "sent" ? receiverName : "You",
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

  // Fetch messages on mount and when tab changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userSSN) {
        console.error("No SSN found in localStorage");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [receivedResponse, sentResponse] = await Promise.all([
          getReceived_msgs(userSSN),
          getSent_msgs(userSSN),
        ]);

        const receivedMsgs = receivedResponse?.data || [];
        const sentMsgs = sentResponse?.data || [];

        const receivedConvs = receivedMsgs.map((msg) =>
          transformMessage(msg, "received")
        );
        const sentConvs = sentMsgs.map((msg) => transformMessage(msg, "sent"));

        const allConversations = [...receivedConvs, ...sentConvs];
        setConversations(allConversations);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userSSN]);

  // Filter conversations based on active tab and search query
  const filtered = conversations
    .filter((c) => {
      if (activeTab === "received") {
        return c.participants.toSSN === userSSN;
      } else {
        return c.participants.fromSSN === userSSN;
      }
    })
    .filter((c) => {
      const q = query.toLowerCase();
      return (
        c.subject.toLowerCase().includes(q) ||
        c.participants.from.toLowerCase().includes(q) ||
        c.participants.to.toLowerCase().includes(q) ||
        c.snippet.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const aTime = new Date(a.messages[0]?.datetime || 0).getTime();
      const bTime = new Date(b.messages[0]?.datetime || 0).getTime();
      return bTime - aTime;
    });

  const selectConversation = async (id) => {
    setSelectedId(id);
    const conv = conversations.find((c) => c.id === id);

    if (conv && conv.unread && activeTab === "received") {
      try {
        await markMessageAsRead(userSSN, id);
        console.log("Message marked as read:", id);
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, unread: false } : c))
        );
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

      const selectedUser = allUsers.find(
        (u) => u.ssn === compose.to || u.SSN === compose.to
      );
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
          },
        ],
      };

      setConversations((prev) => [newConv, ...prev]);
      setComposeOpen(false);
      setCompose({ to: "", subject: "", body: "" });
      showAlert("Message sent successfully!", "success");
    } catch (err) {
      console.error("Failed to send message:", err);
      showAlert("Failed to send message. Please try again.", "error");
    }
  };

  return (
    <div className="messages-page" style={{ width: "100%", padding: "20px" }}>
      <div className="messages-layout">
        <aside className="inbox-list-full" ref={listRef}>
          <div className="inbox-toolbar">
            <button
              className="compose-btn"
              onClick={() => setComposeOpen(true)}
            >
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
    </div>
  );
}
