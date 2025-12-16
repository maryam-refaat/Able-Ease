import React, { useState, useEffect } from "react";
import "./ProgramModal.css";

export default function PositionModal({
  isOpen,
  onClose,
  handleSubmitPosition,
  position = false,
}) {
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form when editing existing position
  useEffect(() => {
    if (position) {
      setFormData({
        subject: position.subject || position.name || "",
        body: position.body || position.requirements || "",
      });
    } else {
      // Reset form for new position
      setFormData({
        subject: "",
        body: "",
      });
    }
    // Reset error when modal opens/closes
    setError(null);
    setLoading(false);
  }, [position, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Call the API through onSubmit
      await handleSubmitPosition(formData);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save position. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{position ? "Update Position" : "Add New Position"}</h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            disabled={loading}
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="program-form">
          <div className="form-row">
            <div className="form-group" style={{ flex: "1 1 100%" }}>
              <label htmlFor="subject">Position Title *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., Physical Therapist"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: "1 1 100%" }}>
              <label htmlFor="body">Requirements *</label>
              <textarea
                id="body"
                name="body"
                value={formData.body}
                onChange={handleChange}
                placeholder="Enter position requirements..."
                rows="6"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  {position ? "Updating..." : "Adding..."}
                </>
              ) : position ? (
                "Update Position"
              ) : (
                "Add Position"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}