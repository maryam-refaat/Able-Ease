import React, { useState } from "react";
import "../Pages/Allemps.css"; // Reusing modal styles
import { AddPatientToTherapy } from "../assets/apis";
import AlertModal from "./AlertModal";
import { useAlert } from "../hooks/useAlert";

export default function SessionConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  therapy = null,
  isBooking = false,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { alertState, showAlert, closeAlert } = useAlert();

  if (!isOpen) return null;

  // Format message to make price blue
  const formatMessage = (msg) => {
    if (!msg) return msg;
    // Replace "Price: $XX" or "$XX" patterns with strong tags for blue styling
    return msg
      .replace(
        /(\$\d+(?:\.\d{2})?(?:\/hr)?)/g,
        '<strong class="session-price">$1</strong>'
      )
      .replace(/(Price:)/g, '<strong class="session-price">$1</strong>');
  };

  const handleConfirm = async () => {
    if (isBooking && therapy) {
      const patientSSN = localStorage.getItem("ssn");

      if (!patientSSN) {
        showAlert(
          "Patient information not found. Please log in again.",
          "error"
        );
        onCancel();
        return;
      }

      setIsLoading(true);
      try {
        const body = {
          Name: therapy?.name || therapy?.Name || "",
          duration: therapy?.duration || 0,
          PricePerHour: therapy?.pricePerHour || therapy?.PricePerHour || 0,
          Doctorname: therapy?.doctorname || therapy?.Doctorname || "",
          therapyDetails: therapy?.therapyDetails || "",
          Date: therapy?.date || therapy?.Date || "",
          PatientSSN: patientSSN,
          CenterID:
            therapy?.centerID || therapy?.CenterID || therapy?.centerId || "",
        };

        const response = await AddPatientToTherapy(body);
        console.log("Therapy booking response:", response);

        showAlert("Therapy session booked successfully!", "success");
        onConfirm();
      } catch (error) {
        console.error("Therapy booking error:", error);
        showAlert("Failed to book therapy session. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    } else {
      onConfirm();
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content session-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="session-title">{title}</h3>
        <p
          style={{ whiteSpace: "pre-line" }}
          dangerouslySetInnerHTML={{ __html: formatMessage(message) }}
        />
        <div className="modal-actions">
          <button
            className="modal-confirm session-confirm"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Booking..." : "Confirm"}
          </button>
          <button
            className="modal-cancel session-cancel"
            onClick={onCancel}
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
