import { useState } from "react";
import "./modal.css";

export default function EditRelativeModal({
  isOpen,
  onClose,
  relativeData,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: relativeData?.name || "",
    contactInfo: relativeData?.contactInfo || "",
    address: relativeData?.address || "",
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

      const payload = {
        name: formData.name.trim(),
        contactInfo: formData.contactInfo.trim() || "",
        address: formData.address.trim() || "",
        gender: relativeData?.gender || "Male",
        birthDate: relativeData?.birthDate || "2025-12-18",
        patientSSN: relativeData?.patientSSN || null,
      };

      console.log("=== Update Relative Request ===");
      console.log("SSN:", ssn);
      console.log("Payload:", payload);

      const { BASE_URL } = await import("../assets/apis.js");
      const response = await fetch(
        `${BASE_URL}/Relative/UpdateRelative/${ssn}`,
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
        throw new Error(`Failed to update: ${response.status} - ${errorText}`);
      }

      onSave && onSave();
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      setError(
        err.message || "Failed to update relative data. Please try again."
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

        <h2 className="modal-title">Edit Relative Profile</h2>

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
