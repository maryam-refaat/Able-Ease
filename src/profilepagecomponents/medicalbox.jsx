import { useState } from "react";
import "../profilepagecomponents/profile.css";

export function MedicalBox() {
  const [showPopup, setShowPopup] = useState(false);

  // Dummy hidden IDs
  const RelativeSSN = "20001010123456";
  const PatientSSN = "19990909987654";

  const [form, setForm] = useState({
    doctorName: "",
    diagnosis: "",
    therapyDetails: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({});

  // Validation
  const validate = () => {
    let temp = {};

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

    const payload = {
      ...form,
      relativeSSN: RelativeSSN,
      patientSSN: PatientSSN,
    };

    console.log("Sending to API:", payload);

    try {
      await fetch("https://your-api.com/medical-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      alert("Medical info added successfully!");

      // Reset & close popup
      setForm({
        doctorName: "",
        diagnosis: "",
        therapyDetails: "",
        startDate: "",
        endDate: "",
      });
      setShowPopup(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add medical info.");
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

            <div className="popup-input-group">
              <label>Doctor Name</label>
              <input
                value={form.doctorName}
                onChange={(e) =>
                  setForm({ ...form, doctorName: e.target.value })
                }
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

            {/* Hidden Inputs */}
            <input type="hidden" value={RelativeSSN} />
            <input type="hidden" value={PatientSSN} />

            <div className="popup-actions">
              <button className="close-btn" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
              <button className="add-btn" onClick={handleAdd}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}