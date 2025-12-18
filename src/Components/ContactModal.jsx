import React, { useState } from "react";
import "./loginmodal.css";
import AlertModal from "./AlertModal";
import { useAlert } from "../hooks/useAlert";

export default function ContactModal({
  isOpen,
  onConfirm,
  onCancel,
  receiverName = "",
}) {
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { alertState, showAlert, closeAlert } = useAlert();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.body.trim()) {
      showAlert("Please fill in both subject and body", "warning");
      return;
    }

    setIsSubmitting(true);
    await onConfirm(formData);
    setIsSubmitting(false);

    // Reset form
    setFormData({ subject: "", body: "" });
  };

  const handleCancel = () => {
    setFormData({ subject: "", body: "" });
    onCancel();
  };

  return (
    <div className="modal-backdrop" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: "#27865d", marginBottom: "20px" }}>
          Contact {receiverName}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#333",
              }}
            >
              Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              placeholder="Enter subject"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#333",
              }}
            >
              Message *
            </label>
            <textarea
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              placeholder="Enter your message"
              rows={5}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                resize: "vertical",
              }}
              required
            />
          </div>

          <div className="modal-buttons">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-cancel"
              disabled={isSubmitting}
              style={{
                padding: "10px 20px",
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-confirm"
              disabled={isSubmitting}
              style={{
                padding: "10px 20px",
                background: isSubmitting ? "#999" : "#27865d",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
      <AlertModal
        isOpen={alertState.isOpen}
        message={alertState.message}
        type={alertState.type}
        onClose={closeAlert}
      />
    </div>
  );
}
