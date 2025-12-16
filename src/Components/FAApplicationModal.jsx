import React, { useState } from "react";
import "../Pages/Allemps.css";
import{ApplyForFA} from"../assets/apis";

export default function FAApplicationModal({ isOpen, onSubmit, onCancel, program }) {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) return;

    const userSSN = localStorage.getItem("userSSN");
    const organizationSSN = program?.organizationSSN || program?.orgSSN || program?.OrganizationSSN || program?.OrgSSN;
    const programName = program?.name || program?.centerName || program?.Name || program?.title || "Program";

    if (!userSSN) {
      alert("User information not found. Please log in again.");
      return;
    }

    if (!organizationSSN) {
      alert("Organization information not found.");
      return;
    }

    setIsLoading(true);

    try {
      const data = {
        recieverSSN: organizationSSN,
        senderSSN: userSSN,
        Subject: programName,
        body: reason
      };

      await ApplyForFA(data);
      alert("Financial aid application submitted successfully!");
      setReason("");
      onSubmit(reason); // Call parent callback
    } catch (error) {
      console.error("FA Application error:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setReason("");
    onCancel();
  };

  const programName = program?.name || program?.centerName || program?.Name || program?.title || "Program";
  const price = program?.price || program?.Price;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Apply for Financial Aid</h3>
        <p style={{ marginBottom: "16px" }}>
          Program: <strong>{programName}</strong>
          {price && (
            <>
              <br />
              Price: <strong style={{ color: "#27865d" }}>${price}</strong>
            </>
          )}
        </p>
        
        <textarea
          className="fa-reason-input"
          placeholder="Please explain your reason for requesting financial aid..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={5}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "2px solid #ddd",
            fontSize: "0.95rem",
            fontFamily: "inherit",
            resize: "vertical",
            marginBottom: "16px",
            transition: "border-color 0.3s ease",
          }}
          onFocus={(e) => e.target.style.borderColor = "#a8d5f7"}
          onBlur={(e) => e.target.style.borderColor = "#ddd"}
        />

        <div className="modal-actions">
          <button 
            className="modal-confirm" 
            onClick={handleSubmit}
            disabled={!reason.trim() || isLoading}
            style={{
              opacity: (reason.trim() && !isLoading) ? 1 : 0.6,
              cursor: (reason.trim() && !isLoading) ? "pointer" : "not-allowed",
            }}
          >
            {isLoading ? "Submitting..." : "Send Application"}
          </button>
          <button 
            className="modal-cancel" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
