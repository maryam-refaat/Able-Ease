import React, { useState } from "react";
import "../Pages/Allemps.css";
import { ApplyForFA, getProgramByPatient } from "../assets/apis";
import AlertModal from "./AlertModal";
import { useAlert } from "../hooks/useAlert";

export default function FAApplicationModal({
  isOpen,
  onSubmit,
  onCancel,
  program,
}) {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { alertState, showAlert, closeAlert } = useAlert();

  if (!isOpen && !showErrorModal) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) return;

    const userSSN = localStorage.getItem("ssn");
    const organizationSSN =
      program?.organizationSSN ||
      program?.orgSSN ||
      program?.OrganizationSSN ||
      program?.OrgSSN;
    const programName =
      program?.name ||
      program?.centerName ||
      program?.Name ||
      program?.title ||
      "Program";
    const programID = program?.id || program?.ID;

    if (!userSSN) {
      showAlert("User information not found. Please log in again.", "error");
      return;
    }

    if (!organizationSSN) {
      showAlert("Organization information not found.", "error");
      return;
    }

    if (!programID) {
      showAlert("Program information not found.", "error");
      return;
    }

    setIsLoading(true);

    try {
      // Check if patient is already enrolled in this specific program
      const patientProgramResponse = await getProgramByPatient(userSSN);
      const patientPrograms = patientProgramResponse?.data || [];

      if (patientPrograms.length > 0) {
        const currentProgram = patientPrograms[0];
        const currentProgramId = currentProgram?.id;
        const currentOrgSSN = currentProgram?.organizationSSN;

        // Check if it's the same program
        if (
          currentProgramId === programID &&
          currentOrgSSN === organizationSSN
        ) {
          setErrorMessage(
            `You are already enrolled in "${programName}"!\n\nYou cannot apply for financial aid for a program you're already enrolled in.\n\nPlease check your enrolled programs.`
          );
          setShowErrorModal(true);
          setIsLoading(false);
          return;
        }

        // If enrolled in a different program
        setErrorMessage(
          "You are already enrolled in another program.\n\nYou cannot apply for financial aid for multiple programs at the same time.\n\nPlease complete or leave your current program before applying for financial aid for a new one."
        );
        setShowErrorModal(true);
        setIsLoading(false);
        return;
      }

      const data = {
        receiverSSN: organizationSSN,
        senderSSN: userSSN,
        subject: programID.toString(),
        body: reason,
      };

      await ApplyForFA(data);
      showAlert("Financial aid application submitted successfully!", "success");
      setReason("");
      onSubmit(reason); // Call parent callback
    } catch (error) {
      console.error("FA Application error:", error);
      showAlert("Failed to submit application. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setReason("");
    onCancel();
  };

  const programName =
    program?.name ||
    program?.centerName ||
    program?.Name ||
    program?.title ||
    "Program";
  const price = program?.price || program?.Price;

  // Custom Error Modal
  if (showErrorModal) {
    return (
      <div
        className="modal-overlay"
        onClick={() => setShowErrorModal(false)}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: "500px",
            padding: "32px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            border: "2px solid #dc3545",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 20px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(220, 53, 69, 0.4)",
              }}
            >
              <span style={{ fontSize: "48px", color: "white" }}>⚠️</span>
            </div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "24px",
                fontWeight: "700",
                color: "#dc3545",
              }}
            >
              Application Not Allowed
            </h3>
          </div>

          <p
            style={{
              whiteSpace: "pre-line",
              textAlign: "center",
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#495057",
              marginBottom: "28px",
              fontWeight: "500",
            }}
          >
            {errorMessage}
          </p>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={() => setShowErrorModal(false)}
              style={{
                padding: "14px 40px",
                fontSize: "16px",
                fontWeight: "600",
                color: "white",
                background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(220, 53, 69, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(220, 53, 69, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(220, 53, 69, 0.3)";
              }}
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          onFocus={(e) => (e.target.style.borderColor = "#a8d5f7")}
          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
        />

        <div className="modal-actions">
          <button
            className="modal-confirm"
            onClick={handleSubmit}
            disabled={!reason.trim() || isLoading}
            style={{
              opacity: reason.trim() && !isLoading ? 1 : 0.6,
              cursor: reason.trim() && !isLoading ? "pointer" : "not-allowed",
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
      <AlertModal
        isOpen={alertState.isOpen}
        message={alertState.message}
        type={alertState.type}
        onClose={closeAlert}
      />
    </div>
  );
}
