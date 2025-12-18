import { useState } from "react";
import "../profilepagecomponents/profile.css";
import { addMedicalInfo } from "../assets/apis";
import { useEffect } from "react";
import AlertModal from "../Components/AlertModal";
import { useAlert } from "../hooks/useAlert";

export function MedicalBox({ relativeSSN, patientSSN }) {
  const [showPopup, setShowPopup] = useState(false);

  const [form, setForm] = useState({
    patientSSN: patientSSN || "",
    relativeSSN: relativeSSN || localStorage.getItem("ssn") || "",
    doctorName: "",
    diagnosis: "",
    therapyDetails: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { alertState, showAlert, closeAlert } = useAlert();

  // Keep SSNs in sync with props/localStorage
  useEffect(() => {
    const rel = relativeSSN || localStorage.getItem("ssn") || "";
    const pat = patientSSN || "";
    setForm((prev) => ({ ...prev, relativeSSN: rel, patientSSN: pat }));
  }, [relativeSSN, patientSSN]);

  // Validation
  const validate = () => {
    let temp = {};

    // Don't validate SSNs - they're hidden and auto-filled
    if (!form.doctorName.trim()) temp.doctorName = "Doctor Name is required";
    if (!form.diagnosis.trim()) temp.diagnosis = "Diagnosis is required";
    if (!form.therapyDetails.trim())
      temp.therapyDetails = "Therapy details are required";

    if (!form.startDate) temp.startDate = "Start Date is required";
    if (!form.endDate) temp.endDate = "End Date is required";

    if (form.startDate && form.endDate) {
      if (new Date(form.startDate) > new Date(form.endDate)) {
        temp.endDate = "End date cannot be before start date";
      }
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleAdd = async () => {
    if (!validate()) return;

    // Check if SSNs are present before submitting
    if (!form.patientSSN || !form.relativeSSN) {
      showAlert(
        "Patient SSN or Relative SSN is missing. Please refresh and try again.",
        "error"
      );
      console.error("Missing SSNs:", {
        patientSSN: form.patientSSN,
        relativeSSN: form.relativeSSN,
      });
      return;
    }

    const payload = {
      patientSSN: form.patientSSN,
      doctorName: form.doctorName,
      diagnosis: form.diagnosis,
      therapyDeatils: form.therapyDetails, // API expects "Deatils" (typo on server)
      startDate: form.startDate + "T00:00:00.000Z",
      endDate: form.endDate + "T00:00:00.000Z",
      relativeSSN: form.relativeSSN,
    };

    console.log("Sending to API:", payload);
    console.log("Form state:", form);

    try {
      setIsSubmitting(true);
      const response = await addMedicalInfo(payload);
      // If the API returns text/plain or empty body, treat 200 OK as success
      if (response !== undefined) {
        showAlert("Medical info added successfully!", "success");

        // Reset form
        setForm({
          patientSSN: patientSSN || "",
          relativeSSN: relativeSSN || localStorage.getItem("ssn") || "",
          doctorName: "",
          diagnosis: "",
          therapyDetails: "",
          startDate: "",
          endDate: "",
        });
        setShowPopup(false);
      }
    } catch (err) {
      console.error("API Error:", err);
      console.error("Error details:", err.message);
      showAlert("Failed to add medical info. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Your original box */}
      <div className="medical-box">
        <h2>Relative</h2>
        <button className="medical-btn" onClick={() => setShowPopup(true)}>
          Add medical info
        </button>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h3>Add Medical Info</h3>

            {/* Hidden SSN inputs matching API parameter names */}
            <input
              type="hidden"
              name="patientSSN"
              value={form.patientSSN}
              readOnly
            />
            <input
              type="hidden"
              name="relativeSSN"
              value={form.relativeSSN}
              readOnly
            />

            <div className="popup-input-group">
              <label>Doctor Name</label>
              <input
                value={form.doctorName}
                onChange={(e) =>
                  setForm({ ...form, doctorName: e.target.value })
                }
                placeholder="Enter doctor name"
              />
              {errors.doctorName && (
                <span className="error">{errors.doctorName}</span>
              )}
            </div>

            <div className="popup-input-group">
              <label>Diagnosis</label>
              <input
                value={form.diagnosis}
                onChange={(e) =>
                  setForm({ ...form, diagnosis: e.target.value })
                }
                placeholder="Enter diagnosis"
              />
              {errors.diagnosis && (
                <span className="error">{errors.diagnosis}</span>
              )}
            </div>

            <div className="popup-input-group">
              <label>Therapy Details</label>
              <textarea
                value={form.therapyDetails}
                onChange={(e) =>
                  setForm({ ...form, therapyDetails: e.target.value })
                }
                placeholder="Enter therapy details"
              />
              {errors.therapyDetails && (
                <span className="error">{errors.therapyDetails}</span>
              )}
            </div>

            <div className="popup-row">
              <div className="popup-input-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                />
                {errors.startDate && (
                  <span className="error">{errors.startDate}</span>
                )}
              </div>

              <div className="popup-input-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                />
                {errors.endDate && (
                  <span className="error">{errors.endDate}</span>
                )}
              </div>
            </div>

            <div className="popup-actions">
              <button
                className="close-btn"
                onClick={() => setShowPopup(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="add-btn"
                onClick={handleAdd}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertState.isOpen}
        message={alertState.message}
        type={alertState.type}
        onClose={closeAlert}
      />
    </>
  );
}
