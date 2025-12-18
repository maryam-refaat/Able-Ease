import React, { useState } from "react";
import "../Pages/Allemps.css"; // Reusing modal styles
import {
  AddPatientToProgram,
  addPayment,
  getProgramByPatient,
  getWorkByPatient,
} from "../assets/apis";
import { JobApplication } from "../assets/apis";

export default function ConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  program = null, // Pass program/position data
  isBooking = false, // Flag to determine if this is a booking modal
  isApply = false, // Flag to determine if this is a job application
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [qualifications, setQualifications] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen && !showErrorModal) return null;

  // Format message to make price green
  const formatMessage = (msg) => {
    if (!msg) return msg;
    // Replace "Price: $XX" or "$XX" patterns with strong tags
    return msg
      .replace(/(\$\d+(?:\.\d{2})?(?:\/hr)?)/g, "<strong>$1</strong>")
      .replace(/(Price:)/g, "<strong>$1</strong>");
  };

  const handleConfirm = async () => {
    // If this is a booking modal and program data is provided, handle API call
    if (isBooking && program) {
      const patientSSN = localStorage.getItem("ssn");
      const programID = program?.id;
      const orgSSN = program?.organizationSSN;
      const programPrice = program?.price ?? program?.Price ?? 0;

      if (!patientSSN) {
        alert("Please log in ");
        onCancel();
        return;
      }

      setIsLoading(true);
      try {
        const programName = program?.name || program?.Name || "Program";
        console.log(
          `Booking program: ${programName}, PatientSSN: ${patientSSN}, ProgramID: ${programID}, OrgSSN: ${orgSSN}, Price: ${programPrice}`
        );

        // Check if patient is already enrolled in this specific program
        const patientProgramResponse = await getProgramByPatient(patientSSN);
        const patientPrograms = patientProgramResponse?.data || [];

        if (patientPrograms.length > 0) {
          const currentProgram = patientPrograms[0];
          const currentProgramId = currentProgram?.id;
          const currentOrgSSN = currentProgram?.organizationSSN;

          // Check if it's the same program
          if (currentProgramId === programID && currentOrgSSN === orgSSN) {
            setErrorMessage(
              `You are already enrolled in "${programName}"!\n\nYou cannot book the same program twice.\n\nPlease check your enrolled programs.`
            );
            setShowErrorModal(true);
            onCancel();
            setIsLoading(false);
            return;
          }
        }

        // First, try to enroll patient in program
        const response = await AddPatientToProgram(
          patientSSN,
          programID,
          orgSSN
        );
        console.log("Enrollment response:", response);

        // Only create payment if enrollment succeeded
        const paymentData = {
          amount: programPrice,
          approvalStatus: "Approved",
          patientSSN: patientSSN,
          financialId: null,
        };

        await addPayment(paymentData);
        console.log("Payment added successfully");

        alert(
          `Successfully booked: ${programName}\nTotal paid: $${programPrice}`
        );
        onConfirm(); // Close modal on success
      } catch (error) {
        console.error("Booking error:", error);

        // Check if it's a 400 error (already enrolled or other client errors)
        if (
          error?.status === 400 ||
          (error?.status >= 400 && error?.status < 500)
        ) {
          setErrorMessage(
            "You are already enrolled in a program.\n\nYou cannot enroll in multiple programs at the same time.\n\nPlease complete or leave your current program before enrolling in a new one."
          );
          setShowErrorModal(true);
          onCancel(); // Close the confirmation modal
        } else {
          alert("Failed to book program. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    } else if (isApply) {
      // Handle job application
      const orgSSN =
        program?.organizationSSN ||
        program?.OrganizationSSN ||
        program?.senderSSN;

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
        const userSSN = localStorage.getItem("ssn");
        const positionTitle =
          program?.positionName ||
          program?.PositionName ||
          program?.position ||
          program?.Position ||
          "Position";

        if (!userSSN) {
          alert("User information not found. Please log in again.");
          onCancel();
          setIsLoading(false);
          return;
        }

        // Check if patient is already employed
        // If API returns 200, patient is working. If error, patient is not working.
        try {
          const workResponse = await getWorkByPatient(userSSN);
          // If we reach here, patient is employed (200 response)
          const patientWork = workResponse?.data || [];
          const currentWork = Array.isArray(patientWork)
            ? patientWork[0]
            : patientWork;
          const currentPosition =
            currentWork?.jobTitle ||
            currentWork?.JobTitle ||
            currentWork?.positionName ||
            currentWork?.PositionName ||
            "a position";
          const currentOrg =
            currentWork?.organizationName ||
            currentWork?.OrganizationName ||
            "an organization";

          setErrorMessage(
            `You are already employed!\n\nYou are currently working as "${currentPosition}" at "${currentOrg}".\n\nYou cannot apply for multiple positions while employed.\n\nPlease leave your current job before applying for a new one.`
          );
          setShowErrorModal(true);
          onCancel();
          setIsLoading(false);
          return;
        } catch (workError) {
          // Error means patient is not working, so they can apply
          console.log("Patient is not employed, proceeding with application");
        }

        const body = {
          receiverSSN: orgSSN,
          senderSSN: userSSN,
          body: qualifications.trim(),
          subject: `${positionTitle} application`,
        };

        const response = await JobApplication(body);
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
              Enrollment Not Allowed
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
                fontSize: "0.95rem",
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
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#a8d5f7")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
            />
          </div>
        )}

        <div className="modal-actions">
          <button
            className="modal-confirm"
            onClick={handleConfirm}
            disabled={isLoading || (isApply && !qualifications.trim())}
            style={{
              opacity:
                isLoading || (isApply && !qualifications.trim()) ? 0.6 : 1,
              cursor:
                isLoading || (isApply && !qualifications.trim())
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {isLoading
              ? isBooking
                ? "Booking..."
                : isApply
                ? "Applying..."
                : "Processing..."
              : "Confirm"}
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
