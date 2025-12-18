import { useState } from "react";
import "./modal.css";

export default function EditPatientModal({
  isOpen,
  onClose,
  patientData,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: patientData?.name || patientData?.fullName || "",
    contactInfo: patientData?.contactInfo || patientData?.phone || "",
    address: patientData?.address || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setLoading(true);
      const ssn = localStorage.getItem("ssn");
      const token = localStorage.getItem("authToken");

      // Both programOrganizationSSN and programId must be provided together or both null
      const hasProgram =
        patientData?.programOrganizationSSN && patientData?.programId;

      const payload = {
        name: formData.name.trim(),
        address: formData.address.trim() || "",
        contactInfo: formData.contactInfo.trim() || "",
        gender: patientData?.gender || "Male",
        birthDate:
          patientData?.birthDate || patientData?.birthdate || "2025-12-18",
        relativeSSN: patientData?.relativeSSN || null,
        caregiverSSN: patientData?.caregiverSSN || null,
        programOrganizationSSN: hasProgram
          ? patientData.programOrganizationSSN
          : null,
        programId: hasProgram ? patientData.programId : null,
      };

      console.log("=== Update Patient Request ===");
      console.log("SSN:", ssn);
      console.log("Payload:", payload);

      const response = await fetch(
        `https://ableeaseapi.runasp.net/Patients/UpdatePatient/${ssn}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update failed with status:", response.status);
        console.error("Error response:", errorText);
        throw new Error(`Failed to update: ${response.status}`);
      }

      onSave && onSave();
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      setError(
        err.message || "Failed to update patient data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content-large" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <h2 className="modal-title">Edit Patient Profile</h2>

        {error && (
          <div
            style={{
              padding: "10px",
              marginBottom: "15px",
              background: "#fee",
              color: "#c33",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Info</label>
            <input
              type="text"
              value={formData.contactInfo}
              onChange={(e) =>
                setFormData({ ...formData, contactInfo: e.target.value })
              }
              placeholder="Enter contact info"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Enter address"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
