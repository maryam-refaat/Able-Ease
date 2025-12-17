import React from "react";
import "../Components/modal.css";
import{deletePatientFromProgram,deletePatientSession,deletePatientWork} from "../assets/apis";

export default function PatientProfileModal({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  onWithdraw = null,
  onResign = null,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button
            className="modal-btn modal-btn-cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className="modal-btn modal-btn-confirm"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              background: "#dc3545",
              color: "white",
            }}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
