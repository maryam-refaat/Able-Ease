import React from "react";
import "../Pages/Allemps.css"; // Reusing modal styles

export default function ConfirmationModal({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title, 
  message 
}) {
  if (!isOpen) return null;

  // Format message to make price green
  const formatMessage = (msg) => {
    if (!msg) return msg;
    // Replace "Price: $XX" or "$XX" patterns with strong tags
    return msg.replace(/(\$\d+(?:\.\d{2})?(?:\/hr)?)/g, '<strong>$1</strong>')
              .replace(/(Price:)/g, '<strong>$1</strong>');
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p 
          style={{ whiteSpace: "pre-line" }}
          dangerouslySetInnerHTML={{ __html: formatMessage(message) }}
        />
        <div className="modal-actions">
          <button className="modal-confirm" onClick={onConfirm}>
            Confirm
          </button>
          <button className="modal-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
