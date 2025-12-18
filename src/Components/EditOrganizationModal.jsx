import { useState } from "react";
import "./modal.css";

export default function EditOrganizationModal({
  isOpen,
  onClose,
  organizationData,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: organizationData?.name || "",
    contactInfo: organizationData?.contactInfo || "",
    address: organizationData?.address || "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

      const formDataToSend = new FormData();
      formDataToSend.append("Name", formData.name.trim());
      formDataToSend.append("Address", formData.address.trim() || "");
      formDataToSend.append("ContactInfo", formData.contactInfo.trim() || "");

      if (formData.image) {
        formDataToSend.append("Image", formData.image);
      }

      console.log("=== Update Organization Request ===");
      console.log("SSN:", ssn);
      console.log("Name:", formData.name.trim());
      console.log("Address:", formData.address.trim() || "");
      console.log("ContactInfo:", formData.contactInfo.trim() || "");
      console.log("Has Image:", !!formData.image);

      const response = await fetch(
        `https://localhost:7040/api/Organizations/UpdateOrganization/${ssn}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
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
        err.message || "Failed to update organization data. Please try again."
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

        <h2 className="modal-title">Edit Organization Profile</h2>

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
              placeholder="Enter organization name"
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

          <div className="form-group">
            <label>Organization Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  marginTop: "10px",
                  maxWidth: "200px",
                  borderRadius: "8px",
                }}
              />
            )}
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
