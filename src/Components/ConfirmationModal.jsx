import React, { useState } from "react";
import "../Pages/Allemps.css"; // Reusing modal styles
import { AddPatientToProgram } from "../assets/apis";
import { JobApplication } from "../assets/apis";


export default function ConfirmationModal({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title, 
  message,
  program = null, // Pass program/position data
  isBooking = false, // Flag to determine if this is a booking modal
  isApply = false // Flag to determine if this is a job application
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [qualifications, setQualifications] = useState("");

  if (!isOpen) return null;

  // Format message to make price green
  const formatMessage = (msg) => {
    if (!msg) return msg;
    // Replace "Price: $XX" or "$XX" patterns with strong tags
    return msg.replace(/(\$\d+(?:\.\d{2})?(?:\/hr)?)/g, '<strong>$1</strong>')
              .replace(/(Price:)/g, '<strong>$1</strong>');
  };

  const handleConfirm = async () => {
    // If this is a booking modal and program data is provided, handle API call
    if (isBooking && program) {
      const patientSSN = localStorage.getItem("userSSN");
      const programID = program?.id;
      const orgSSN = program?.organizationSSN;

      if (!patientSSN) {
        alert("Patient information not found. Please log in again.");
        onCancel();
        return;
      }

      setIsLoading(true);
      try {
        const programName = program?.name || program?.Name || "Program";
        console.log(`Booking program: ${programName}, PatientSSN: ${patientSSN}, ProgramID: ${programID}, OrgSSN: ${orgSSN}`);
        
        const response = await AddPatientToProgram(patientSSN, programID, orgSSN);
        console.log("Booking response:", response);
        
        alert(`Successfully booked: ${programName}`);
        onConfirm(); // Close modal on success
      } catch (error) {
        console.error("Booking error:", error);
        alert("Failed to book program. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else if (isApply) {
      // Handle job application
      const orgSSN = program?.organizationSSN || program?.OrganizationSSN;

      if (!orgSSN) {
        alert("Organization information not found.");
        onCancel();
        return;
      }

      if (!qualifications.trim()) {
        alert("Please enter your qualifications.");
        return;
      }

      setIsLoading(true);
      try {
        const userSSN = localStorage.getItem("userSSN");
        const positionTitle = program?.positionName || program?.PositionName || program?.position || program?.Position || "Position";

        if (!userSSN) {
          alert("User information not found. Please log in again.");
          onCancel();
          setIsLoading(false);
          return;
        }

        const body = {
          receiverSSN: orgSSN,
          senderSSN: userSSN,
          body: qualifications.trim(),
          Subject: `${positionTitle} application`
        };

        const response = await JobApplication(body, orgSSN);
        console.log("Job application response:", response);
        
        alert("Job application submitted successfully!");
        setQualifications("");
        onConfirm(); // Close modal on success
      } catch (error) {
        console.error("Job application error:", error);
        alert("Failed to submit job application. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // For generic confirmation modals, just call the onConfirm callback
      onConfirm();
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p 
          style={{ whiteSpace: "pre-line" }}
          dangerouslySetInnerHTML={{ __html: formatMessage(message) }}
        />
        
        {isApply && (
          <div style={{ marginBottom: "16px" }}>
            <label 
              htmlFor="qualifications" 
              style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "600",
                fontSize: "0.95rem"
              }}
            >
              Your Qualifications
            </label>
            <textarea
              id="qualifications"
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
              placeholder="Describe your qualifications and experience..."
              rows={4}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #ddd",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                resize: "vertical",
                transition: "border-color 0.3s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#a8d5f7"}
              onBlur={(e) => e.target.style.borderColor = "#ddd"}
            />
          </div>
        )}

        <div className="modal-actions">
          <button 
            className="modal-confirm" 
            onClick={handleConfirm}
            disabled={isLoading || (isApply && !qualifications.trim())}
            style={{
              opacity: (isLoading || (isApply && !qualifications.trim())) ? 0.6 : 1,
              cursor: (isLoading || (isApply && !qualifications.trim())) ? "not-allowed" : "pointer"
            }}
          >
            {isLoading ? (isBooking ? "Booking..." : isApply ? "Applying..." : "Processing...") : "Confirm"}
          </button>
          <button 
            className="modal-cancel" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
